'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SocialMedias', 'facebook',  {
        type: Sequelize.STRING,
        allowNull: true,
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SocialMedias', 'facebook')
  }
};
