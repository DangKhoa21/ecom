'use strict';

let controller = {};
const { where } = require('sequelize');
let models = require('../models');

controller.add = async (req, res) => {
    let userId = 1;
    let productId = isNaN(req.body.id) ? 0 : parseInt(req.body.id);
    let product = await models.Product.findByPk(productId);
    if (product) {
        let wishlists = await models.Wishlist.findOne({ where: { userId, productId } });
        if (!wishlists) {
            await models.Wishlist.create({ userId, productId });
        }
    }
}

controller.show = async (req, res) => {
    let userId = 1;
    let wishlists = await models.Wishlist.findAll({ 
        where: { userId },
        include: [{ 
            model: models.Product,
            attributes: ['id', 'name', 'imagePath', 'price', 'oldPrice']
        }]
    });
    res.locals.products = wishlists.map(wishlist => wishlist.Product);
    return res.render('wishlist');
}

module.exports = controller;