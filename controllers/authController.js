'use strict';

const controller = {};
const passport = require('./passport');
const models = require('../models');
const { request } = require('express');
controller.show = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('login-sign-up', { loginMessage: req.flash('loginMessage'), reqUrl: req.query.reqUrl });
}

controller.login = (req, res, next) => {
    let keepSignedIn = req.body.keepSignedIn;
    let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/users/account';
    let cart = req.session.cart;
    passport.authenticate('local-login', (error, user) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            return res.redirect(`/users/login-sign-up?reqUrl=${reqUrl}`);
        }
        req.logIn(user, (error) => {
            if (error) { return next(error); }
            req.session.cookie.maxAge = keepSignedIn ? (24 * 60 * 60 * 1000) : null;
            req.session.cart = cart;
            return res.redirect(reqUrl);
        });
    })(req, res, next);
}

controller.logout = (req, res) => {
    let cart = req.session.cart;
    req.logout(error => {
        if (error) return next(error);
        req.session.cart = cart;
        res.redirect('/');
    });
}

controller.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`/users/login-sign-up?reqUrl=${req.originalUrl}`);
}

controller.showForgotPassword = (req, res) => {
    res.render('reset-password');
}
controller.forgotPassword = async (req, res) => {
    let email = req.body.email;
    let user = await models.User.findOne({ where: { email } });
    if (user) {
        const { sign } = require('./jwt');
        const host = req.header('host');
        const resetLink = `${req.protocol}://${host}/reset?token=${sign(email)}&email=${email}`;
        const { sendForgotPasswordMail } = require('./mail');
        sendForgotPasswordMail(user, host, resetLink)
            .then((result) => {
                console.log('Email has been sent');
                return res.render('reset-password', { done: true });
            })
            .catch(error => {
                console.log(error.statusCode);
                return res.render('reset-password', { message: 'An error has occured when trying to send to your email. Please check your email address.' });
            });
    } else {
        return res.render('reset-password', { message: 'Email does not exist.' });
    }
}

module.exports = controller;