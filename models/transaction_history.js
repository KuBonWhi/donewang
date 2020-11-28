'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  transaction_history.init({
    product_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    seller: DataTypes.STRING,
    buyer: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:false,
    underscored:false,
    createdAt:false,
    charset:'utf8',
    collate:'utf8_general_ci',
    modelName: 'transaction_history',
  });
  return transaction_history;
};