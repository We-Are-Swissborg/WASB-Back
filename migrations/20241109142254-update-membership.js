'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Memberships', 'userId', {
      type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: 'Users',
          key: 'id'
        },
    });

    await queryInterface.addColumn('Memberships', 'validateUserId',  {
      type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
    });
    
    await queryInterface.addColumn('Memberships', 'note',  {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.createTable('Contributions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      duration: {
        type: Sequelize.NUMBER,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
      }
    });

    await queryInterface.removeColumn('Memberships', 'contribution');
    await queryInterface.addColumn('Memberships', 'contributionId',  {
      type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contributions',
          key: 'id'
        },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Memberships', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    await queryInterface.removeColumn('Memberships', 'validateUserId');
    await queryInterface.removeColumn('Memberships', 'contributionId');
    await queryInterface.removeColumn('Memberships', 'note');
    await queryInterface.addColumn('Memberships', 'contribution',  {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.dropTable('Contributions');
  }
};
