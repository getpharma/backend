import { QueryInterface, SequelizeStatic } from "sequelize";
import { Helpers } from "../util/helpers.util";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus } from "../enums/payment-status.enum";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("orders", {
      id                : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      order_id          : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      user_id           : {
        type      : Sequelize.BIGINT,
        allowNull : false,
        references: {
          model: "users",
          key  : "id"
        },
        onDelete  : "cascade"
      },
      cart_id           : {
        allowNull : false,
        type      : Sequelize.BIGINT,
        references: {
          model: "carts",
          key  : "id"
        }
      },
      delivery_address  : {
        allowNull: false,
        type     : Sequelize.STRING
      },
      products          : {
        allowNull: true,
        type     : Sequelize.JSON
      },
      amount            : {
        type     : Sequelize.FLOAT,
        allowNull: false
      },
      delivery_charge   : {
        type     : Sequelize.FLOAT,
        allowNull: false
      },
      delivery_man_id   : {
        type      : Sequelize.BIGINT,
        allowNull : true,
        references: {
          model: "employees",
          key  : "id"
        },
        onDelete  : "set null"
      },
      packager_id       : {
        type      : Sequelize.BIGINT,
        allowNull : true,
        references: {
          model: "employees",
          key  : "id"
        },
        onDelete  : "set null"
      },
      delivery_code     : {
        allowNull: false,
        type     : Sequelize.STRING
      },
      payment_status    : {
        allowNull: false,
        type     : Sequelize.ENUM,
        values   : Helpers.iterateEnum(PaymentStatus)
      },
      order_status      : {
        allowNull: false,
        type     : Sequelize.ENUM,
        values   : Helpers.iterateEnum(OrderStatus)
      },
      pending_products  : {
        allowNull: true,
        type     : Sequelize.JSON
      },
      completed_products: {
        allowNull: true,
        type     : Sequelize.JSON
      },
      expected_date     : {
        allowNull: true,
        type     : Sequelize.DATEONLY
      },
      latitude          : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      longitude         : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      invoice_url       : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      createdAt         : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt         : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt         : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("orders"),
    ]);
  }
};
