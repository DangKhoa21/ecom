'use strict';

require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const expressHandlebars = require('express-handlebars');
const { createStarList, createSpecTable } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');
const redisStore = require('connect-redis').default;
const { createClient } = require('redis');

// Paypal
const { createOrder } = require('./controllers/paypal');


// const redisClient = createClient({    
//     url: process.env.REDIS_URL
// });
// redisClient.connect().catch(console.error);

//config public static folder
app.use(express.static(__dirname + '/public'));

//config handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        createStarList,
        createPagination,
        createSpecTable
    }
}));
app.set('view engine', 'hbs');

// configure to read post request
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

// session configure
app.use(session({
    secret: process.env.SESSION_SECRET || 'Group2_S3cret',
    // store: new redisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 // 20min
    }
}));

// middleware to initialize cart
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;

    next();
})


app.get("/api/getCart", (req, res) => {
    // console.log("reach api get cart")
    console.log(req.session.cart.getCart())
    return res.json({
        cart: req.session.cart.getCart()
    });
})

// Test paypal
// createOrder route
app.post("/api/orders", async (req, res) => {
    try {
        // use the cart information passed from the front-end to calculate the order amount detals
        const { cart } = req.body;
        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

// routes
app.use('/shop', require('./routes/shopRouter'));
app.use('/', require('./routes/indexRouter'));
app.use('/users', require('./routes/usersRouter'));

app.use((req, res, next) => {
    res.status(404).render("error", { message: "Page Not Found!", error_code: 404 });
})

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render("error", { message: "Internal Server Error!", error_code: 500 });
})

// launch web server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});