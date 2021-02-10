import logger from "../../util/logger.util";
import { Transaction } from "sequelize";
import { Cart } from "../../models/cart.model";
import { CartCreateDto } from "../../dtos/cart/cart-create.dto";
import { CartUpdateDto } from "../../dtos/cart/cart-update.dto";
import { productService } from "./product.service";
import { ProductNotFoundException } from "../../exceptions/product/product-not-found.exception";
import { Product } from "../../models/product.model";
import { Sequelize } from "sequelize";
import { User } from "../../models/user.model";
import { CompactProduct } from "../../models/compact-product.model";

class CartService {
  constructor() {
    logger.silly("[N-FT] CartService");
  }

  static getInstance(): CartService {
    return new CartService();
  }

  async showCart(cartId: number): Promise<Cart> {
    return Cart.findById(cartId);
  }

  async listCart(user_id: number, transaction?: Transaction): Promise<Cart> {
    return Cart.findOne({
      where     : {
        user_id: user_id
      }, include: [User],
      transaction
    });
  }

  async createCart(user_id: number, delivery_charge: number, transaction?: Transaction): Promise<Cart> {
    return Cart.create({
      user_id        : user_id,
      amount         : 0,
      delivery_charge: delivery_charge
    }, {transaction});
  }

  async updateProductOfCart(cart: Cart, data: CartCreateDto): Promise<Cart> {
    const index                    = cart.products.findIndex((p) => p.product_id === data.product_id);
    let newAmount                  = 0;
    let products: CompactProduct[] = [];
    if (index === -1) {
      const product = await productService.showProductById(data.product_id);
      if (!product) {
        throw new ProductNotFoundException();
      }
      products = cart.products;
      products.push({
        ...data,
        manufacturer: product.manufacturer,
        rate        : product.selling_price,
        pack_size   : product.pack_size,
        title       : product.title,
        image_url   : product.image_url,
        mrp         : product.mrp
      });

    } else {
      products                    = cart.products;
      products[index].no_of_units = data.no_of_units;
    }

    for (const cartProduct of products) {
      newAmount = newAmount + (cartProduct.no_of_units * cartProduct.rate);
    }
    return cart.update({
      products: products,
      amount  : newAmount
    });
  }

  async removeProductFromCart(cart: Cart, product_id: number): Promise<Cart> {
    const products = await cart.products.filter((product) => product.product_id !== product_id);
    let newAmount  = 0;
    for (const cartProduct of products) {
      newAmount = newAmount + (cartProduct.no_of_units * cartProduct.rate);
    }
    return cart.update({
      products: products,
      amount  : newAmount
    });
  }

  async emptyCart(cart: Cart) {
    return cart.update({
      products: [],
      amount  : 0,
    });
  }

  async productsFromCart(cart: Cart): Promise<Product[]> {
    const products: Product[] = [];
    for (const product of cart.products) {
      const fullProduct = await productService.showProductById(product.product_id);
      const totalCount  = product.no_of_units;
      for (let i = 0; i < totalCount; i++) {
        products.push(fullProduct);
      }
      // for (const count of totalCount) {
      // }
    }
    return products;
  }

  async countQuantityOfProduct(user_id: number, product_id: number) {
    const cart = await this.listCart(user_id);
    let count  = 0;
    for (const product of cart.products) {
      if (product.product_id === product_id) {
        count = product.no_of_units;
      }
    }
    return count;
  }
}

export const cartService = CartService.getInstance();
