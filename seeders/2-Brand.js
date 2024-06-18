'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      { name: 'Nintendo', imagePath: '/img/brand-riot.png' },
      { name: 'Sony Interactive', imagePath: '/img/brand-riot.png' },
      { name: 'Electronic Arts', imagePath: '/img/brand-riot.png' },
      { name: 'Activision Blizzard', imagePath: '/img/brand-riot.png' },
      { name: 'Riot', imagePath: '/img/brand-riot.png' },
    ];
    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Brands', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
  }
};
