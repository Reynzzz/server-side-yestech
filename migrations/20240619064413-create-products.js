'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      mainImg: {
        type: Sequelize.TEXT, // Menggunakan TEXT untuk menampung array string
        allowNull: true,
        get() {
          const value = this.getDataValue('mainImg');
          return value ? value.split(',') : [];
        },
        set(value) {
          this.setDataValue('mainImg', value.join(','));
        }
      },
      parameters: {
        type: Sequelize.TEXT, // Menggunakan TEXT untuk menampung array string
        allowNull: true,
        get() {
          const value = this.getDataValue('parameters');
          return value ? value.split(',') : [];
        },
        set(value) {
          this.setDataValue('parameters', value.join(','));
        }
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true, 
        references: {
          model: 'categoryProducts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: true, 
        references: {
          model: 'Types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING
      },
      detailsHome : {
        type: Sequelize.STRING
      },
      sections : {
        type : Sequelize.JSON
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
    await queryInterface.dropTable('Products');
  }
};
