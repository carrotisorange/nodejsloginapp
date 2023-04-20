const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const PORT = 3000;

const routes = require('./routes/auth');

const app = express();

//templating engine

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes);

app.listen(PORT, () => {
    console.log('Server is running at port ' + PORT);
});
