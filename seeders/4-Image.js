'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      {
        "name": "Zelda pic 1",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 1
      },
      {
        "name": "Zelda pic 2",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 1
      },
      {
        "name": "Zelda pic 3",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 1
      },
      {
        "name": "FIFA 23 pic 1",
        "imagePath": "/img/fruite-item-4.png",
        "productId": 2
      },
      {
        "name": "FIFA 23 pic 2",
        "imagePath": "/img/fruite-item-5.png",
        "productId": 2
      },
      {
        "name": "Overwatch 2 pic 1",
        "imagePath": "/img/fruite-item-6.png",
        "productId": 3
      },
      {
        "name": "Overwatch 2 pic 2",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 3
      },
      {
        "name": "Assassin's Creed Valhalla pic 1",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 4
      },
      {
        "name": "Assassin's Creed Valhalla pic 2",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 4
      },
      {
        "name": "The Sims 4 pic 1",
        "imagePath": "/img/fruite-item-4.png",
        "productId": 5
      },
      {
        "name": "The Sims 4 pic 2",
        "imagePath": "/img/fruite-item-5.png",
        "productId": 5
      },
      {
        "name": "Cyberpunk 2077 pic 1",
        "imagePath": "/img/fruite-item-6.png",
        "productId": 6
      },
      {
        "name": "Cyberpunk 2077 pic 2",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 6
      },
      {
        "name": "League of Legends pic 1",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 7
      },
      {
        "name": "League of Legends pic 2",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 7
      },
      {
        "name": "Fortnite pic 1",
        "imagePath": "/img/fruite-item-4.png",
        "productId": 8
      },
      {
        "name": "Fortnite pic 2",
        "imagePath": "/img/fruite-item-5.png",
        "productId": 8
      },
      {
        "name": "Call of Duty: Warzone pic 1",
        "imagePath": "/img/fruite-item-6.png",
        "productId": 9
      },
      {
        "name": "Call of Duty: Warzone pic 2",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 9
      },
      {
        "name": "Gran Turismo 7 pic 1",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 10
      },
      {
        "name": "Gran Turismo 7 pic 2",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 10
      },
      {
        "name": "Apex Legends pic 1",
        "imagePath": "/img/fruite-item-4.png",
        "productId": 11
      },
      {
        "name": "Apex Legends pic 2",
        "imagePath": "/img/fruite-item-5.png",
        "productId": 11
      },
      {
        "name": "Valorant pic 1",
        "imagePath": "/img/fruite-item-6.png",
        "productId": 12
      },
      {
        "name": "Valorant pic 2",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 12
      },
      {
        "name": "Spider-Man: Miles Morales pic 1",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 13
      },
      {
        "name": "Spider-Man: Miles Morales pic 2",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 13
      },
      {
        "name": "Ghost of Tsushima pic 1",
        "imagePath": "/img/fruite-item-4.png",
        "productId": 14
      },
      {
        "name": "Ghost of Tsushima pic 2",
        "imagePath": "/img/fruite-item-5.png",
        "productId": 14
      },
      {
        "name": "Battlefield 2042 pic 1",
        "imagePath": "/img/fruite-item-6.png",
        "productId": 15
      },
      {
        "name": "Battlefield 2042 pic 2",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 15
      },
      {
        "name": "Destiny 2 pic 1",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 16
      },
      {
        "name": "Destiny 2 pic 2",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 16
      },
      {
        "name": "Animal Crossing: New Horizons pic 1",
        "imagePath": "/img/fruite-item-4.png",
        "productId": 17
      },
      {
        "name": "Animal Crossing: New Horizons pic 2",
        "imagePath": "/img/fruite-item-5.png",
        "productId": 17
      },
      {
        "name": "Hades pic 1",
        "imagePath": "/img/fruite-item-6.png",
        "productId": 18
      },
      {
        "name": "Hades pic 2",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 18
      },
      {
        "name": "Monster Hunter: World pic 1",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 19
      },
      {
        "name": "Monster Hunter: World pic 2",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 19
      },
      {
        "name": "Red Dead Redemption 2 pic 1",
        "imagePath": "/img/fruite-item-4.png",
        "productId": 20
      },
      {
        "name": "Red Dead Redemption 2 pic 2",
        "imagePath": "/img/fruite-item-5.png",
        "productId": 20
      },
      {
        "name": "Resident Evil Village pic 1",
        "imagePath": "/img/fruite-item-6.png",
        "productId": 21
      },
      {
        "name": "Resident Evil Village pic 2",
        "imagePath": "/img/fruite-item-1.png",
        "productId": 21
      },
      {
        "name": "Halo Infinite pic 1",
        "imagePath": "/img/fruite-item-2.png",
        "productId": 22
      },
      {
        "name": "Halo Infinite pic 2",
        "imagePath": "/img/fruite-item-3.png",
        "productId": 22
      }
    ];    

    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Images', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  }
};
