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

    await queryInterface.createTable('PostCategoryPost', {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts', // nom de la table Posts
          key: 'id',
        },
        onDelete: 'CASCADE', // si un Post est supprimé, supprimer les liens associés
        onUpdate: 'CASCADE',
        primaryKey: true, // Définir la clé primaire composite avec postCategoryId
      },
      postCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PostCategories', // nom de la table PostCategories
          key: 'id',
        },
        onDelete: 'CASCADE', // si une catégorie est supprimée, supprimer les liens associés
        onUpdate: 'CASCADE',
        primaryKey: true, // Définir la clé primaire composite avec postId
      }
    });

    await queryInterface.changeColumn('Posts', 'image', {
      type: Sequelize.STRING,
      allowNull: false,
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

    await queryInterface.addColumn('Posts', 'categoryId',  {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'PostCategory',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'image', {
      type: Sequelize.BLOB,
      allowNull: false,
    });
    await queryInterface.removeColumn('Posts', 'categoryId');
    await queryInterface.removeColumn('Posts', 'slug');
    await queryInterface.removeColumn('Posts', 'isPublish');
    await queryInterface.removeColumn('Posts', 'publishedAt');
    await queryInterface.dropTable('PostCategories');
    await queryInterface.dropTable('PostCategoryPost');
  }
};
