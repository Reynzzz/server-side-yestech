'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class historyYestech extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  historyYestech.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'historyYestech',
  });
  return historyYestech;
};