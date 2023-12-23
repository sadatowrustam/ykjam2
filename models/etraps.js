'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etraps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Products}) {
      this.hasMany(Products,{as:"products",foreignKey:"etrapId"})
    }
  }
  Etraps.init({
    welayat: DataTypes.STRING,
    name_tm: DataTypes.STRING,
    name_ru: DataTypes.STRING,
    name_en: DataTypes.STRING
  }, {
    sequelize,
    tableName:"etraps",
    modelName: 'Etraps',
  });
  return Etraps;
};