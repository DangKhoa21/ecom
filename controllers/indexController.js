'use strict';

const controller = {};

controller.showHomepage = (req,res) => {
    res.render('index');
}

controller.showPage = (req, res, next) => {
    const pages = ['cart', 'checkout', 'contact', 'login-signup', 'shop-detail', 'shop', 'testimonial', 'reset-password'];
    if (pages.includes(req.params.page))
        return res.render(req.params.page);
    next();
}

module.exports = controller;