'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Contributions', [{
      title: '30 CHF/3 mois',
      amount: 30,
      duration: 3,
      isActive: true,
      createdAt: new Date()
    }, 
    {
      title: '60 CHF/6 mois',
      amount: 60,
      duration: 6,
      isActive: true,
      createdAt: new Date()
    },
    {
      title: '100 CHF/12 mois',
      amount: 100,
      duration: 12,
      isActive: true,
      createdAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Contributions', null, {});
  }
};
