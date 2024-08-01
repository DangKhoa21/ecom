'use strict';

let controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

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

    // Get featured products
    const featuredProducts = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        order: [['stars', 'DESC']],
        limit: 3,
    });
    res.locals.featuredProducts = featuredProducts;

    next();
}

controller.show = async (req, res) => {
    const Product = models.Product;

    let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
    let brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
    let tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
    let keyword = req.query.keyword || '';
    let sort = ['price', 'newest', 'popularity'].includes(req.query.sort) ? req.query.sort : 'nothing';
    let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));

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
            model: models.Tag,
            where: { id: tag }
        }]
    }

    if (keyword.trim() !== '') {
        options.where.name = {
            [Op.iLike]: `%${keyword}%`
        }
    }
    res.locals.keyword = keyword;

    switch (sort) {
        case 'newest':
            options.order = [['updatedAt', 'DESC']];
            break;
        case 'popularity':
            options.order = [['stars', 'DESC']];
            break;
        default:
            options.order = [['price', 'ASC']];
    }
    res.locals.sort = sort;
    res.locals.originalUrl = removeParam('sort', req.originalUrl);
    if (Object.keys(req.query).length == 0) {
        res.locals.originalUrl = res.locals.originalUrl + '?';
    }

    const limit = 9;
    options.limit = limit;
    options.offset = limit * (page - 1);
    let { rows, count } = await Product.findAndCountAll(options);

    // Get Product data
    res.locals.pagination = {
        page: page,
        limit: limit,
        totalRows: count,
        queryParams: req.query
    }
    //let products = await Product.findAll(options);
    res.locals.games = rows;

    res.render('shop');
}

controller.showDetails = async (req, res) => {
    const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    if (id == 0) {
        return res.render('error', { message: "Product Not Found!", error_code: 404 });
    }

    const product = await models.Product.findOne({
        attributes: ['id', 'name', 'stars', 'oldPrice', 'price', 'summary', 'description', 'specification'],
        where: { id },
        include: [{
            model: models.Image,
            attributes: ['name', 'imagePath']
        }, {
            model: models.Review,            
            attributes: ['id', 'review', 'stars', 
                [sequelize.literal(`to_char("Reviews"."updatedAt", 'Mon DD, YYYY HH24:MI')`), 'formattedUpdatedAt']],
            include: [{
                model: models.User,
                attributes: ['firstName', 'lastName']
            }]
        }, {
            model: models.Tag,
            attributes: ['id', 'name']
        }],
        order: [[models.Review, 'updatedAt', 'DESC']]
    });

    if (!product) {
        return res.render('error', { message: "Product Not Found!", error_code: 404 });
    }

    if (product.Reviews) {
        product.Reviews.forEach(review => {
          review.formattedUpdatedAt = review.dataValues.formattedUpdatedAt;
        });
    }

    res.locals.product = product;

    let tagIds = [];
    product.Tags.forEach(tag => tagIds.push(tag.id));
    let relatedProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        include: [{
            model: models.Tag,
            attributes: ['id'],
            where: {
                id: { [Op.in]: tagIds }
            }
        }],
        limit: 8
    });
    res.locals.relatedProducts = relatedProducts;
    res.render('shop-detail');
}

controller.addReview = async (req, res) => {
    let userId = req.user.id;
    let productId = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    let review = req.body.review;
    let stars = req.body.stars || 0;
    let product = await models.Product.findByPk(productId);
    if (product && review.length > 0) {
        let reviews = await models.Review.findOne({ where: { userId, productId } });
        if (reviews) 
            await reviews.update({ review, stars });    
        else
            await models.Review.create({ userId, productId, review, stars });

        res.redirect(`/shop/${productId}`);
    }
    else
        res.redirect(`/shop/${productId}`);
}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

module.exports = controller;
