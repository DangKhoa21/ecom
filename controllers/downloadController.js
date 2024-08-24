'use strict';

const controller = {};
const models = require('../models');
const path = require('path');
const fs = require('fs');

controller.download = async (req, res) => {
    const userID = req.user.id;
    const gameID = parseInt(req.params.gameID);
    const pathToFile = path.resolve(`./games/${req.params.gameID}.txt`);

    // console.log(pathToFile);

    const valid = await checkAcquireGame(userID, gameID);
    if (valid) {
        if (fs.existsSync(pathToFile)) {
            console.log('File exists.');

            res.download(path.resolve(`./games/${req.params.gameID}.txt`));
        } else {
            console.log('File does not exist.');

            res.render('error', { message: 'This game is not in our server yet, please wait.' });
        }
    } else {
        console.log('User does not own the games.');

        res.render('error', { message: 'This game is not in your library yet.' });
    }

    // res.download(path.resolve('./games/dummy.txt'));
}

async function checkAcquireGame(userId, productId) {
    let productIdList = [];
    let orders = await models.Order.findAll({
        where: { userId },
        include: [{
            model: models.Product,
            attributes: ['id'],
        }]
    });

    orders.forEach(order => {
        productIdList = productIdList.concat(order.Products.map(product => product.id));
    });

    const isPurchased = productIdList.includes(productId);
    return isPurchased;
}

module.exports = controller;