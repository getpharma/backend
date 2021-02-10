import { QueryInterface, SequelizeStatic } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("carts", {
      id             : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      user_id        : {
        type      : Sequelize.BIGINT,
        allowNull : false,
        references: {
          model: "users",
          key  : "id"
        },
        onDelete  : "cascade"
      },
      products       : {
        type     : Sequelize.JSON,
        allowNull: false
      },
      amount         : {
        type     : Sequelize.FLOAT,
        allowNull: false
      },
      delivery_charge: {
        type        : Sequelize.FLOAT,
        allowNull   : true,
        defaultValue: 0
      },
      createdAt      : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt      : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt      : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("carts"),
    ]);
  }
};
