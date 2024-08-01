'use strict';

let controller = {};
const { where } = require('sequelize');
let models = require('../models');

controller.add = async (req, res) => {
    let userId = req.user.id;
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
    let userId = req.user.id;
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

controller.remove = async (req, res) => {
    let userId = req.user.id;
    let productId = isNaN(req.body.id) ? 0 : parseInt(req.body.id);
    let product = await models.Product.findByPk(productId);
    if (product) {
        let wishlists = await models.Wishlist.findOne({ where: { userId, productId } });
        if (wishlists) {
            await models.Wishlist.destroy({ where: { userId, productId } });
        }
    }
    let wishlistsQuantity = await models.Wishlist.count({ where: { userId } });
    console.log(wishlistsQuantity);
    res.json({ quantity: wishlistsQuantity });
}

module.exports = controller;