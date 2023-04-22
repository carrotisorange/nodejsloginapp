const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const path = require('path');
const ejs = require('ejs');

const PORT = 3000;

const routes = require('./routes/auth');

const app = express();

//templating engine
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

//public folder
//styles
app.use('/static', express.static(path.join(__dirname, 'public')));
//images
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use('/', routes);

app.listen(PORT, () => {
    console.log('Server is running at port ' + PORT);
});
