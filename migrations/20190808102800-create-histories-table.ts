import { QueryInterface, SequelizeStatic } from "sequelize";
import { Helpers } from "../util/helpers.util";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus } from "../enums/payment-status.enum";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("histories", {
      id                  : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      order_id            : {
        type     : Sequelize.BIGINT,
        allowNull: false
      },
      user_id             : {
        type      : Sequelize.BIGINT,
        allowNull : false,
        references: {
          model: "users",
          key  : "id"
        },
        onDelete  : "cascade"
      },
      products            : {
        allowNull: false,
        type     : Sequelize.JSON
      },
      undelivered_products: {
        allowNull: true,
        type     : Sequelize.JSON
      },
      amount              : {
        type     : Sequelize.FLOAT,
        allowNull: false
      },
      delivery_charge     : {
        type     : Sequelize.FLOAT,
        allowNull: false
      },
      delivery_address    : {
        type     : Sequelize.STRING,
        allowNull: false
      },
      delivery_man_id     : {
        type      : Sequelize.BIGINT,
        allowNull : true,
        references: {
          model: "employees",
          key  : "id"
        },
        onDelete  : "set null"
      },
      delivery_man        : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      packager            : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      packager_id         : {
        type      : Sequelize.BIGINT,
        allowNull : true,
        references: {
          model: "employees",
          key  : "id"
        },
        onDelete  : "set null"
      },
      payment_status      : {
        allowNull: false,
        type     : Sequelize.ENUM,
        values   : Helpers.iterateEnum(PaymentStatus)
      },
      order_status        : {
        allowNull: false,
        type     : Sequelize.ENUM,
        values   : Helpers.iterateEnum(OrderStatus)
      },
      delivery_date       : {
        allowNull: true,
        type     : Sequelize.DATEONLY
      },
      invoice_url         : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      createdAt           : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt           : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt           : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("histories"),
    ]);
  }
};
