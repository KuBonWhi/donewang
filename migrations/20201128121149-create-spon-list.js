'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('spon_list', {
      spon_info: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      spon_amount: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('spon_list');
  }
};