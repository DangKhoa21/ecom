'use strict';

let controller = {};
let models = require('../models');

controller.show = async (req, res) => {
    let userId = req.user.id;

    const user = await models.User.findOne({ 
        where: { id: userId },
        attributes: ['firstName', 'lastName']
    });
    res.locals.user = user;

    let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
    const limit = 9;

    let orders = await models.Order.findAll({
        where: { userId },
        include: [{ 
            model: models.Product,
            attributes: ['id', 'name', 'imagePath', 'summary', 'description']
        }]
    });

    let productList = [];
    orders.forEach(order => {
        productList = productList.concat(order.Products);
    });

    const totalProducts = productList.length;
    const startIndex = limit * (page - 1);
    const products = productList.slice(startIndex, startIndex + limit);

    res.locals.pagination = {
        page: page,
        limit: limit,
        totalRows: totalProducts,
        queryParams: req.query
    };
    res.locals.products = products;

    return res.render('library');
}

module.exports = controller;