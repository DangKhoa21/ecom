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
app.use('/', require('./routes/indexRouter'));

app.use((req, res, next) => {
    res.status(404).render("404", { message: "File not found!" });
})

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send("Internal Server Error!");
})

//khoi dong web server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});