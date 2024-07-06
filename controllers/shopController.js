'use strict';

let controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

controller.show = async (req, res) => {  
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
    
    let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
    let tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let keyword = req.query.keyword || '';
    res.locals.keyword = keyword;

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
    if (keyword.trim() !== '') {
        options.where.name = {
            [Op.iLike]: `%${keyword}%`
        }
    }

    // Get Product data
    let products = await Product.findAll(options);
    res.locals.games = products;

    res.render('shop');
}
module.exports = controller;
