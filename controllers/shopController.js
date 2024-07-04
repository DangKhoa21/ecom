'use strict';

let controller = {};
const models = require('../models');

controller.show = async (req, res) => {  
    const Product = models.Product;
    const Category = models.Category;

    // Get Category data
    const categories = await Category.findAll({
        include: [{
            model: Product
        }]
    });
    res.locals.categories = categories;
    
    let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);

    let options = {
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        where: {}
    };
    if (category > 0) {
        options.where.categoryId = category
    }

    // Get Product data
    let products = await Product.findAll(options);
    res.locals.games = products;

    res.render('shop');
}
module.exports = controller;
