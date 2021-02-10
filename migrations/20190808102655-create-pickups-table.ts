import { QueryInterface, SequelizeStatic } from "sequelize";
import { Helpers } from "../util/helpers.util";
import { OrderStatus, PickupStatus } from "../enums/order-status.enum";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("pickups", {
      id            : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      pickup_id     : {
        allowNull: true,
        type     : Sequelize.STRING,
      },
      wholesaler_id : {
        type      : Sequelize.BIGINT,
        allowNull : false,
        references: {
          model: "wholesalers",
          key  : "id"
        },
        onDelete  : "cascade"
      },
      products      : {
        type     : Sequelize.JSON,
        allowNull: false
      },
      pickup_status : {
        allowNull: false,
        type     : Sequelize.ENUM,
        values   : Helpers.iterateEnum(PickupStatus)
      },
      delivery_code : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      employee_id   : {
        type      : Sequelize.BIGINT,
        allowNull : true,
        references: {
          model: "employees",
          key  : "id"
        },
        onDelete  : "set null"
      },
      pickup_address: {
        allowNull: true,
        type     : Sequelize.STRING
      },
      pickup_date   : {
        allowNull: true,
        type     : Sequelize.DATEONLY
      },
      employee_name : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      amount        : {
        allowNull: false,
        type     : Sequelize.FLOAT
      },
      latitude      : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      longitude     : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      createdAt     : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt     : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt     : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("pickups"),
    ]);
  }
};
