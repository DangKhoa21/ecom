'use strict';

const controller = {};
const models = require('../models');

controller.showHomepage = async (req, res) => {
    
    const Brand = models.Brand;
    const brands = await Brand.findAll();
    res.render('index', { brands });
}

controller.showPage = (req, res, next) => {
    const pages = ['cart', 'checkout', 'contact', 'login-signup', 'shop-detail', 'shop', 'testimonial', 'reset-password', 'wishlist', 'account'];
    if (pages.includes(req.params.page))
        return res.render(req.params.page);
    next();
}

module.exports = controller;