'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.belongsTo(models.categoryProducts, { foreignKey: 'categoryId' });
      Products.belongsTo(models.Type, { foreignKey: 'typeId' });
    }
  }
  Products.init({
    name: DataTypes.STRING,
    mainImg: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    detailsHome : DataTypes.TEXT,
    typeId :  DataTypes.INTEGER,
    sections : DataTypes.JSON,
    parameters : DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};