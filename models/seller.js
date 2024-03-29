'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Seller extends Model {
        static associate({ Products,Categories,Banners,Etraps}) {
            this.hasMany(Products, { as: "products", foreignKey: "sellerId" })
            this.belongsToMany(Categories,{foreignKey:"sellerId",through:"Sellercategory",as:"category"},)
            this.hasMany(Banners,{as:"banners",foreignKey:"sellerId"})
            this.belongsTo(Etraps,{as:"etrap",foreignKey:"etrapId"})
        }
    }
    Seller.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        phone_number: DataTypes.STRING,
        name_tm: {
            type: DataTypes.STRING
        },
        name_ru: {
            type: DataTypes.STRING
        },
        name_en: {
            type: DataTypes.STRING
        },
        image: DataTypes.STRING,
        password: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        email:DataTypes.STRING,
        welayat:DataTypes.STRING,
        etrapId:DataTypes.INTEGER,
        delivery_price:DataTypes.INTEGER,
        free_delivery:DataTypes.INTEGER

    }, {
        sequelize,
        tableName: "sellers",
        modelName: 'Seller',
    });
    return Seller;
};