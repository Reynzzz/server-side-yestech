'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CaseList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CaseList.init({
    name: DataTypes.STRING,
    image: DataTypes.TEXT,
    location: DataTypes.STRING,
    product: DataTypes.STRING,
    details: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'CaseList',
  });
  return CaseList;
};