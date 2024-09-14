'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categoryProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      categoryProducts.hasMany(models.Products, { foreignKey: 'categoryId' })
    }
  }
  categoryProducts.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'categoryProducts',
  });
  return categoryProducts;
};