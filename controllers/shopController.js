'use strict';

let controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const collaborativeFilter = require('../lib/cf_api').cFilter; // Import collaborative filter function
const databases = require('./cfdatabase');

controller.getData = async (req, res, next) => {
    const Product = models.Product;
    const Category = models.Category;
    const Brand = models.Brand;
    const Tag = models.Tag;

    // Get Category data
    const categories = await Category.findAll({
        include: [{ model: Product }]
    });
    res.locals.categories = categories;

    // Get Brand data
    const brands = await Brand.findAll({
        include: [{ model: Product }]
    });
    res.locals.brands = brands;

    // Get Tag data
    const tags = await Tag.findAll({
        include: [{ model: Product }]
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

    const userId = req.user ? req.user.id : null;
    const purchasedProductIds = await getPurchasedProductIds(userId);
    rows = rows.map(product => {
        return {
            ...product.dataValues,
            isPurchased: purchasedProductIds.includes(product.id)
        }
    });
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

    // Expand related products with a recommendation system
    res.locals.relatedProducts = await generateRecommendations(product, req.user);

    if (req.user && (await getPurchasedProductIds(req.user.id)).includes(product.id)) {
        res.locals.isPurchased = true;
    }

    res.render('shop-detail');
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

async function generateRecommendations(product, user) {
    const Product = models.Product;
    const Tag = models.Tag;
    let recommendations = [];

    // Include related products by tags
    let tagIds = product.Tags.map(tag => tag.id);
    let relatedByTags = await Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
        include: [{
            model: Tag,
            where: { id: { [Op.in]: tagIds } },
            attributes: []
        }],
        limit: 4,
        where: {
            id: { [Op.ne]: product.id }  // Exclude the current product
        }
    });
    recommendations = recommendations.concat(relatedByTags);

    // Include other recommendations based on user behavior
    if (user) {
        const ratings = await getUserRatingsMatrix(user.id); // Assume this function fetches the user ratings matrix
        const userIndex = user.id; // Or whatever identifier you use
        const userRecommendations = collaborativeFilter(ratings, userIndex);

        const recommendedByUser = await Product.findAll({
            attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary'],
            where: {
                id: { [Op.in]: userRecommendations },
                id: { [Op.ne]: product.id }
            },
            limit: 4
        });
        recommendations = recommendations.concat(recommendedByUser);
    }

    // Avoid duplicate recommendations
    const uniqueRecommendations = recommendations.reduce((acc, curr) => {
        if (!acc.find(prod => prod.id === curr.id)) {
            acc.push(curr);
        }
        return acc;
    }, []);

    return uniqueRecommendations;
}

async function getPurchasedProductIds(userId) {
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
    }
    return productIdList;
}

// Placeholder for fetching user ratings matrix
async function getUserRatingsMatrix(userId) {
    // Simulating asynchronous fetching of ratings data from the database
    // Assuming `databases.simple` or `databases.notSimple` holds the ratings matrix data

    // Fetch the appropriate matrix based on userId or some logic
    const matrix = databases.simple; // or databases.notSimple based on your requirements

    // Transform the matrix into the format required by the collaborative filter
    // Example format: { userId: { itemId: rating, ... }, ... }
    const userRatings = matrix[userId] || {};

    return userRatings;
}

module.exports = controller;
