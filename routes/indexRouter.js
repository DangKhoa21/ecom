'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');


// router.get('/createTables', (req, res) => {
//     let models = require('../models');
//     models.sequelize.sync().then(() => {
//         res.send('create Tables succeed!');
//     });
// });

router.get('/', controller.showHomepage);

router.get('/admin', authController.isLoggedIn, adminController.show);
router.patch('/admin/orders', authController.isLoggedIn, adminController.updateOrderStatus);

router.get('/:page', controller.showPage);

router.post('/contact', controller.submitContactForm);
router.post('/subscribe', controller.submitSubscribeForm);


module.exports = router;
