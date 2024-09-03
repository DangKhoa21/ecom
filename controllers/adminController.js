'use strict'

const controller = {};
const models = require('../models');
const sequelize = require('sequelize');

controller.show = async (req, res) => {
    let userId = req.user.id;

    //cheking user is admin or not
    const user = await models.User.findOne({
        attributes: ['id', 'isAdmin'], where: { id: userId } });

    if (!user) {
        return res.redirect('/');
    }
    if (!user.isAdmin) {
        return res.render('error', { message: 'You are not authorized to access this page.' });
    }

    let orders = await models.Order.findAll({
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'quantity', 'total', 'subtotal', 'discount', 'paymentMethod', 'status', 'updatedAt',
            [sequelize.literal(`to_char("Order"."updatedAt", 'Mon DD, YYYY HH24:MI')`), 'formattedUpdatedAt']],
        include: [{ 
            model: models.Product,
            attributes: ['id', 'name', 'imagePath', 'price', 'stars'],
            include: [{
                model: models.Tag,
                attributes: ['id', 'name']
            }, {
                model: models.Category,
                attributes: ['id', 'name']
            }, {
                model: models.Brand,
                attributes: ['id', 'name']
            }]
        }, {
            model: models.User,
            attributes: ['id', 'firstName', 'lastName']
        }]
    });

    if (orders) {
        orders.forEach(order => {
            order.formattedUpdatedAt = order.dataValues.formattedUpdatedAt;
        });
    }
    res.locals.orders = orders;

    const expensePerMonth = {};
    const orderPerMonth = {};
    orders.forEach(order => {
        const date = new Date(order.updatedAt);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'short' });

        if (!expensePerMonth[year]) {
            expensePerMonth[year] = {
                Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
                Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
            };
        }
        if (!orderPerMonth[year]) {
            orderPerMonth[year] = {
                Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
                Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
            };
        }

        if (expensePerMonth[year].hasOwnProperty(month)) {
            expensePerMonth[year][month] += parseFloat(order.total);
        }
        if (orderPerMonth[year].hasOwnProperty(month)) {
            orderPerMonth[year][month] += 1;
        }
    });
    res.locals.expensePerMonth = JSON.stringify(expensePerMonth);
    res.locals.orderPerMonth = JSON.stringify(orderPerMonth);

    const categoriesCount = {};
    const brandsCount = {};
    const tagsCount = {};

    orders.forEach(order => {
        order.Products.forEach(product => {
            categoriesCount[product.Category.name] = (categoriesCount[product.Category.name] || 0) + 1;
            brandsCount[product.Brand.name] = (brandsCount[product.Brand.name] || 0) + 1;
            product.Tags.forEach(tag => {
                tagsCount[tag.name] = (tagsCount[tag.name] || 0) + 1;
            });
        });
    });

    res.locals.categoriesCount = JSON.stringify(categoriesCount);
    res.locals.brandsCount = JSON.stringify(brandsCount);
    res.locals.tagsCount = JSON.stringify(tagsCount);

    const topProducts = {}

    orders.forEach(order => {
        order.Products.forEach(product => {
            if (!topProducts[product.name]) {
                topProducts[product.name] = {
                    id: product.id,
                    name: product.name,
                    imagePath: product.imagePath,
                    stars: product.stars,
                    count: 1
                }
            } else {
                topProducts[product.name].count += 1;
            }
        });
    });
    res.locals.topProducts = Object.values(topProducts).sort((a, b) => b.count - a.count).slice(0, 5);

    const topUsers = {};
    orders.forEach(order => {
        if (!topUsers[order.User.firstName + ' ' + order.User.lastName]) {
            topUsers[order.User.firstName + ' ' + order.User.lastName] = {
                name: order.User.firstName + ' ' + order.User.lastName,
                total: parseFloat(order.total),
                count: 1
            } 
        } else {
            topUsers[order.User.firstName + ' ' + order.User.lastName].total += parseFloat(order.total);
            topUsers[order.User.firstName + ' ' + order.User.lastName].count += 1;
        }
    });
    res.locals.topUsers = JSON.stringify(topUsers);

    const totalUsers = await models.User.count();
    res.locals.totalUsers = totalUsers;
    const totalProducts = await models.Product.count();
    res.locals.totalProducts = totalProducts;

    const users = await models.User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'mobile', 'isAdmin'],
    });
    res.locals.users = users;

    res.render('admin');
}

controller.updateOrderStatus = async (req, res) => {
    const orderId = req.body.orderId;
    const status = req.body.status;

    const order = await models.Order.findByPk(orderId);
    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully' });
}

module.exports = controller