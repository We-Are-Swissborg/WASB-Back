'use strict';

const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const Jane_password = await bcrypt.hash('jane', 12);
    const John_password = await bcrypt.hash('john', 12);

    await queryInterface.bulkInsert('Users', [{
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'Jane_D09',
      email: 'jane@doe.dev',
      walletAddress: '5F1JU',
      certified: true,
      country: 'Suisse',
      city: 'Lausanne',
      aboutUs: 'Twitter',
      createdAt: new Date(),
      updatedAt: new Date(),
      confidentiality: true,
      beContacted: true,
      password: Jane_password,
  }, {
      firstName: 'John',
      lastName: 'Doe',
      username: 'Jdoe',
      password: John_password,
      email: 'john.doe@example.com',
      walletAddress: 'wallet123',
      certified: true,
      country: 'USA',
      city: 'New York',
      aboutUs: 'Friend',
      createdAt: new Date(),
      updatedAt: new Date(),
      confidentiality: true,
      beContacted: false
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
