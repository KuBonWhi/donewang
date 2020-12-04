'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product_info.init({
    product_id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
  },
    seller_id: DataTypes.STRING,
    product_describe: DataTypes.STRING,
    start_price: DataTypes.INTEGER,
    phone_num: DataTypes.STRING,
    interest_spon: DataTypes.INTEGER,
    product_picture: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    title: DataTypes.String,
  }, {
    sequelize,
    timestamps:true,
    underscored:false,
    createdAt:true,
    charset:'utf8',
    collate:'utf8_general_ci',
    modelName: 'product_info',
  });
  return product_info;
};