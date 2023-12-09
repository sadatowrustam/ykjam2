'use strict';
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('addresses', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            welayat: {
                type: DataTypes.STRING
            },
            address: {
                type: DataTypes.STRING
            },
            userId: {
                type: DataTypes.UUID
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    async down(queryInterface, DataTypes) {
        await queryInterface.dropTable('addresses');
    }
};