'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CaseLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT, // Menggunakan TEXT untuk menampung array string
        allowNull: true,
        get() {
          const value = this.getDataValue('image');
          return value ? value.split(',') : [];
        },
        set(value) {
          this.setDataValue('image', value.join(','));
        }
      },
      location: {
        type: Sequelize.STRING
      },
      product: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CaseLists');
  }
};