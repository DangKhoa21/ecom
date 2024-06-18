'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let items = [
      { productId: 1, tagId: 6 },
      { productId: 2, tagId: 3 },
      { productId: 3, tagId: 4 },
      { productId: 4, tagId: 8 },
      { productId: 5, tagId: 5 },
      { productId: 6, tagId: 1 },
      { productId: 7, tagId: 1 },
      { productId: 8, tagId: 1 },
      { productId: 9, tagId: 7 },
      { productId: 10, tagId: 5 },
      { productId: 11, tagId: 4 },
      { productId: 12, tagId: 4 },
      { productId: 13, tagId: 2 },
      { productId: 13, tagId: 8 },
      { productId: 14, tagId: 5 },
      { productId: 14, tagId: 8 },
      { productId: 15, tagId: 3 },
      { productId: 16, tagId: 1 },
      { productId: 17, tagId: 3 },
      { productId: 18, tagId: 6 },
      { productId: 19, tagId: 6 },
      { productId: 20, tagId: 7 },
      { productId: 21, tagId: 4 },
      { productId: 21, tagId: 8 },
      { productId: 22, tagId: 4 },
      { productId: 22, tagId: 8 }
    ];    
    items = items.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.productId === value.productId && t.tagId === value.tagId
      ))
    );
    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('ProductTags', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductTags', null, {});
  }
};
