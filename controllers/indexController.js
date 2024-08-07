'use strict';

const controller = {};
const models = require('../models');

controller.showHomepage = async (req, res) => {
    // Get data model
    const Product = models.Product
    const Category = models.Category;
    const userId = req.user ? req.user.id : null;

    // Get all products
    let allProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        limit: 8,
    });
    allProducts = await checkForPurchasedProducts(allProducts, userId);
    res.locals.allProducts = allProducts;

    // Get feature products
    let featuredProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        order: [['stars', 'DESC']],
        limit: 6,
    });
    featuredProducts = await checkForPurchasedProducts(featuredProducts, userId);
    res.locals.featuredProducts = featuredProducts;

    // Get recent products
    let recentProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        order: [['updatedAt', 'DESC']],
        limit: 8,
    });
    recentProducts = await checkForPurchasedProducts(recentProducts, userId);
    res.locals.recentProducts = recentProducts;

    // Get Category data
    let categories = await Category.findAll({
        include: [{
            model: Product,
            attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
            limit: 8,
        }],
        limit: 4,
    });
    for (let category of categories) {
        category.Products = await checkForPurchasedProducts(category.Products, userId);
    }
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

async function checkForPurchasedProducts(products, userId) {
    let productIdList = [];
    if (userId) {
        let orders = await models.Order.findAll({
            where: { userId },
            include: [{ 
                model: models.Product,
                attributes: ['id']
            }]
        });

        orders.forEach(order => {
            productIdList = productIdList.concat(order.Products.map(product => product.id));
        });

        products = products.map(product => {
            return {
                ...product.dataValues,
                isPurchased: productIdList.includes(product.id)
            }
        });
    }
    return products;
}

module.exports = controller;