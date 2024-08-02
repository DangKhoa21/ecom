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

module.exports = controller