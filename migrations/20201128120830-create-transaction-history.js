'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction_history', {
      product_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seller: {
        type: Sequelize.STRING
      },
      buyer: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transaction_history');
  }
};