import { QueryInterface, SequelizeStatic } from "sequelize";

export = {
  up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return queryInterface.createTable("products", {
      id                    : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      title                 : {
        type     : Sequelize.STRING,
        unique   : true,
        allowNull: false
      },
      manufacturer          : {
        type     : Sequelize.STRING,
        allowNull: false
      },
      pack_size             : {
        type     : Sequelize.STRING,
        allowNull: false
      },
      category_id           : {
        type      : Sequelize.BIGINT,
        allowNull : false,
        references: {
          model: "product_categories",
          key  : "id"
        },
        onDelete  : "cascade"
      },
      image_url             : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      mrp                   : {
        type     : Sequelize.FLOAT,
        allowNull: false
      },
      off_percentage        : {
        type     : Sequelize.FLOAT,
        allowNull: true
      },
      off_amount            : {
        type     : Sequelize.FLOAT,
        allowNull: true
      },
      selling_price         : {
        type     : Sequelize.FLOAT,
        allowNull: true
      },
      composition           : {
        type     : Sequelize.STRING,
        allowNull: true
      },
      is_trending           : {
        type        : Sequelize.BOOLEAN,
        allowNull   : false,
        defaultValue: 0
      },
      is_wholesaler_trending: {
        type        : Sequelize.BOOLEAN,
        allowNull   : false,
        defaultValue: 0
      },
      is_active             : {
        type        : Sequelize.BOOLEAN,
        allowNull   : false,
        defaultValue: 0
      },
      description           : {
        type     : Sequelize.TEXT,
        allowNull: true
      },
      createdAt             : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      updatedAt             : {
        allowNull: true,
        type     : Sequelize.DATE
      },
      deletedAt             : {
        allowNull: true,
        type     : Sequelize.DATE
      }
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
    return Promise.all([
      queryInterface.dropTable("products"),
    ]);
  }
};
