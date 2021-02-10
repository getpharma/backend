import { QueryInterface, SequelizeStatic } from "sequelize";
import { Helpers } from "../util/helpers.util";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus } from "../enums/payment-status.enum";
import { StockStatus } from "../enums/stock-status.enum";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("inventories", {
      id         : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      product_id : {
        type      : Sequelize.BIGINT,
        allowNull : false,
        references: {
          model: "products",
          key  : "id"
        }
      },
      no_of_units: {
        type     : Sequelize.INTEGER,
        allowNull: false
      },
      createdAt  : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt  : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt  : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("inventories"),
    ]);
  }
};
