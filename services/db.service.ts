import { Sequelize } from "sequelize-typescript";
import { ENV_MYSQL_DB, ENV_MYSQL_HOSTNAME, ENV_MYSQL_PASSWORD, ENV_MYSQL_USER } from "../util/secrets.util";
import logger from "../util/logger.util";
import { QueryOptions } from "sequelize";
import { User } from "../models/user.model";
import { Employee } from "../models/employee.model";
import { ProductCategory } from "../models/product-category.model";
import { Product } from "../models/product.model";
import { Cart } from "../models/cart.model";
import { Order } from "../models/order.model";
import { History } from "../models/history.model";
import { Wholesaler } from "../models/wholesaler.model";
import { WholesalerProduct } from "../models/wholesaler-product.model";
import { PickupProduct } from "../models/pickup-product.model";
import { Pickup } from "../models/pickup.model";
import { Stock } from "../models/stock.model";
import { Inventory } from "../models/inventory.model";

class DBService {
  private _sequelize: Sequelize;

  private constructor() {
    logger.silly("[GD] DBService");
    this._sequelize = new Sequelize({
      dialect : "mysql",
      host    : ENV_MYSQL_HOSTNAME,
      database: ENV_MYSQL_DB,
      username: ENV_MYSQL_USER,
      password: ENV_MYSQL_PASSWORD,
    });

    this._sequelize.addModels([
      User,
      Employee,
      ProductCategory,
      Product,
      Cart,
      Order,
      History,
      Pickup,
      Wholesaler,
      PickupProduct,
      WholesalerProduct,
      Stock,
      Inventory
    ]);
  }

  static getInstance(): DBService {
    return new DBService();
  }

  async rawQuery(sql: string | { query: string, values: any[] }, options?: QueryOptions): Promise<any> {
    return this._sequelize.query(sql, options);
  }

  getSequelize(): Sequelize {
    return this._sequelize;
  }
}

export const dbService = DBService.getInstance();
