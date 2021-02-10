import { QueryInterface, SequelizeStatic } from "sequelize";
import { Helpers } from "../util/helpers.util";
import { EmployeeCategory } from "../enums/employee-category.enum";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("employees", {
      id            : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      name          : {
        type     : Sequelize.STRING,
        allowNull: false
      },
      email         : {
        type     : Sequelize.STRING,
        unique   : true,
        allowNull: false
      },
      mobile_no     : {
        type     : Sequelize.STRING,
        allowNull: false,
        unique   : true,
      },
      password      : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      aadhaar_no    : {
        type     : Sequelize.STRING,
        allowNull: true,
        unique   : true,
      },
      driver_license: {
        type     : Sequelize.STRING,
        allowNull: true
      },
      category      : {
        type     : Sequelize.ENUM,
        values   : Helpers.iterateEnum(EmployeeCategory),
        allowNull: false
      },
      address       : {
        allowNull: false,
        type     : Sequelize.STRING
      },
      pincode       : {
        allowNull: false,
        type     : Sequelize.INTEGER
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
      queryInterface.dropTable("employees"),
    ]);
  }
};
