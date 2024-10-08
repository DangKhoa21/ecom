'use strict'

const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');
const libraryController = require('../controllers/libraryController');
const downloadController = require('../controllers/downloadController');

router.use(authController.isLoggedIn);

router.get('/checkout', userController.checkout);
router.post('/placeOrders', userController.placeOrders);

router.post('/:id/review', userController.addReview);

router.get('/wishlist', wishlistController.show);
router.post('/wishlist', wishlistController.add);
router.delete('/wishlist', wishlistController.remove);

router.get('/library', libraryController.show);

router.get('/download/:gameID', downloadController.download);

router.get('/account', userController.show);

router.put('/personal', userController.updatePersonal);
router.put('/password', userController.updatePassword);

router.get('/login-sign-up', (req, res) => {
    res.render('login-sign-up');
});

module.exports = router