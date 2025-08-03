'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE Sessions RENAME COLUMN createdBy TO createdById');
    await queryInterface.sequelize.query('ALTER TABLE Sessions RENAME COLUMN updatedBy TO updatedById');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE Sessions RENAME COLUMN createdById TO createdBy');
    await queryInterface.sequelize.query('ALTER TABLE Sessions RENAME COLUMN updatedById TO updatedBy');
  }
};
