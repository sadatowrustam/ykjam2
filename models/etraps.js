'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etraps extends Model {
    static associate({Products,Seller}) {
      this.hasMany(Products,{as:"products",foreignKey:"etrapId"})
      this.hasMany(Seller,{as:"seller",foreignKey:"etrapId"})
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