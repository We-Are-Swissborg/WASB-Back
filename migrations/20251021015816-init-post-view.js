'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PostViews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
         references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      clientId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      viewedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });

    await queryInterface.addColumn('Posts', 'views', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'views');
    await queryInterface.dropTable('PostViews');
  }
};
