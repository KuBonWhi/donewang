'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bid_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  bid_history.init({
    product_id: DataTypes.INTEGER,
    member_id: DataTypes.STRING,
    order: DataTypes.INTEGER,
    bid_time:{
      primaryKey: true,
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    },
    bid_price: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:false,
    underscored:false,
    createdAt:false,
    charset:'utf8',
    collate:'utf8_general_ci',
    modelName: 'bid_history',
  });
  return bid_history;
};