'use strict';

const controller = {};
const models = require('../models');

controller.showHomepage = async (req, res) => {
    // Get data model
    const Product = models.Product
    const Category = models.Category;

    // Get all products
    const allProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        limit: 8,
    });
    res.locals.allProducts = allProducts;

    // Get feature products
    const featuredProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        order: [['stars', 'DESC']],
        limit: 6,
    });
    res.locals.featuredProducts = featuredProducts;

    // Get recent products
    const recentProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        order: [['createdAt', 'DESC']],
        limit: 8,
    });
    res.locals.recentProducts = recentProducts;

    // Get Category data
    const categories = await Category.findAll({
        include: [{
            model: Product,
            attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
            limit: 8,
        }],
        limit: 4,
    });
    res.locals.categories = categories;

    // Get Brand data
    const Brand = models.Brand;
    const brands = await Brand.findAll();
    res.locals.brands = brands;

    res.render('index');
}

controller.showPage = (req, res, next) => {
    const pages = ['cart', 'checkout', 'contact', 'login-sign-up', 'shop-detail', 'shop', 'testimonial', 'reset-password', 'wishlist', 'account'];
    if (pages.includes(req.params.page))
        return res.render(req.params.page);
    next();
}

module.exports = controller;