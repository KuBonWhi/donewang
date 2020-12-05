'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('member_info', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      rank: {
        type: Sequelize.INTEGER
      },
      phone_num: {
        type: Sequelize.STRING
      },
      interest_spon: {
        type: Sequelize.INTEGER
      },
      private_account: {
        type: Sequelize.STRING
      },
      amount_donate: {
        type: Sequelize.INTEGER
      },
      name : {
        type: Sequelize.STRING
      },
      nickname : {
        type: Sequelize.STRING
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('member_info');
  }
};