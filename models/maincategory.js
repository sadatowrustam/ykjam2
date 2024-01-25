'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Maincategory extends Model {
    static associate({Seller}) {
      this.hasMany(Seller,{as:"sellers",foreignKey:"maincategoryId"})
    }
  }
  Maincategory.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    name_tm: DataTypes.STRING,
    name_ru: DataTypes.STRING,
    name_en: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    tableName:"maincategories",
    modelName: 'Maincategory',
  });
  return Maincategory;
};