'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        static associate({ Products }) {
            this.belongsTo(Products, { foreignKey: "productId", as: "images" })
        }
    }
    Image.init({
        productId: DataTypes.INTEGER,
        image: DataTypes.STRING,
        low: DataTypes.STRING,
        medium: DataTypes.STRING,

    }, {
        sequelize,
        tableName: "images",
        modelName: 'Images',
    });
    return Image;
};