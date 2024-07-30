'use strict';

const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const my_password = await bcrypt.hash('admin$', 12);
    const roles = ['user', 'member', 'moderator', 'admin']; 

    await queryInterface.bulkInsert('Users', [{
        username: 'admin',
        email: 'valdior@outlook.com',
        certified: true,
        roles: JSON.stringify(roles),
        createdAt: new Date(),
        updatedAt: new Date(),
        confidentiality: true,
        beContacted: false,
        password: my_password,
        walletAddress: '5F1JUG',

      }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
