'use strict';

let controller = {};
const models = require('../models');

controller.show = async (req, res) => {  
    const Product = models.Product;
    const Category = models.Category;
    const Brand = models.Brand;

    // Get Category data
    const categories = await Category.findAll({
        include: [{
            model: Product
        }]
    });
    res.locals.categories = categories;

    // Get Brand data
    const brands = await Brand.findAll({
        include: [{
            model: Product
        }]
    });
    res.locals.brands = brands;
    
    let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);

    let options = {
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        where: {}
    };
    if (category > 0) {
        options.where.categoryId = category
    }
    if (brand > 0) {
        options.where.brandId = brand
    }

    // Get Product data
    let products = await Product.findAll(options);
    res.locals.games = products;

    res.render('shop');
}
module.exports = controller;
