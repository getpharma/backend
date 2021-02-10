import { QueryInterface, SequelizeStatic } from "sequelize";
import { Helpers } from "../util/helpers.util";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus } from "../enums/payment-status.enum";
import { AvailabilityEnum } from "../enums/availability.enum";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("pickup_products", {
      id                   : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      wholesaler_product_id: {
        type      : Sequelize.BIGINT,
        allowNull : true,
        references: {
          model: "wholesalers_products",
          key  : "id"
        },
        onDelete  : "set null"
      },
      product_id           : {
        type      : Sequelize.BIGINT,
        allowNull : true,
        references: {
          model: "products",
          key  : "id"
        },
        onDelete  : "set null"
      },
      amount               : {
        type     : Sequelize.FLOAT,
        allowNull: true
      },
      required_quantity    : {
        type     : Sequelize.INTEGER,
        allowNull: false
      },
      availability         : {
        allowNull: true,
        type     : Sequelize.ENUM,
        values   : Helpers.iterateEnum(AvailabilityEnum)
      },
      available_quantity   : {
        allowNull: true,
        type     : Sequelize.INTEGER
      },
      delivery_date        : {
        allowNull: true,
        type     : Sequelize.DATEONLY
      },
      priority             : {
        allowNull   : false,
        type        : Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt            : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt            : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt            : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("pickup_products"),
    ]);
  }
};
