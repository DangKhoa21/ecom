'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const expressHandlebars = require('express-handlebars');

//config public static folder
app.use(express.static(__dirname + '/public'));

//config handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
}));
app.set('view engine', 'hbs');

// routes
app.get('/createTables', (req, res) => {
    let models  = require('./models');
    models.sequelize.sync().then(() => {
        res.send('create Tables successed!');
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/:page', (req, res) => {
    res.render(req.params.page);
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});