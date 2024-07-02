'use strict';

let controller = {};
const models = require('../models');

controller.show = async (req, res) => {
    let products = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary']
    });
    res.locals.games = products;

    let categories = await models.Category.findAll();
    let secondArray = categories.splice(2, 2);
    let thirdArray = categories.splice(1, 1);
    res.locals.categoryArray = [
        categories,
        secondArray,
        thirdArray,
    ];
    res.render('shop');
}
module.exports = controller;
