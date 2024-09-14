'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('YestechOwners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.TEXT
      },
      noHp: {
        type: Sequelize.STRING
      },
      image : {
        type : Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      linkWeb: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      facebook: {
        type: Sequelize.STRING
      },
      tiktok: {
        type: Sequelize.STRING
      },
      youtube: {
        type: Sequelize.STRING
      },
      categoryYestechOwnerId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'categoryYestechOwners',
          key : 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('YestechOwners');
  }
};