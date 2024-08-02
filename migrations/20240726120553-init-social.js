'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('SocialMedias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      twitter: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      discord: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      tiktok: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      telegram: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('SocialMedias');
  }
};
