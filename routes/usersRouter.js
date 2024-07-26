'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const wishlistController = require('../controllers/wishlistController');

router.get('/checkout', controller.checkout);
router.post('/placeorders', controller.placeorders);

router.get('/wishlist', wishlistController.show);
router.post('/wishlist', wishlistController.add);
router.delete('/wishlist', wishlistController.remove);

module.exports = router