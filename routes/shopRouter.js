'use strict';
let express = require('express');
let router = express.Router();
let controller = require('../controllers/shopController')


router.get('/', controller.getData, controller.show);
router.get('/:id', controller.getData, controller.showDetails);


module.exports = router;
