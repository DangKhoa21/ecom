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

router.get('/logout', controller.logout);
router.get('/forgot', controller.showForgotPassword);
router.post('/forgot', controller.forgotPassword);

router.get('/reset', controller.showResetPassword);
router.post('/reset', controller.resetPassword);

module.exports = router;