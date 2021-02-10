import { QueryInterface, SequelizeStatic } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("wholesalers", {
      id            : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      name          : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      store_name    : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      email         : {
        type     : Sequelize.STRING,
        unique   : true,
        allowNull: true
      },
      mobile_no     : {
        type     : Sequelize.STRING,
        allowNull: false,
        unique   : true,
      },
      alternate_no  : {
        type     : Sequelize.STRING,
        allowNull: true,
        unique   : true,
      },
      password      : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      address       : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      landmark      : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      state         : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      pincode       : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      pending_amount: {
        allowNull   : false,
        type        : Sequelize.FLOAT,
        defaultValue: 0
      },
      latitude      : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      longitude     : {
        allowNull: true,
        type     : Sequelize.STRING
      },
      is_active     : {
        allowNull: false,
        type     : Sequelize.BOOLEAN
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
      queryInterface.dropTable("wholesalers"),
    ]);
  }
};
