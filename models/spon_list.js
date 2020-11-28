'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class spon_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  spon_list.init({
    spon_info: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    spon_amount: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:false,
    underscored:false,
    createdAt:false,
    charset:'utf8',
    collate:'utf8_general_ci',
    modelName: 'spon_list',
  });
  return spon_list;
};