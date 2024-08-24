'use strict';
let express = require('express');
let router = express.Router();
let controller = require('../controllers/shopController');
let cartController = require('../controllers/cartController');

// Home and product listing
router.get('/', controller.getData, controller.show);

// Cart management
router.get('/cart', cartController.show);
router.post('/cart', cartController.add);
router.put('/cart', cartController.update);
router.delete('/cart', cartController.remove);
router.delete('/cart/all', cartController.clear);

// Product details with recommendations
router.get('/:id', controller.getData, controller.showDetails);

module.exports = router;
