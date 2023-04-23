//import packages and other files
const express = require('express');
const router = express.Router();
const bodyParser =  require('body-parser');
const { v4: uuidv4 } = require('uuid');
const sessions = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const saltRounds = 10;
// Store hash in your password DB.
const salt = bcrypt.genSaltSync(saltRounds);

 // create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();

//establish the connection
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'nodemysql'
});

//connect to the db
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Mysql is connected');
});

app.use(sessions({
    secret: '1234567890QWERT',
    resave: false,
    saveUninitialized: true
}));


//login page
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
                        // req.sessions.user = result;
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
    // console.log(req.sessions.user);
    res.render('dashboard',{
        'username':'new user'
    });
});

//logout 
router.post('/logout' ,(req, res)=>{

    res.render('login');
});

module.exports = router;

