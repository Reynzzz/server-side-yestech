'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class YestechOwner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      YestechOwner.belongsTo(models.categoryYestechOwner)
    }
  }
  YestechOwner.init({
    name: DataTypes.STRING,
    details: DataTypes.TEXT,
    noHp: DataTypes.STRING,
    image : DataTypes.STRING,
    email: DataTypes.STRING,
    alamat: DataTypes.STRING,
    linkWeb : DataTypes.STRING,
    instagram : DataTypes.STRING,
    facebook : DataTypes.STRING,
    tiktok : DataTypes.STRING,
    youtube : DataTypes.STRING,
    categoryYestechOwnerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'YestechOwner',
  });
  return YestechOwner;
};