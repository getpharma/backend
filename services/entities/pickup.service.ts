import logger from "../../util/logger.util";
import { Wholesaler } from "../../models/wholesaler.model";
import { Pickup } from "../../models/pickup.model";
import { OrderStatus, PickupStatus } from "../../enums/order-status.enum";
import { PickupProduct } from "../../models/pickup-product.model";
import { CompactProductWholesaler } from "../../models/compact-product.model";
import { Helpers } from "../../util/helpers.util";
import { Transaction } from "sequelize";
import moment from "moment";
import { employeeService } from "./employee.service";
import { PickupUpdateDto } from "../../dtos/pickup/pickup-update.dto";
import { DaysEnum } from "../../enums/days.enum";
import { Order } from "../../models/order.model";
import { orderService } from "./order.service";

class PickupService {
  constructor() {
    logger.silly("[N-FT] PickupService");
  }

  static getInstance(): PickupService {
    return new PickupService();
  }

  async show(pickupId: number): Promise<Pickup> {
    return Pickup.findOne({
      where: {
        id: pickupId
      }
    });
  }

  async showPickupByWholesaler(wholesaler_id: number): Promise<Pickup[]> {
    return Pickup.findAll({
      where: {
        wholesaler_id: wholesaler_id
      },
      order: [["pickup_date", "asc"]]
    });
  }

  async showAcceptedPickupByWholesaler(wholesaler_id: number): Promise<Pickup[]> {
    return Pickup.findAll({
      where: {
        wholesaler_id: wholesaler_id,
        pickup_status: PickupStatus.PENDING
      },
      order: [["pickup_date", "asc"]]
    });
  }

  async showPickupByEmployee(employee_id: number): Promise<Pickup[]> {
    return Pickup.findAll({
      where  : {
        employee_id: employee_id
      },
      order  : [["pickup_date", "asc"]],
      include: [Wholesaler]
    });
  }

  async indexPickups(filters: { status?: PickupStatus }): Promise<Pickup[]> {
    let whereClause: any;
    if (filters.status) {
      whereClause = {
        ...whereClause,
        pickup_status: filters.status
      };
    }
    return Pickup.findAll({
      where: whereClause,
      order: [["pickup_date", "desc"]]
    });
  }

  async showPackagerInvoice(packager_id: number) {
    const pickups = await this.showPickupByEmployee(packager_id);
    const dates   = pickups.map(p => p.pickup_date).filter((value, index, self) => self.indexOf(value) === index);

    const invoices = [];
    for (const date of dates) {
      const compactPickups = [];
      for (const pickup of pickups) {
        if (pickup.pickup_date === date) {
          const compactPickup = {
            pickup_id      : pickup.pickup_id,
            wholesaler_name: pickup.wholesaler.name,
            items          : pickup.products.length,
            paid_amount    : pickup.amount
          };
          compactPickups.push(compactPickup);
        }
      }
      const invoice = {
        compactPickups: compactPickups,
        date          : date
      };
      invoices.push(invoice);
    }
    return invoices;

  }


  async showUpcomingPickup(wholesaler_id: number, transaction?: Transaction): Promise<Pickup> {
    return Pickup.findOne({
      where  : {
        wholesaler_id: wholesaler_id,
        pickup_status: PickupStatus.PENDING
      }, transaction,
      include: [Wholesaler]
    });
  }

  async addProductToPickup(pickupProduct: PickupProduct, transaction?: Transaction): Promise<Pickup> {
    const product: CompactProductWholesaler = {
      product_id  : pickupProduct.product_id,
      title       : pickupProduct.wholesalerProduct.product.title,
      rate        : pickupProduct.wholesalerProduct.deal_price,
      no_of_units : pickupProduct.available_quantity,
      amount      : pickupProduct.wholesalerProduct.deal_price * pickupProduct.available_quantity,
      image_url   : pickupProduct.wholesalerProduct.product.image_url,
      manufacturer: pickupProduct.wholesalerProduct.product.manufacturer,
      pack_size   : pickupProduct.wholesalerProduct.product.pack_size
    };

    const pickup     = await this.showUpcomingPickup(pickupProduct.wholesalerProduct.wholesaler_id, transaction);
    const wholesaler = pickupProduct.wholesalerProduct.wholesaler;

    if (!pickup) {
      const products: CompactProductWholesaler[] = [];
      products.push(product);
      // const employee = await employeeService.assignPackager(wholesaler.id);
      // console.log(employee);

      const pickup = await Pickup.create({
        wholesaler_id : wholesaler.id,
        products      : products,
        pickup_status : OrderStatus.PENDING,
        delivery_code : Helpers.generateRandomString(6, {includeNumbers: true}),
        pickup_address: wholesaler.address + "( near " + wholesaler.landmark + " )" + wholesaler.pincode,
        amount        : product.amount,
        latitude      : wholesaler.latitude,
        longitude     : wholesaler.longitude,
        // employee_id   : employee.id,
        // employee_name : employee.name
      }, {transaction});

      const user_id  = ("0000" + wholesaler.id).slice(-4);
      const order_id = "P" + moment().format("YYMMDD") + user_id + pickup.id;
      return pickup.update({pickup_id: order_id}, {transaction});
    } else {
      const products = pickup.products;
      let flag       = 1;
      for (const oldProduct of products) {
        if (oldProduct.product_id === product.product_id) {
          flag                   = 0;
          oldProduct.no_of_units = oldProduct.no_of_units + product.no_of_units;
          oldProduct.amount      = oldProduct.amount + product.amount;
        }
      }
      if (flag == 1) {
        products.push(product);
      }

      return pickup.update({
        products: products,
        amount  : pickup.amount + product.amount
      }, {transaction});
    }
  }

  async updatePickup(pickup: Pickup, data: PickupUpdateDto, transaction?: Transaction): Promise<Pickup> {
    return pickup.update(data, {transaction});
  }

  async deletePickup(pickup: Pickup): Promise<any> {
    return pickup.destroy();
  }
}

export const pickupService = PickupService.getInstance();
