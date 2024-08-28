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
        where: {
            id: { [Op.ne]: id }
        },
        limit: 8
    });

    const userId = req.user ? req.user.id : null;
    const purchasedProductIds = await getPurchasedProductIds(userId);
    relatedProducts = relatedProducts.map(product => {
        return {
            ...product.dataValues,
            isPurchased: purchasedProductIds.includes(product.id)
        }
    });
    res.locals.relatedProducts = relatedProducts;

    if (purchasedProductIds.includes(product.id)) {
        res.locals.isPurchased = true;
    }

    // Expand recommended products with a recommendation system
    res.locals.recommendedProducts = await generateRecommendations(userId);

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

async function generateRecommendations(userId) {
    if (!userId) {
        console.log("No user ID provided. Returning empty recommendations.");
        return [];
    }
    
    console.log("Generating recommendations for user ID:", userId);

    // Fetch all reviews
    const reviews = await models.Review.findAll({
        attributes: ['productId', 'userId', 'stars'],
        include: [{ model: models.Product, attributes: ['id', 'name'] }]
    });

    console.log("Fetched reviews:", reviews.length);

    // Build the item-item matrix
    const itemRatings = {};
    reviews.forEach(review => {
        if (!itemRatings[review.productId]) {
            itemRatings[review.productId] = [];
        }
        itemRatings[review.productId].push(review.stars);
    });

    console.log("Item ratings matrix:", itemRatings);

    const itemSimilarity = {};
    const productIds = Object.keys(itemRatings);

    console.log("Calculating similarities...");

    for (let i = 0; i < productIds.length; i++) {
        for (let j = i + 1; j < productIds.length; j++) {
            const idA = productIds[i];
            const idB = productIds[j];
            const ratingsA = itemRatings[idA];
            const ratingsB = itemRatings[idB];

            const similarity = cosineSimilarity(ratingsA, ratingsB);

            if (!itemSimilarity[idA]) itemSimilarity[idA] = {};
            if (!itemSimilarity[idB]) itemSimilarity[idB] = {};
            
            itemSimilarity[idA][idB] = similarity;
            itemSimilarity[idB][idA] = similarity; // similarity is symmetric

            console.log(`Similarity between item ${idA} and item ${idB}:`, similarity);
        }
    }

    // Fetch the target product's reviews
    const purchasedProductIds = await getPurchasedProductIds(userId);
    console.log("Purchased product IDs:", purchasedProductIds);

    // Generate recommendations
    const recommendedItems = {};
    purchasedProductIds.forEach(productId => {
        const similarItems = itemSimilarity[productId];
        if (similarItems) {
            console.log(`Similar items for purchased product ${productId}:`, similarItems);

            Object.keys(similarItems).forEach(similarProductId => {
                if (!purchasedProductIds.includes(parseInt(similarProductId))) {
                    if (!recommendedItems[similarProductId]) {
                        recommendedItems[similarProductId] = 0;
                    }
                    recommendedItems[similarProductId] += similarItems[similarProductId];
                }
            });
        }
    });

    console.log("Unsorted recommended items:", recommendedItems);

    // Sort recommended items by similarity score
    const sortedRecommendations = Object.entries(recommendedItems)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .slice(0, 6)
        .map(([productId]) => parseInt(productId));

    console.log("Sorted recommendations:", sortedRecommendations);

    // Fetch detailed information of recommended products
    const recommendedProducts = await models.Product.findAll({
        where: {
            id: {
                [Op.in]: sortedRecommendations
            }
        },
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'summary']
    });

    console.log("Recommended products details id:", recommendedProducts.map(product => product.id));

    return recommendedProducts;
}


function cosineSimilarity(vecA, vecB) {
    let dotProduct = vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
    let magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    let magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0; // Avoid division by zero
    return dotProduct / (magnitudeA * magnitudeB);
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

module.exports = controller;
