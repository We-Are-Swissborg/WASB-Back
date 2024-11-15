'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PostCategories', {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      title: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false
      },
      updatedAt: {
          type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('PostCategoryPosts', {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
      postCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PostCategories',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      }
    });

    await queryInterface.changeColumn('Posts', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Posts', 'isPublish',  {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('Posts', 'publishedAt',  {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Posts', 'slug',  {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'image', {
      type: Sequelize.BLOB,
      allowNull: false,
    });
    await queryInterface.removeColumn('Posts', 'slug');
    await queryInterface.removeColumn('Posts', 'isPublish');
    await queryInterface.removeColumn('Posts', 'publishedAt');
    await queryInterface.dropTable('PostCategories');
    await queryInterface.dropTable('PostCategoryPosts');
  }
};
