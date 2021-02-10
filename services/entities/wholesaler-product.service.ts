import logger from "../../util/logger.util";
import { Transaction } from "sequelize";
import { WholesalerProductCreateDto } from "../../dtos/wholesaler-product/wholesaler-product-create.dto";
import { WholesalerProduct } from "../../models/wholesaler-product.model";
import { WholesalerProductUpdateDto } from "../../dtos/wholesaler-product/wholesaler-product-update.dto";
import { Product } from "../../models/product.model";
import { Wholesaler } from "../../models/wholesaler.model";
import { ProductWholesalerProductCreateDto } from "../../dtos/wholesaler-product/product-wholesaler-product-create.dto";
import { productService } from "./product.service";

class WholesalerProductService {
  private readonly LIMIT = 20;

  private constructor() {
    logger.silly("[N-FT] WholesalerProductService");
  }

  static getInstance(): WholesalerProductService {
    return new WholesalerProductService();
  }

  async create(data: WholesalerProductCreateDto, product: Product, transaction?: Transaction): Promise<WholesalerProduct> {
    data.mrp = product.mrp;
    if (data.off_percentage) {
      data.off_amount = data.mrp * data.off_percentage / 100;
      data.deal_price = data.mrp - data.off_amount;
    } else if (data.off_amount) {
      data.off_percentage = data.off_amount * 100 / data.mrp;
      data.deal_price     = (data.mrp - data.off_amount);
    } else {
      data.off_amount     = data.mrp - data.deal_price;
      data.off_percentage = data.off_amount * 100 / data.mrp;
    }
    return WholesalerProduct.create({
      ...data,
      product_name: product.title,
      mrp         : product.mrp,
    }, {transaction});
  }

  async createProductForWP(data: ProductWholesalerProductCreateDto, wholesalerId: number, transaction?: Transaction): Promise<WholesalerProduct> {
    const product = await Product.create({
      title       : data.title,
      manufacturer: data.manufacturer,
      mrp         : data.mrp,
      pack_size   : data.pack_size,
      category_id : data.category_id,
      is_active   : false
    }, {transaction});
    console.log(product);

    data.mrp = product.mrp;
    if (data.off_percentage) {
      data.off_amount = data.mrp * data.off_percentage / 100;
      data.deal_price = data.mrp - data.off_amount;
    } else if (data.off_amount) {
      data.off_percentage = data.off_amount * 100 / data.mrp;
      data.deal_price     = (data.mrp - data.off_amount);
    } else {
      data.off_amount     = data.mrp - data.deal_price;
      data.off_percentage = data.off_amount * 100 / data.mrp;
    }
    return WholesalerProduct.create({
      off_percentage: data.off_percentage,
      off_amount    : data.off_amount,
      deal_price    : data.deal_price,
      previous_price: data.deal_price,
      product_id    : product.id,
      wholesaler_id : wholesalerId,
      product_name  : product.title,
      mrp           : product.mrp,
      manufacturer  : product.manufacturer,
      composition   : data.composition,
      is_assigned   : false
    }, {transaction});
  }

  async show(wholesalerProductId: number, withIncludes?: boolean): Promise<WholesalerProduct> {
    return WholesalerProduct.findOne({
      where  : {
        id: wholesalerProductId
      },
      include: withIncludes ? [] : []
    });
  }

  async showByWholesalerAndProduct(wholesalerId: number, productId: number): Promise<WholesalerProduct> {
    return WholesalerProduct.findOne({
      where: {
        product_id   : productId,
        wholesaler_id: wholesalerId
      }
    });
  }

  async showByWholesalerId(wholesalerId: number): Promise<WholesalerProduct[]> {
    return WholesalerProduct.findAll({
      where: {
        wholesaler_id: wholesalerId
      }
    });
  }

  async showAssignedByWholesalerId(wholesalerId: number): Promise<WholesalerProduct[]> {
    return WholesalerProduct.findAll({
      where: {
        wholesaler_id: wholesalerId,
        is_assigned  : true
      }
    });
  }

  async showByProductId(productId: number): Promise<WholesalerProduct[]> {
    return WholesalerProduct.findAll({
      where: {
        product_id: productId
      }
    });
  }

  async update(wholesalerProduct: WholesalerProduct, data: WholesalerProductUpdateDto, is_admin?: boolean): Promise<WholesalerProduct> {
    if (!data.mrp) {
      data.mrp = wholesalerProduct.mrp;
    }
    if (data.off_percentage) {
      data.off_amount = data.mrp * data.off_percentage / 100;
      data.deal_price = data.mrp - data.off_amount;
    } else if (data.off_amount) {
      data.off_percentage = data.off_amount * 100 / data.mrp;
      data.deal_price     = (data.mrp - data.off_amount);
    } else if (data.deal_price) {
      data.off_amount     = data.mrp - data.deal_price;
      data.off_percentage = data.off_amount * 100 / data.mrp;
    }
    if (is_admin) {
      data.previous_price = data.deal_price;
    }
    return wholesalerProduct.update(data);
  }


  async selectWholesalerProduct(product_id: number): Promise<WholesalerProduct[]> {
    return WholesalerProduct.findAll({
      where  : {
        product_id : product_id
      },
      order  : [["deal_price", "asc"]],
      include: [Wholesaler]
    });
  }

  async delete(wholesalerProduct: WholesalerProduct): Promise<any> {
    await wholesalerProduct.destroy();
  }

  async showAssignedWP(): Promise<WholesalerProduct[]> {
    return WholesalerProduct.findAll({
      where  : {is_assigned: true},
      order  : [["product_name", "asc"]],
      include: [Wholesaler, Product]
    });
  }
}

export const wholesalerProductService = WholesalerProductService.getInstance();
