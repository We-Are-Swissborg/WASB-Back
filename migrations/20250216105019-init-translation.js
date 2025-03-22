'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'title');
    await queryInterface.removeColumn('Posts', 'content');
    await queryInterface.removeColumn('Posts', 'slug');
    await queryInterface.removeColumn('PostCategories', 'title');

    await queryInterface.createTable('Translations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      entityType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      languageCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex("Translations", ["entityType", "entityId", "languageCode"], {
      unique: true,
      name: "translations_entity_language_unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Translations", "translations_entity_language_unique");
    await queryInterface.addColumn('Posts', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Posts', 'content', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.addColumn('Posts', 'slug', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('PostCategories', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    
    await queryInterface.removeColumn('Posts', 'translationId');
    await queryInterface.removeColumn('PostCategories', 'translationId');

    await queryInterface.dropTable('Translations');
  },
};
