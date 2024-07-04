'use strict';

const controller = {};
const models = require('../models');

controller.showHomepage = async (req, res) => {
    // Get Product data
    const Product = models.Product

    const allProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        limit: 8,
    });
    res.locals.allProducts = allProducts;

    const featuredProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        order: [['stars', 'DESC']],
        limit: 6,
    });
    res.locals.featuredProducts = featuredProducts;

    const recentProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        order: [['createdAt', 'DESC']],
        limit: 8,
    });
    res.locals.recentProducts = recentProducts;

    // Get Category data
    const Category = models.Category;
    const categories = await Category.findAll();
    const secondArray = categories.splice(2, 2);
    const thirdArray = categories.splice(1, 1);
    res.locals.categoryArray = [
        categories,
        secondArray,
        thirdArray,
    ];

    // Get Brand data
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