import { QueryInterface, SequelizeStatic } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("product_categories", {
      id       : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      title    : {
        type     : Sequelize.STRING,
        unique   : true,
        allowNull: false,
      },
      is_active: {
        type        : Sequelize.BOOLEAN,
        allowNull   : false,
        defaultValue: true
      },
      createdAt: {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("product_categories"),
    ]);
  }
};
