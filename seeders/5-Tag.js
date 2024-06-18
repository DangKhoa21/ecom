'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      { name: 'Action' },
      { name: 'Adventure' },
      { name: 'Sports' },
      { name: 'Action-Adventure' },
      { name: 'Simulation' },
      { name: 'RPG' },
      { name: 'Shooter' },
      { name: 'Survival Horror' }
    ];    
    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Tags', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};
