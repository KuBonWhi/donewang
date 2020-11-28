'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_info', {
      product_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seller_id: {
        type: Sequelize.STRING
      },
      product_describe: {
        type: Sequelize.STRING
      },
      start_price: {
        type: Sequelize.INTEGER
      },
      phone_num: {
        type: Sequelize.STRING
      },
      interest_spon: {
        type: Sequelize.INTEGER
      },
      product_picture: {
        type: Sequelize.BLOB
      },
      duration: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_info');
  }
};