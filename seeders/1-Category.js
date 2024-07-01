'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      { name: 'Released', imagePath: '/img/featur-2.jpg' },
      { name: 'Early-Access', imagePath: '/img/featur-2.jpg' },
      { name: 'Beta', imagePath: '/img/featur-2.jpg' },
      { name: 'DLC', imagePath: '/img/featur-2.jpg' }
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
