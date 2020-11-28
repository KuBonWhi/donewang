'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class member_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //models.member_info.has
      // define association here
    }
  };
  member_info.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
    },
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    rank: DataTypes.INTEGER,
    phone_num: DataTypes.STRING,
    interest_spon: DataTypes.INTEGER,
    private_account: DataTypes.STRING,
    amount_donate: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps:false,
    underscored:false,
    createdAt:false,
    modelName: 'member_info',
    charset:'utf8',
    collate:'utf8_general_ci',
  });
  return member_info;
};