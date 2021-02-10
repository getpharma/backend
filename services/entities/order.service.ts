import logger from "../../util/logger.util";
import { Transaction } from "sequelize";
import { Order } from "../../models/order.model";
import moment from "moment";
import { Helpers } from "../../util/helpers.util";
import { PaymentStatus } from "../../enums/payment-status.enum";
import { OrderStatus } from "../../enums/order-status.enum";
import { OrderUpdateDto } from "../../dtos/order/order-update.dto";
import { User } from "../../models/user.model";
import { Cart } from "../../models/cart.model";
import { CompactProduct } from "../../models/compact-product.model";
import { InsufficientQuantityException } from "../../exceptions/cart/insufficient-quantity.exception";
import { DaysEnum } from "../../enums/days.enum";
import { inventoryService } from "./inventory.service";
import { UnauthorizedException } from "../../exceptions/root/unauthorized.exception";
import { userService } from "./user.service";
import { add } from "winston";
import { Product } from "../../models/product.model";

class OrderService {
  constructor() {
    logger.silly("[N-FT] OrderService");
  }

  static getInstance(): OrderService {
    return new OrderService();
  }

  async showOrder(order_id: number): Promise<Order> {
    return Order.findOne({
      where     : {
        id: order_id
      }, include: [User]
    });
  }

  async showByPackager(packager_id: number): Promise<Order[]> {
    return Order.findAll({
      where: {
        packager_id: packager_id
      }
    });
  }

  async showByDeliveryMan(delivery_man_id: number): Promise<Order[]> {
    return Order.findAll({
      where: {
        delivery_man_id: delivery_man_id
      }
    });
  }

  async indexOrders(filters: { status?: OrderStatus, day?: DaysEnum }): Promise<Order[]> {
    let whereClause: any;
    if (filters.status) {
      whereClause = {
        ...whereClause,
        order_status: filters.status
      };
    }
    if (filters.day) {
      const date  = await this.nextDeliveryDate(filters.day);
      whereClause = {
        ...whereClause,
        expected_date: date
      };
    }
    return Order.findAll({
      where: whereClause,
      order: [["id", "desc"]]
    });
  }

  async showIncompleteOrders(user_id: number, withIncludes?: boolean): Promise<Order[]> {
    return Order.findAll({
      where  : {
        user_id: user_id
      },
      include: withIncludes ? [User] : [],
      order  : [["id", "desc"]]
    });
  }

  async nextDeliveryDate(day: string): Promise<string> {
    const dayINeed = moment().isoWeekday(day); // for Thursday
    console.log(dayINeed);
    const today = moment();

    if (today <= dayINeed) {
      return dayINeed.format("YYYY-MM-DD");
    } else {
      return moment().add(1, "weeks").isoWeekday(day).format("YYYY-MM-DD");
    }
  }


  async addOrder(user: User, cart: Cart, transaction?: Transaction): Promise<Order> {
    const favOrder: number[] = cart.products.map(p => p.product_id);
    const newFav: number[] = [...user.favorites, ...favOrder].filter((value, index, self) => self.indexOf(value) === index);
    const updatedUser      = await user.update({
      favorites: newFav
    }, {transaction});
    const products: Product[] = [];
    for (const productId of favOrder) {
      const product = Product.update({
        is_wholesaler_trending: true
      }, {
        where: {
          id: productId
        },
        transaction
      });
    }
    const date = await this.nextDeliveryDate(user.delivery_day);

    const order = await Order.create({
      cart_id           : cart.id,
      order_id          : 2 * Date.now(),
      user_id           : user.id,
      pending_products  : [],
      completed_products: [],
      products          : cart.products,
      amount            : cart.amount,
      latitude          : user.latitude,
      longitude         : user.longitude,
      delivery_charge   : cart.delivery_charge,
      delivery_address  : user.address + "(near " + user.landmark + ")" + " , " + user.pincode,
      delivery_code     : await Helpers.generateRandomString(6, {
        includeNumbers: true
      }),
      payment_status    : PaymentStatus.PENDING,
      order_status      : OrderStatus.PENDING,
      expected_date     : date
    }, {transaction});

    const user_id  = ("0000" + user.id).slice(-4);
    const order_id = moment().format("YYMMDD") + user_id + order.id;

    return order.update({order_id: order_id}, {transaction});
  }

  async createOrder(user: User, cart: any, address: string, transaction?: Transaction): Promise<Order> {
    const date  = await this.nextDeliveryDate(user.delivery_day);
    const order = await Order.create({
      cart_id           : cart.id,
      user_id           : user.id,
      pending_products  : [],
      completed_products: [],
      products          : cart.products,
      amount            : cart.amount,
      latitude          : user.latitude,
      longitude         : user.longitude,
      delivery_charge   : cart.delivery_charge,
      delivery_address  : address,
      delivery_code     : await Helpers.generateRandomString(6, {
        includeNumbers: true
      }),
      payment_status    : PaymentStatus.PENDING,
      order_status      : OrderStatus.PENDING,
      expected_date     : date
    }, {transaction});

    const user_id  = ("0000" + user.id).slice(-4);
    const order_id = moment().format("YYMMDD") + user_id + order.id;

    return order.update({order_id: order_id}, {transaction});
  }

  async changeStatus(order: Order, data: { available: boolean; product_id: number; no_of_units?: number }): Promise<Order> {
    const product = order.products.find((p) => p.product_id === data.product_id);
    if (!product) {
      throw new UnauthorizedException("Product Not in Order", 305);
    }
    const inventory = await inventoryService.showByProductId(data.product_id);
    if (!inventory) {
      throw new UnauthorizedException("Product Not Present in Inventory", 304);
    }
    if (data.available === true) {
      const completedProducts = order.completed_products;
      completedProducts.push(product);
      const availableProducts = await order.products.filter((p) => p.product_id !== product.product_id);
      const newQty            = inventory.no_of_units - product.no_of_units;
      if (newQty < 0) {
        throw new UnauthorizedException("Product Not Available in Inventory", 303);
      }
      await inventory.update({
        no_of_units: newQty
      });
      return order.update({
        products          : availableProducts,
        completed_products: completedProducts,
      });
    } else {
      const pendingProducts  = order.pending_products;
      const completeProducts = order.completed_products;
      let availableProducts: CompactProduct[];
      if (product.no_of_units === data.no_of_units) {
        pendingProducts.push(product);
      } else if (product.no_of_units > data.no_of_units) {
        const completeProduct: CompactProduct = {...product, no_of_units: product.no_of_units - data.no_of_units};
        const pendingProduct: CompactProduct  = {...product, no_of_units: data.no_of_units};
        if (completeProduct) {
          const newQty = inventory.no_of_units - completeProduct.no_of_units;
          if (newQty < 0) {
            throw new UnauthorizedException("Product Not Available in Inventory", 303);
          }
          await inventory.update({
            no_of_units: newQty
          });
        }
        completeProducts.push(completeProduct);
        pendingProducts.push(pendingProduct);
      } else {
        throw new InsufficientQuantityException();
      }
      availableProducts = await order.products.filter((p) => p.product_id !== product.product_id);
      const amount      = order.amount - (product.rate * data.no_of_units);
      return order.update({
        products          : availableProducts,
        pending_products  : pendingProducts,
        completed_products: completeProducts,
        amount            : amount
      });
    }
  }

  async updateOrder(order: Order, data: OrderUpdateDto, transaction?: Transaction): Promise<Order> {
    return order.update(data, {transaction});
  }

  async deleteOrder(order: Order, transaction?: Transaction): Promise<any> {
    return order.destroy({transaction});
  }

}

export const orderService = OrderService.getInstance();
