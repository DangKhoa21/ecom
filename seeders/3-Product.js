'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      {
          "name": "The Legend of Zelda: Breath of the Wild",
          "imagePath": "/img/fruite-item-1.jpg",
          "oldPrice": 59.99,
          "price": 49.99,
          "summary": "Explore the vast world of Hyrule in this epic adventure.",
          "description": "Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.",
          "specification": "Platform: Nintendo Switch. Genre: Action-Adventure. Release Date: March 3, 2017.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 1
      },
      {
          "name": "FIFA 23",
          "imagePath": "/img/fruite-item-2.jpg",
          "oldPrice": 69.99,
          "price": 59.99,
          "summary": "The latest installment in the FIFA series with updated teams and features.",
          "description": "Experience the most authentic football game with FIFA 23, featuring updated rosters and realistic gameplay.",
          "specification": "Platform: Multiple. Genre: Sports. Release Date: September 27, 2022.",
          "stars": 0,
          "categoryId": 4,
          "brandId": 3
      },
      {
          "name": "Overwatch 2",
          "imagePath": "/img/fruite-item-3.jpg",
          "oldPrice": 49.99,
          "price": 39.99,
          "summary": "Team-based shooter with new heroes and maps.",
          "description": "Join the fight for the future in Overwatch 2, featuring new heroes, maps, and game modes.",
          "specification": "Platform: Multiple. Genre: Action. Release Date: October 4, 2022.",
          "stars": 0,
          "categoryId": 1,
          "brandId": 4
      },
      {
          "name": "Assassin's Creed Valhalla",
          "imagePath": "/img/fruite-item-4.jpg",
          "oldPrice": 79.99,
          "price": 69.99,
          "summary": "Become a legendary Viking warrior in this open-world adventure.",
          "description": "Lead your clan from icy desolation in Norway to a new home amid the lush farmlands of ninth-century England.",
          "specification": "Platform: Multiple. Genre: Action-Adventure. Release Date: November 10, 2020.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 5
      },
      {
          "name": "The Sims 4",
          "imagePath": "/img/fruite-item-5.jpg",
          "oldPrice": 49.99,
          "price": 39.99,
          "summary": "Create and control people in a virtual world.",
          "description": "Play with life in The Sims 4, a simulation game where you can create and control people.",
          "specification": "Platform: Multiple. Genre: Simulation. Release Date: September 2, 2014.",
          "stars": 0,
          "categoryId": 3,
          "brandId": 3
      },
      {
          "name": "Cyberpunk 2077",
          "imagePath": "/img/fruite-item-6.jpg",
          "oldPrice": 59.99,
          "price": 49.99,
          "summary": "Open-world action-adventure story set in Night City.",
          "description": "Cyberpunk 2077 is an open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour, and body modification.",
          "specification": "Platform: Multiple. Genre: RPG. Release Date: December 10, 2020.",
          "stars": 0,
          "categoryId": 3,
          "brandId": 2
      },
      {
          "name": "League of Legends",
          "imagePath": "/img/fruite-item-1.jpg",
          "oldPrice": 0.00,
          "price": 0.00,
          "summary": "A fast-paced, competitive online game.",
          "description": "League of Legends is a team-based game with over 140 champions to make epic plays with.",
          "specification": "Platform: PC. Genre: Online. Release Date: October 27, 2009.",
          "stars": 0,
          "categoryId": 1,
          "brandId": 5
      },
      {
          "name": "Fortnite",
          "imagePath": "/img/fruite-item-2.jpg",
          "oldPrice": 0.00,
          "price": 0.00,
          "summary": "A battle royale game where you build and fight to be the last one standing.",
          "description": "Join the battle in Fortnite, a free-to-play battle royale game with various game modes for every type of player.",
          "specification": "Platform: Multiple. Genre: Free-to-Play. Release Date: July 21, 2017.",
          "stars": 0,
          "categoryId": 3,
          "brandId": 4
      },
      {
          "name": "Call of Duty: Warzone",
          "imagePath": "/img/fruite-item-3.jpg",
          "oldPrice": 0.00,
          "price": 0.00,
          "summary": "A battle royale experience from the world of Call of Duty.",
          "description": "Join the fight in Call of Duty: Warzone, a free-to-play battle royale experience from the world of Call of Duty.",
          "specification": "Platform: Multiple. Genre: Free-to-Play. Release Date: March 10, 2020.",
          "stars": 0,
          "categoryId": 1,
          "brandId": 4
      },
      {
          "name": "Gran Turismo 7",
          "imagePath": "/img/fruite-item-4.jpg",
          "oldPrice": 69.99,
          "price": 59.99,
          "summary": "A realistic driving simulator.",
          "description": "Gran Turismo 7 brings together the very best features of the Real Driving Simulator.",
          "specification": "Platform: PS5. Genre: Simulation. Release Date: March 4, 2022.",
          "stars": 0,
          "categoryId": 4,
          "brandId": 2
      },
      {
          "name": "Apex Legends",
          "imagePath": "/img/fruite-item-5.jpg",
          "oldPrice": 0.00,
          "price": 0.00,
          "summary": "A free-to-play battle royale game.",
          "description": "Show ’em what you’re made of in Apex Legends, a free-to-play Battle Royale game where contenders from across the Frontier team up to battle for glory, fame, and fortune.",
          "specification": "Platform: Multiple. Genre: Free-to-Play. Release Date: February 4, 2019.",
          "stars": 0,
          "categoryId": 3,
          "brandId": 4
      },
      {
          "name": "Valorant",
          "imagePath": "/img/fruite-item-6.jpg",
          "oldPrice": 0.00,
          "price": 0.00,
          "summary": "A 5v5 character-based tactical shooter.",
          "description": "Valorant is a free-to-play 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.",
          "specification": "Platform: PC. Genre: Online. Release Date: June 2, 2020.",
          "stars": 0,
          "categoryId": 1,
          "brandId": 5
      },
      {
          "name": "Spider-Man: Miles Morales",
          "imagePath": "/img/fruite-item-1.jpg",
          "oldPrice": 49.99,
          "price": 39.99,
          "summary": "A new adventure in the Spider-Man universe.",
          "description": "Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man.",
          "specification": "Platform: PS5. Genre: Action. Release Date: November 12, 2020.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 2
      },
      {
          "name": "Ghost of Tsushima",
          "imagePath": "/img/fruite-item-2.jpg",
          "oldPrice": 69.99,
          "price": 59.99,
          "summary": "An open-world action-adventure set in feudal Japan.",
          "description": "Explore the beautiful world of Tsushima in this action-adventure game, where you play as a samurai warrior.",
          "specification": "Platform: PS4. Genre: Action-Adventure. Release Date: July 17, 2020.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 2
      },
      {
          "name": "Battlefield 2042",
          "imagePath": "/img/fruite-item-3.jpg",
          "oldPrice": 69.99,
          "price": 59.99,
          "summary": "An epic-scale warfare game.",
          "description": "Battlefield 2042 brings massive-scale warfare in a near-future world transformed by disorder.",
          "specification": "Platform: Multiple. Genre: Shooter. Release Date: November 19, 2021.",
          "stars": 0,
          "categoryId": 4,
          "brandId": 3
      },
      {
          "name": "Destiny 2",
          "imagePath": "/img/fruite-item-4.jpg",
          "oldPrice": 0.00,
          "price": 0.00,
          "summary": "A multiplayer first-person shooter.",
          "description": "Dive into the world of Destiny 2, where you can explore, fight, and discover secrets in a constantly evolving universe.",
          "specification": "Platform: Multiple. Genre: Online. Release Date: September 6, 2017.",
          "stars": 0,
          "categoryId": 1,
          "brandId": 2
      },
      {
          "name": "Animal Crossing: New Horizons",
          "imagePath": "/img/fruite-item-5.jpg",
          "oldPrice": 59.99,
          "price": 49.99,
          "summary": "Create your own paradise in this social simulation game.",
          "description": "Escape to a deserted island and create your own paradise in Animal Crossing: New Horizons.",
          "specification": "Platform: Nintendo Switch. Genre: Simulation. Release Date: March 20, 2020.",
          "stars": 0,
          "categoryId": 3,
          "brandId": 1
      },
      {
          "name": "Hades",
          "imagePath": "/img/fruite-item-1.jpg",
          "oldPrice": 24.99,
          "price": 19.99,
          "summary": "Battle out of Hell in this rogue-like dungeon crawler.",
          "description": "Hades is a god-like rogue-like dungeon crawler that combines the best aspects of Supergiant's critically acclaimed titles.",
          "specification": "Platform: Multiple. Genre: Action. Release Date: September 17, 2020.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 2
      },
      {
          "name": "Monster Hunter: World",
          "imagePath": "/img/fruite-item-2.jpg",
          "oldPrice": 39.99,
          "price": 29.99,
          "summary": "Hunt down ferocious monsters in a living, breathing ecosystem.",
          "description": "Take on the role of a hunter and slay ferocious monsters in a living, breathing ecosystem where you can use the environment and its diverse inhabitants to get the upper hand.",
          "specification": "Platform: Multiple. Genre: Action RPG. Release Date: January 26, 2018.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 2
      },
      {
          "name": "Red Dead Redemption 2",
          "imagePath": "/img/fruite-item-3.jpg",
          "oldPrice": 59.99,
          "price": 49.99,
          "summary": "An epic tale of life in America at the dawn of the modern age.",
          "description": "Red Dead Redemption 2 is an epic tale of life in America’s unforgiving heartland. The game’s vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience.",
          "specification": "Platform: Multiple. Genre: Action-Adventure. Release Date: October 26, 2018.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 4
      },
      {
          "name": "Resident Evil Village",
          "imagePath": "/img/fruite-item-4.jpg",
          "oldPrice": 59.99,
          "price": 49.99,
          "summary": "Experience survival horror like never before in the eighth major installment in the Resident Evil series.",
          "description": "Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully in a new location, free from their past nightmares.",
          "specification": "Platform: Multiple. Genre: Survival Horror. Release Date: May 7, 2021.",
          "stars": 0,
          "categoryId": 2,
          "brandId": 2
      },
      {
          "name": "Halo Infinite",
          "imagePath": "/img/fruite-item-5.jpg",
          "oldPrice": 59.99,
          "price": 49.99,
          "summary": "The legendary Halo series returns with the most expansive Master Chief campaign yet.",
          "description": "When all hope is lost and humanity’s fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he’s ever faced.",
          "specification": "Platform: Multiple. Genre: Shooter. Release Date: December 8, 2021.",
          "stars": 0,
          "categoryId": 4,
          "brandId": 1
      }
    ];      
    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('Products', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
