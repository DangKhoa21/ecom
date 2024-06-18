'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      { name: 'Online', imagePath: '/img/featur-2.jpg' },
      { name: 'Offline', imagePath: '/img/featur-2.jpg' },
      { name: 'Free-to-Play', imagePath: '/img/featur-2.jpg' },
      { name: 'Paid', imagePath: '/img/featur-2.jpg' }
    ];
    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Categories', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
