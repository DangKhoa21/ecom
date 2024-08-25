'use strict';

const controller = {};
const models = require('../models');
// const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Firebase app
const { ref, getDownloadURL } = require("firebase/storage");

controller.download = async (req, res) => {
    const userID = req.user.id;
    const gameID = parseInt(req.params.gameID);

    // const pathToFile = path.resolve(`./games/${req.params.gameID}.txt`);
    // console.log(pathToFile);

    const { getStorage } = require('../config/firebase.config');
    const storage = getStorage();

    const valid = await checkAcquireGame(userID, gameID);

    // if (valid) {
    //     if (fs.existsSync(pathToFile)) {
    //         console.log('File exists.');

    //         res.download(path.resolve(`./games/${req.params.gameID}.txt`));
    //     } else {
    //         console.log('File does not exist.');

    //         res.render('error', { message: 'This game is not in our server yet, please wait.' });
    //     }
    // } else {
    //     console.log('User does not own the games.');

    //     res.render('error', { message: 'This game is not in your library yet.' });
    // }

    // res.download(path.resolve('./games/dummy.txt'));
    if (valid) {
        try {
            getURL(req, res, storage);
        }
        catch (err) {
            console.log(err);
        }
    } else {
        console.log('User does not own the games.');

        res.render('error', { message: 'This game is not in your library yet.' });
    }
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

async function getURL(req, res, storage) {
    const path = `games/${req.params.gameID}.txt`;
    const gameRef = ref(storage, path);

    getDownloadURL(gameRef).then(async (url) => {
        console.log(url);

        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const fileData = Buffer.from(response.data);

            res.attachment(`${req.params.gameID}.txt`); // Set the file name
            res.send(fileData);
        } catch (error) {
            console.error('Error downloading file:', error);
            res.status(500).send('Error downloading file');
        }

    }).catch((error) => {
        // Handle errors
        console.log(error);
    })
}

module.exports = controller;