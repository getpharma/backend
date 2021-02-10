import logger from "../../util/logger.util";
import { Transaction } from "sequelize";
import moment from "moment";
import { Order } from "../../models/order.model";
import { wholesalerProductService } from "./wholesaler-product.service";
import { AvailabilityEnum } from "../../enums/availability.enum";
import { OrderStatus } from "../../enums/order-status.enum";
import { WholesalerProduct } from "../../models/wholesaler-product.model";
import { PickupProduct } from "../../models/pickup-product.model";
import { PickupProductUpdateDto } from "../../dtos/pickup-product/pickup-product-update.dto";
import { Sequelize } from "sequelize";
import { Wholesaler } from "../../models/wholesaler.model";
import { Product } from "../../models/product.model";
import { DaysEnum } from "../../enums/days.enum";
import { orderService } from "./order.service";
import { Stock } from "../../models/stock.model";
import { StockStatus } from "../../enums/stock-status.enum";
import { inventoryService } from "./inventory.service";

class PickupProductService {
  constructor() {
    logger.silly("[N-FT] PickupProductService");
  }

  static getInstance(): PickupProductService {
    return new PickupProductService();
  }

  async showPickupProduct(pickup_product_id: number): Promise<PickupProduct> {
    return PickupProduct.findOne({
      where     : {
        id: pickup_product_id
      }, include: [{
        model  : WholesalerProduct,
        include: [Wholesaler, Product]
      }]
    });
  }

  async showUpcoming(filters: { day?: DaysEnum }): Promise<PickupProduct[]> {
    if (filters.day) {
      const date = await orderService.nextDeliveryDate(filters.day);
      return PickupProduct.findAll({
        where     : {
          wholesaler_product_id: {
            [Sequelize.Op.ne]: null
          },
          availability         : AvailabilityEnum.PENDING,
          delivery_date        : date
        }, include: [WholesalerProduct],
        order     : [["id", "desc"]]
      });
    }
    return PickupProduct.findAll({
      where     : {
        wholesaler_product_id: {
          [Sequelize.Op.ne]: null
        },
        availability         : AvailabilityEnum.PENDING
      }, include: [WholesalerProduct],
      order     : [["id", "desc"]]
    });
  }

  async indexPP(filters: { status?: string; day?: string }): Promise<PickupProduct[]> {
    let whereClause: any;
    if (filters.status) {
      whereClause = {
        ...whereClause,
        availability: filters.status
      };
    }
    if (filters.day) {
      const date  = await orderService.nextDeliveryDate(filters.day);
      whereClause = {
        ...whereClause,
        delivery_date: date
      };
    }
    return PickupProduct.findAll({
      where  : whereClause,
      include: [WholesalerProduct],
      order  : [["id", "desc"]]
    });
  }

  async showUnassigned(filters: { day?: DaysEnum }): Promise<PickupProduct[]> {
    if (filters.day) {
      const date = await orderService.nextDeliveryDate(filters.day);
      return PickupProduct.findAll({
        where   : {
          wholesaler_product_id: null,
          delivery_date        : date
        }, order: [["id", "desc"]],
        include : [Product]
      });
    }
    return PickupProduct.findAll({
      where   : {
        wholesaler_product_id: null
      }, order: [["id", "desc"]],
      include : [Product]
    });
  }

  async showByWholesaler(wholesaler_id: number): Promise<PickupProduct[]> {
    const wholesalerProducts   = await wholesalerProductService.showByWholesalerId(wholesaler_id);
    const wholesalerProductIds = wholesalerProducts.map(wp => wp.id);
    return PickupProduct.findAll({
      where: {
        wholesaler_product_id: wholesalerProductIds
      }
    });
  }

  async createPickupProducts(order: Order, transaction?: Transaction): Promise<PickupProduct[]> {
    const pickup_products: PickupProduct[] = [];
    for (const product of order.products) {
      const stock = await Stock.findOne({
        where: {
          product_id: product.product_id,
        }, transaction
      });
      if (stock) {
        const newQty = stock.no_of_units - product.no_of_units;
        if (newQty > 0) {
          await stock.update({
            no_of_units: newQty,
          }, {transaction});
          await inventoryService.createInventory(product.product_id, product.no_of_units, transaction);
        } else if (newQty <= 0) {
          if (newQty < 0) {
            let pickup_product = await PickupProduct.findOne({
              where: {
                product_id   : product.product_id,
                availability : AvailabilityEnum.PENDING,
                delivery_date: order.expected_date
              }, transaction
            });
            const quantity     = 0 - newQty;
            if (pickup_product) {
              await pickup_product.update({
                required_quantity: pickup_product.required_quantity + quantity,
              }, {transaction});
            } else if (!pickup_product) {
              pickup_product = await PickupProduct.create({
                product_id       : product.product_id,
                required_quantity: quantity,
                availability     : AvailabilityEnum.PENDING,
                order_status     : OrderStatus.PENDING,
                delivery_date    : order.expected_date,
                priority         : 0
              }, {transaction});
            }
            pickup_products.push(pickup_product);
          }
          await inventoryService.createInventory(product.product_id, stock.no_of_units, transaction);
          await stock.destroy({transaction});
        }
      } else {
        let pickup_product = await PickupProduct.findOne({
          where: {
            product_id   : product.product_id,
            availability : AvailabilityEnum.PENDING,
            delivery_date: order.expected_date
          }, transaction
        });
        const quantity     = product.no_of_units;
        if (pickup_product) {
          await pickup_product.update({
            required_quantity: pickup_product.required_quantity + quantity,
          }, {transaction});
        } else if (!pickup_product) {
          pickup_product = await PickupProduct.create({
            product_id       : product.product_id,
            required_quantity: quantity,
            availability     : AvailabilityEnum.PENDING,
            order_status     : OrderStatus.PENDING,
            delivery_date    : order.expected_date,
            priority         : 0
          }, {transaction});
        }
        pickup_products.push(pickup_product);
      }
    }
    return pickup_products;
  }

  async assignWholesalersByDay(day: DaysEnum): Promise<PickupProduct[]> {
    const date            = await orderService.nextDeliveryDate(day);
    const pickup_products = await PickupProduct.findAll({
      where: {
        wholesaler_product_id: null,
        delivery_date        : date
      }
    });
    for (const pickup_product of pickup_products) {
      const wholesalerProducts = await wholesalerProductService.selectWholesalerProduct(pickup_product.product_id);

      if (wholesalerProducts.length) {
        await pickup_product.update({
          wholesaler_product_id: wholesalerProducts[0].id,
          amount               : pickup_product.required_quantity * wholesalerProducts[0].deal_price,
          priority             : pickup_product.priority + 1
        });
      }
    }
    return pickup_products;

  }

  async assignWholesalers(): Promise<PickupProduct[]> {
    const pickup_products = await PickupProduct.findAll({
      where: {
        wholesaler_product_id: null
      }
    });
    for (const pickup_product of pickup_products) {
      const wholesalerProducts = await wholesalerProductService.selectWholesalerProduct(pickup_product.product_id);

      if (wholesalerProducts.length) {
        await pickup_product.update({
          wholesaler_product_id: wholesalerProducts[0].id,
          amount               : pickup_product.required_quantity * wholesalerProducts[0].deal_price,
          priority             : pickup_product.priority + 1
        });
      }
    }
    return pickup_products;
  }

  async updatePickupProduct(pickup_product: PickupProduct, data: PickupProductUpdateDto, transaction?: Transaction): Promise<PickupProduct> {
    return pickup_product.update(data, {transaction});
  }

  async deletePickupProduct(pickup_product: PickupProduct, transaction?: Transaction): Promise<any> {
    return pickup_product.destroy({transaction});
  }

}

export const pickupProductService = PickupProductService.getInstance();
