'use strict'

const controller = {};
const models = require('../models');

controller.checkout = (req, res) => {
    if (req.session.cart.quantity > 0) {
        res.locals.cart = req.session.cart.getCart();
        return res.render('checkout');
    }
    return res.redirect('/shop');
}

controller.placeorders = (req, res) => {
    let userId = 1;
    let cart = req.session.cart;
    cart.paymentMethod = req.body.payment;

    switch(req.body.payment) {
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
    let userId = 1;
    let { items, ...others} = req.session.cart.getCart();
    if (items.length > 0) {
        let order = await models.Order.create({...others, userId, status});
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
    return res.render('error', {message: 'Order Placed Successfully!'});
}

module.exports = controller