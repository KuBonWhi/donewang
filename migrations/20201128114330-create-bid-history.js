'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bid_history', {
      product_id: {
        type: Sequelize.INTEGER
      },
      member_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      bid_time: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.TIMESTAMP
      },
      bid_price: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bid_history');
  }
};