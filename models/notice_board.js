'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notice_board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  notice_board.init({
    notice_id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    timestamps:true,
    underscored:false,
    createdAt:true,
    charset:'utf8',
    collate:'utf8_general_ci',
    modelName: 'notice_board',
  });
  return notice_board;
};