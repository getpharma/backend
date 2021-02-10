import logger from "../../util/logger.util";
import { ProductCategory } from "../../models/product-category.model";
import { Product } from "../../models/product.model";
import { BulkCreateDto, ProductCreateDto } from "../../dtos/product/product-create.dto";
import { ProductUpdateDto } from "../../dtos/product/product-update.dto";
import { ProductIndexDto } from "../../dtos/product/product-index.dto";
import { Sequelize, Transaction } from "sequelize";
import { orderService } from "./order.service";
import { OrderStatus } from "../../enums/order-status.enum";

class ProductService {
  constructor() {
    logger.silly("[N-FT] ProductService");
  }

  static getInstance(): ProductService {
    return new ProductService();
  }

  async showCategory(categoryId: number): Promise<ProductCategory> {
    return ProductCategory.findById(categoryId);
  }

  async showProductById(product_id: number): Promise<Product> {
    return Product.findOne({where: {id: product_id}, include: [ProductCategory]});
  }

  async listCategories(): Promise<ProductCategory[]> {
    return ProductCategory.findAll({
      where: {
        is_active: true
      }
    });
  }

  async allCategories(): Promise<ProductCategory[]> {
    return ProductCategory.findAll();
  }

  async listProducts(filters: ProductIndexDto, category_id: number, withIncludes?: boolean): Promise<Product[]> {
    return Product.findAll({
      limit : filters.limit ? filters.limit : 100,
      offset: filters.offset ? filters.offset : 0,
      where : {
        is_active  : true,
        category_id: category_id,
      },
      order : [["title", "asc"]]
    });
  }

  async allProducts(filters?: ProductIndexDto, withIncludes?: boolean): Promise<Product[]> {
    if (filters.query && filters.query !== "") {
      return Product.findAll({
        limit : filters.limit ? filters.limit : 100,
        offset: filters.offset ? filters.offset : 0,
        where : {
          ["title" as any]: {
            like: "%" + filters.query + "%"
          },
          is_active       : true
        },
        order : [["title", "asc"]]
      });
    }
    if (filters.query == "") {
      return Product.findAll({
        limit : filters.limit ? filters.limit : 100,
        offset: filters.offset ? filters.offset : 0,
        order : [["title", "asc"]]
      });
    } else {
      return Product.findAll({
        limit : filters.limit ? filters.limit : 100,
        offset: filters.offset ? filters.offset : 0,
        where : {
          is_active: true
        }
      });
    }
  }

  async productsForAdmin(filters?: ProductIndexDto, withIncludes?: boolean): Promise<Product[]> {
    if (filters.query && filters.query !== "") {
      return Product.findAll({
        limit : filters.limit ? filters.limit : 100,
        offset: filters.offset ? filters.offset : 0,

        where  : {
          [Sequelize.Op.or]: {
            ["title" as any]       : {
              like: "%" + filters.query + "%"
            },
            ["manufacturer" as any]: {
              like: "%" + filters.query + "%"
            }
          },
        },
        order  : [["title", "asc"]],
        include: [ProductCategory]
      });
    }
    if (filters.query == "") {
      return [];
    } else {
      return Product.findAll({
        limit : filters.limit ? filters.limit : 100,
        offset: filters.offset ? filters.offset : 0,
        order : [["title", "asc"]],
      });
    }
  }

  async trendingProducts(): Promise<Product[]> {
    return Product.findAll({
      where: {
        is_trending: true,
        is_active  : true
      }
    });
  }

  async wholesalerTrends(categoryId: number, wpIds: number[]): Promise<Product[]> {
    const orders               = await orderService.indexOrders({status: OrderStatus.PENDING});
    const productIds: number[] = [];
    for (const order of orders) {
      for (const product of order.products) {
        productIds.push(product.product_id);
      }
    }
    const distinctIds         = productIds.filter((value, index, self) => self.indexOf(value) === index);
    const products: Product[] = await Product.findAll({
      where : {
        id         : distinctIds,
        category_id: categoryId
      },
      limit : 100,
      offset: 0
    });

    const trending    = await Product.findAll({
      where : {
        is_wholesaler_trending: true,
        category_id           : categoryId
      },
      limit : 100,
      offset: 0
    });
    const allProducts = products.concat(trending);
    const newProducts = allProducts.filter(p => wpIds.indexOf(p.id) === -1);
    return newProducts.filter((value, index, self) =>
      index === self.findIndex(p => p.id === value.id)
    );
  }

  async addCategory(title: string, image_url: string): Promise<ProductCategory> {
    return ProductCategory.create({
      title    : title,
      image_url: image_url
    });
  }

  async addProduct(data: ProductCreateDto, image_url: string, transaction?: Transaction): Promise<Product> {
    if (data.off_percentage != null) {
      data.off_amount    = data.mrp * data.off_percentage / 100;
      data.selling_price = data.mrp - data.off_amount;
    } else if (data.off_amount != null) {
      data.off_percentage = data.off_amount * 100 / data.mrp;
      data.selling_price  = (data.mrp - data.off_amount);
    } else if (data.selling_price != null) {
      data.off_amount     = data.mrp - data.selling_price;
      data.off_percentage = data.off_amount * 100 / data.mrp;
    }
    return Product.create({
      ...data,
      is_active: true,
      image_url: image_url,
    }, {transaction});
  }

  async bulkCreateProduct(data: BulkCreateDto) {
    return Product.create({
      ...data,
      is_active: true
    });
  }

  async updateCategory(category: ProductCategory, title: string, is_active: boolean, image_url: string): Promise<ProductCategory> {
    return category.update({
      is_active: is_active,
      title    : title,
      image_url: image_url
    });
  }

  async updateProduct(product: Product, data: ProductUpdateDto, image_url: string): Promise<Product> {
    if (!data.mrp) {
      data.mrp = product.mrp;
    }
    if (data.off_percentage) {
      data.off_amount    = data.mrp * data.off_percentage / 100;
      data.selling_price = data.mrp - data.off_amount;
    } else if (data.off_amount) {
      data.off_percentage = data.off_amount * 100 / data.mrp;
      data.selling_price  = (data.mrp - data.off_amount);
    } else {
      data.off_amount     = data.mrp - data.selling_price;
      data.off_percentage = data.off_amount * 100 / data.mrp;
    }
    return product.update({
      ...data,
      image_url: image_url,
    });
  }

  async deleteCategory(category: ProductCategory) {
    return category.destroy();
  }

  async deleteProduct(product: Product) {
    return product.destroy();
  }

}

export const productService = ProductService.getInstance();
