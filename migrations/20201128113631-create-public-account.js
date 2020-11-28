'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('public_account', {
      depositor_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      donation: {
        type: Sequelize.INTEGER
      },
      total_sum: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.TIMESTAMP
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('public_account');
  }
};