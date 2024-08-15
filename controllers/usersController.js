'use strict'

const controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');

controller.checkout = (req, res) => {
    if (req.session.cart.quantity > 0) {
        res.locals.cart = req.session.cart.getCart();
        return res.render('checkout');
    }
    return res.redirect('/shop');
}

controller.placeOrders = (req, res) => {
    let cart = req.session.cart;
    cart.paymentMethod = req.body.payment;

    switch (req.body.payment) {
        case 'PAYPAL':
            saveOrders(req, res, 'PAID');
            break;
        case 'DBT':
            saveOrders(req, res, 'UNPAID');
            break;
        default:
            return res.redirect('/users/checkout');
    }
}

async function saveOrders(req, res, status) {
    let userId = req.user.id;
    let { items, ...others } = req.session.cart.getCart();
    if (items.length > 0) {
        let order = await models.Order.create({ ...others, userId, status });
        let orderDetails = [];
        items.forEach(item => {
            orderDetails.push({
                orderId: order.id,
                productId: item.product.id,
                price: item.product.price
            });
        });
        await models.OrderDetail.bulkCreate(orderDetails);
        req.session.cart.clear();
    }
    return res.render('error', { message: 'Order Placed Successfully!' });
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

controller.show = async (req, res) => {
    let userId = req.user.id;
    const user = await models.User.findOne({ 
        where: { id: userId },
        attributes: ['firstName', 'lastName', 'email', 'mobile']
    });
    res.locals.user = user;

    let orders = await models.Order.findAll({
        where: { userId },
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'quantity', 'total', 'subtotal', 'discount', 'paymentMethod', 'status', 'updatedAt',
            [sequelize.literal(`to_char("Order"."updatedAt", 'Mon DD, YYYY HH24:MI')`), 'formattedUpdatedAt']],
        include: [{ 
            model: models.Product,
            attributes: ['id', 'name', 'imagePath', 'price']
        }]
    });

    if (orders) {
        orders.forEach(order => {
            order.formattedUpdatedAt = order.dataValues.formattedUpdatedAt;
        });
    }
    res.locals.orders = orders;

    res.render('account', { personalMessage: req.flash('personalMessage'), passwordMessage: req.flash('passwordMessage') });
}

controller.updatePersonal = async (req, res) => {
    let userId = req.user.id;
    const { firstName, lastName, email, mobile } = req.body;
    const [rows] = await models.User.update({ firstName, lastName, email, mobile }, { where: { id: userId } });
    if (rows > 0)
        req.flash('personalMessage', 'Profile updated successfully!');
    else
        req.flash('personalMessage', 'Profile update failed!');
    res.redirect('/users/account');
}

controller.updatePassword = async (req, res) => {
    let userId = req.user.id;
    const { currentPassword, password, confirmPassword } = req.body;

    const user = await models.User.findOne({ where: { id: userId } });
    if (!bcrypt.compareSync(currentPassword, user.password)) {
        req.flash('passwordMessage', 'Current password is incorrect!');
        return res.redirect('/users/account');
    }
    if (password !== confirmPassword) {
        req.flash('passwordMessage', 'Password and Confirm Password does not match!');
        return res.redirect('/users/account');
    }

    const [rows] = await models.User.update({ 
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)) }, 
        { where: { id: userId } 
    });
    if (rows > 0)
        req.flash('passwordMessage', 'Password updated successfully!');
    else
        req.flash('passwordMessage', 'Password update failed!');
    res.redirect('/users/account');
}

module.exports = controller