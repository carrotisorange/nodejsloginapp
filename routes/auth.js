//import packages and other files
require('dotenv').config();
// console.log(process.env) // remove this after you've confirmed it is working
const express = require('express');
const router = express.Router();
const bodyParser =  require('body-parser');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const saltRounds = 10;
// Store hash in your password DB.
const salt = bcrypt.genSaltSync(saltRounds);

 // create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

const app = express();

//establish the connection
const db = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//connect to the db
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Mysql is connected');
});

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

//login page
router.get('/', (req, res) => {
    res.render('login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

//signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

//post signup
router.post('/signup', urlencodedParser, (req, res) => {
     //access data from the form
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    //encrypt the password
    let encryptedPassword = bcrypt.hashSync(password, salt);

    let user = {'name':name, 'username': username, 'password':encryptedPassword};
    let sql = `INSERT INTO users SET ?`;
    let query = db.query(sql, user, (err, result)=>{
        if(err) throw err;
        res.render('dashboard',{
            'username': username,
        })
    });
});

//authenticate user
router.post('/authenticate',  urlencodedParser, (req, res) => {
    //access data from the form
    let = username = req.body.username;
    let = password = req.body.password;

// Ensure the input fields exists and are not empty
	if (username && password) {
        const params = [username];
        
        const sql = "SELECT * FROM users where username = ?";
     
        let query = db.query(sql, params, (err, result)=> {
          if (err) {

             throw err;

          } else {

              if (result.length == 0) {

                  res.send("Invalid username.");

              } else {
                 
                  var hashedPassword = result[0].password;
                  var response = bcrypt.compareSync(password, hashedPassword);

                  if (response == false) {
                     res.send("Password verification failed.");
                  } else {
                        //create a session here
                        //code
                        res.redirect('/dashboard')
                  }
              }
          }
       });
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

//dashboard page
router.get('/dashboard', urlencodedParser, (req, res) => {
    // check if the use is authenticated via session
    //code here
    res.render('dashboard',{
        'username':'username'
    });
});

//logout 
router.post('/logout' ,(req, res)=>{
    //destroy the created session
    res.render('login');
});

module.exports = router;

