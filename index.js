//import modules and other files
const express = require('express');
const path = require('path');
const routes = require('./routes/auth');
const PORT = 3000;
const app = express();

//templating engine
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

//public folder
//styles
app.use('/static', express.static(path.join(__dirname, 'public')));
//images
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
//routes
app.use('/', routes);

//setup the server
app.listen(PORT, () => {
    console.log('Server is running at port ' + PORT);
});
