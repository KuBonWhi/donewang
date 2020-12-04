'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class public_account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  public_account.init({
    depositor_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    donation: DataTypes.INTEGER,
    total_sum: DataTypes.INTEGER,
    time: {
      primaryKey: true,
      type: 'DATETIME',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      //defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    timestamps:false,
    underscored:false,
    createdAt:false,
    charset:'utf8',
    collate:'utf8_general_ci',
    modelName: 'public_account',
  });
  return public_account;
};