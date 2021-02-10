import logger from "../../util/logger.util";
import { Transaction } from "sequelize";
import { Order } from "../../models/order.model";
import { History } from "../../models/history.model";
import { HistoryCreateDto } from "../../dtos/order/history-create.dto";
import { EmployeeHistoryIndexDto } from "../../dtos/order/employee-history-index.dto";
import { employeeService } from "./employee.service";
import { OrderStatus } from "../../enums/order-status.enum";
import moment from "moment";
import { Product } from "../../models/product.model";
import { productService } from "./product.service";
import { User } from "../../models/user.model";

class HistoryService {
  constructor() {
    logger.silly("[N-FT] HistoryService");
  }

  static getInstance(): HistoryService {
    return new HistoryService();
  }

  async showHistory(user_id: number): Promise<History[]> {
    return History.findAll({
      where: {
        user_id: user_id
      }
    });
  }

  async showDeliveryManHistory(employee_id: number, filters?: EmployeeHistoryIndexDto, withIncludes?: boolean): Promise<History[]> {
    if (filters.query && filters.query !== "") {
      return History.findAll({
        where  : {
          delivery_man_id: employee_id,
          delivery_date  : filters.query
        },
        order  : [["delivery_date", "asc"]],
        include: [User]
      });
    }
    if (filters.query == "") {
      return [];
    } else {
      return History.findAll({where: {delivery_man_id: employee_id}, include: [User]});
    }
  }

  async showPackagerHistory(employee_id: number, filters?: EmployeeHistoryIndexDto, withIncludes?: boolean): Promise<History[]> {
    if (filters.query && filters.query !== "") {
      return History.findAll({
        where: {
          packager_id  : employee_id,
          delivery_date: filters.query
        },
        order: [["delivery_date", "asc"]]
      });
    }
    if (filters.query == "") {
      return [];
    } else {
      return History.findAll({where: {packager_id: employee_id}});
    }
  }

  async showAdminHistory(employee_id: number, filters?: EmployeeHistoryIndexDto, withIncludes?: boolean): Promise<History[]> {
    if (filters.query && filters.query !== "") {
      return History.findAll({
        where: {
          delivery_date: filters.query
        },
        order: [["delivery_date", "desc"]]
      });
    }
    if (filters.query == "") {
      return [];
    } else {
      return History.findAll();
    }
  }

  async createHistory(data: Order, transaction?: Transaction): Promise<History> {
    let date = data.expected_date;
    if (data.order_status !== OrderStatus.DELIVERED) {
      date = moment().toDate();
    }
    const history: HistoryCreateDto = {
      order_id            : data.order_id,
      user_id             : data.user_id,
      products            : data.completed_products,
      undelivered_products: data.pending_products,
      amount              : data.amount,
      delivery_charge     : data.delivery_charge,
      delivery_date       : date,
      delivery_address    : data.delivery_address,
      packager_id         : data.packager_id,
      delivery_man_id     : data.delivery_man_id,
      payment_status      : data.payment_status,
      order_status        : data.order_status,
      invoice_url         : data.invoice_url,
    };
    if (data.packager_id && data.packager) {
      history.packager = data.packager.name;
    } else if (data.packager_id) {
      const packager   = await employeeService.show(data.packager_id);
      history.packager = packager.name;
    }

    if (data.delivery_man_id && data.delivery_man) {
      history.delivery_man = data.delivery_man.name;
    } else if (data.delivery_man_id) {
      const delivery_man   = await employeeService.show(data.delivery_man_id);
      history.delivery_man = delivery_man.name;
    }
    return History.create(history, {transaction});
  }

  async indexHistory(filters: { day?: string }): Promise<History[]> {
    let whereClause: any;
    if (filters.day) {
      if (filters.day === "today") {
        whereClause = {
          ...whereClause,
          delivery_date: moment().format("YYYY-MM-DD")
        };
      }
      if (filters.day === "yesterday") {
        whereClause = {
          ...whereClause,
          delivery_date: moment().subtract(1, "days").format("YYYY-MM-DD")
        };
      }
    }
    return History.findAll({
      where: whereClause,
      order: [["delivery_date", "desc"], ["createdAt", "desc"]]
    });
  }

  async productSold() {
    const history = await History.findAll({
      where: {
        order_status: OrderStatus.DELIVERED
      }
    });

    const resProducts: { product_id: number; quantity: number; product: Product }[] = [];
    for (const order of history) {
      for (const product of order.products) {
        const resProduct = resProducts.find(p => p.product_id === product.product_id);
        if (resProduct) {
          const index        = resProducts.indexOf(resProduct);
          resProducts[index] = {
            product_id: resProduct.product_id,
            quantity  : resProduct.quantity + product.no_of_units,
            product   : resProduct.product
          };
        } else {
          const np = await productService.showProductById(product.product_id);
          resProducts.push({
            product_id: product.product_id,
            quantity  : product.no_of_units,
            product   : np
          });
        }
      }
    }
    return resProducts.sort((a, b) => (a.quantity < b.quantity) ? 1 : -1);
  }

  async deliveryManInvoice(histories: History[]) {
    const dates = histories.map(h => h.delivery_date).filter((value, index, self) => self.indexOf(value) === index);

    const invoices = [];
    for (const date of dates) {
      let amount             = 0;
      const compactHistories = [];
      for (const history of histories) {
        if (history.delivery_date === date && history.order_status === OrderStatus.DELIVERED) {
          const compactHistory = {
            order_id     : history.order_id,
            retailer_name: history.user.name,
            address      : history.delivery_address,
            amount       : history.amount
          };
          amount               = amount + history.amount;
          compactHistories.push(compactHistory);
        }
      }
      const invoice = {
        compact_history: compactHistories,
        date           : date,
        total_orders   : compactHistories.length,
        total_amount   : amount
      };
      invoices.push(invoice);
    }
    return invoices.filter(value => (value.total_orders !== 0));
  }

}

export const historyService = HistoryService.getInstance();
