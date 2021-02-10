import { QueryInterface, SequelizeStatic } from "sequelize";
import { Helpers } from "../util/helpers.util";
import { DaysEnum } from "../enums/days.enum";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("users", {
      id               : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      name             : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      store_name       : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      email            : {
        type     : Sequelize.STRING,
        unique   : true,
        allowNull: true
      },
      mobile_no        : {
        type     : Sequelize.STRING,
        allowNull: false,
        unique   : true,
      },
      alternate_no     : {
        type     : Sequelize.STRING,
        allowNull: true,
        unique   : true,
      },
      delivery_day     : {
        type     : Sequelize.ENUM,
        allowNull: false,
        values   : Helpers.iterateEnum(DaysEnum)
      },
      password         : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      address          : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      permanent_address: {
        allowNull: true,
        type     : Sequelize.STRING
      },
      landmark         : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      state            : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      pincode          : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      delivery_charge  : {
        allowNull   : false,
        type        : Sequelize.FLOAT,
        defaultValue: 0
      },
      latitude         : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      longitude        : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      favorites        : {
        allowNull: false,
        type     : Sequelize.JSON
      },
      is_active        : {
        allowNull: false,
        type     : Sequelize.BOOLEAN
      },
      createdAt        : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt        : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt        : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("users"),
    ]);
  }
};
