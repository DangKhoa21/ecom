'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const models = require('../models');

//ham nay duoc goi khi xac thuc thanh cong va luu thong tin user vao session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//ham duoc goi boi passport.session de lay thong tin cua user tu csdl va dua vao req.user
passport.deserializeUser(async (id, done) => {
    try {
        let user = await models.User.findOne({
            attribute: ['id', 'email', 'firstName', 'lastName', 'mobile', 'isAdmin'],
            where: { id },
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

}, async (req, email, password, done) => {
    if (email) {
        email = email.toLowerCase();
    }
    try {
        if (!req.user) { //neu user chua dang nhap
            let user = await models.User.findOne({ where: { email } });
            if (!user) { //email does not exist
                return done(null, false, req.flash('loginMessage', 'Email does not exist.'));
            }
            if (!bcrypt.compareSync(password, user.password)) { // if password incorrect
                return done(null, false, req.flash('loginMessage', 'Password is incorrect.'));
            }
            // allow login
            return done(null, user);
        }
        done(null, req.user);
    } catch (error) {
        done(error);
    }
}))

module.exports = passport;
