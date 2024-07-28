'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { body, getErrorMessage } = require('../controllers/validator');

router.get('/login-sign-up', controller.show);
router.post('/login-sign-up',
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email address.'),
    body('password').trim().notEmpty().withMessage('Password is required.'),
    (req, res, next) => {
        let message = getErrorMessage(req);
        if (message) {
            return res.render('login-sign-up', { loginMessage: message });
        }
        next();
    },
    controller.login);

module.exports = router;