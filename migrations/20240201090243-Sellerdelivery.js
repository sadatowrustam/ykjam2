'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sellers', 'delivery_price', {
      type: Sequelize.INTEGER,
      defaultValue:15
    });
    await queryInterface.addColumn('sellers', 'free_delivery', {
      type: Sequelize.INTEGER,
      defaultValue:100
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
