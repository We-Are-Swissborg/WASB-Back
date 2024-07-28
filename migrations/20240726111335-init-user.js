'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      roles: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      walletAddress: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      certified: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aboutUs: {
        type: Sequelize.STRING,
        allowNull: true
      },
      confidentiality: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      beContacted: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      nonce: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expiresIn: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      referralCode: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      referringUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
