'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
router.get('/login-sign-up', controller.show);
router.post('/login-sign-up', controller.login);

module.exports = router;