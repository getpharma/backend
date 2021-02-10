import { QueryInterface, SequelizeStatic } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("wholesalers_products", {
      id            : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
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
      product_id    : {
        type      : Sequelize.BIGINT,
        allowNull : false,
        references: {
          model: "products",
          key  : "id"
        },
        onDelete  : "cascade"
      },
      product_name  : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      manufacturer  : {
        type     : Sequelize.STRING,
        allowNull: false
      },
      mrp           : {
        type     : Sequelize.FLOAT,
        allowNull: false
      },
      off_percentage: {
        type     : Sequelize.FLOAT,
        allowNull: true
      },
      off_amount    : {
        type     : Sequelize.FLOAT,
        allowNull: true
      },
      deal_price    : {
        type     : Sequelize.FLOAT,
        allowNull: true
      },
      previous_price: {
        type        : Sequelize.FLOAT,
        defaultValue: 0,
        allowNull   : true
      },
      composition   : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      is_assigned   : {
        type        : Sequelize.BOOLEAN,
        allowNull   : false,
        defaultValue: false
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
      queryInterface.dropTable("wholesalers_products"),
    ]);
  }
};
