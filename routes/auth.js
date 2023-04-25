//import packages and other files
require('dotenv').config();
//console.log(process.env) // remove this after you've confirmed it is working
const express = require('express');
const router = express.Router();
const bodyParser =  require('body-parser');
const { v4: uuidv4 } = require('uuid');
var  session = require("express-session");
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const { query, validationResult } = require('express-validator');


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
    saveUninitialized: false,
}));

//login page
router.get('/', (req, res) => {
    res.render('login');
});

router.get('/login', (req, res) => {
    res.render('login',{
        'error':req.app.get('error')
    });
});

//signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

//post signup
router.post('/signup',
[
    query('name').notEmpty().withMessage('Name cannot be empty.'),
    query('username').notEmpty().withMessage('Username cannot be empty.'),
    query('password').notEmpty().withMessage('Password cannot be empty.')
]
, urlencodedParser, (req, res) => {
     //access data from the form
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    //encrypt the password
    let encryptedPassword = bcrypt.hashSync(password, salt);

    const errors = validationResult(req)

    console.log(errors.isEmpty())
    
    if(errors.isEmpty()){
        let user = {'name':name, 'username': username, 'password':encryptedPassword};
        let sql = `INSERT INTO users SET ?`;
        let query = db.query(sql, user, (err, result)=>{
        if(err) throw err;
        res.render('dashboard',{
            'username': username,
        })
    });
    }else{
        return res.status(400).json({errors:errors.array()});
    }
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
                req.app.set('error', 'Invalid username!')
                res.redirect('/login')
              } else {
                  var hashedPassword = result[0].password;
                  var response = bcrypt.compareSync(password, hashedPassword);

                  if (response == false) {
                      req.app.set('error', 'Password verification failed!')
                      res.redirect('/login')
                  } else {
                        //session
                        req.app.set('username', username)
                        res.redirect('/dashboard')
                  }
              }
          }
       });
	} else {
        req.app.set('error', "Please enter username and password!")
        res.redirect('/login')
	}
});

//dashboard page
router.get('/dashboard', (req, res) => {
    res.render('dashboard',{
        'username': req.app.get('username'),
    });
});

//logout 
router.post('/logout' ,(req, res)=>{
    //destroy the created session
    //code here
    res.render('login');
});

router.get('/add', (req, res)=>{
    var sum = addNum(1,1)
    console.log(sum+1)
});

//function
function addNum(num1, num2){
    const sum = num1 + num2;

    return (sum)
}

function subtractNum(num1, num2){
    var diff = num1 - num2;

    return diff;
}

module.exports = router;

