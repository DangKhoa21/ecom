'use strict';

let controller = {};
const models = require('../models');

controller.getData = async (req, res, next) => {
    const Product = models.Product;
    const Category = models.Category;
    const Brand = models.Brand;
    const Tag = models.Tag;

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

    // Get Tag data
    const tags = await Tag.findAll({
        include: [{
            model: Product
        }]
    });
    res.locals.tags = tags;

    next();
}

controller.show = async (req, res) => {
    const Product = models.Product;



    let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
    let tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);

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
    if (tag > 0) {
        options.include = [{
            model: Tag,
            where: { id: tag }
        }]
    }

    // Get Product data
    let products = await Product.findAll(options);
    res.locals.games = products;

    res.render('shop');
}

controller.showDetails = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

    const product = await models.Product.findOne({
        attributes: ['id', 'name', 'stars', 'oldPrice', 'price', 'summary', 'description', 'specification'],
        where: { id },
        include: [{
            model: models.Image,
            attributes: ['name', 'imagePath']
        }, {
            model: models.Review,
            attributes: ['id', 'review', 'stars', 'createdAt'],
            include: [{
                model: models.User,
                attributes: ['firstName', 'lastName']
            }]
        }]
    });
    res.locals.product = product;

    res.render('shop-detail');
}

module.exports = controller;
