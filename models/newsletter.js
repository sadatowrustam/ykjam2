'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Newsletter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Newsletter.init({
    mail: DataTypes.STRING
  }, {
    sequelize,
    tableName:"newsletters",
    modelName: 'Newsletter',
  });
  return Newsletter;
};