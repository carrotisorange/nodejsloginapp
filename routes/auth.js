const express = require('express');
const router = express.Router();
const bodyParser =  require('body-parser');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const saltRounds = 10;
const myPlaintextPassword = 'password';

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

const salt = bcrypt.genSaltSync(saltRounds);

// Store hash in your password DB.

const app = express();

router.get('/login', (req, res) => {
    res.render('login');
});

//create signup
// router.get('/signup', (req, res) => {
//     res.render('signup');
// });

//post signup
router.get('/signup', (req, res) => {
    // let = username = req.body.username;
    // let = password = req.body.password;

    let encryptedPassword = bcrypt.hashSync(myPlaintextPassword, salt);

    let user = {name: 'Juan', email: 'juan@gmail.com', 'password':encryptedPassword};
    let sql = `INSERT INTO users SET ?`;
    let query = db.query(sql, user, (err, result)=>{
        if(err) throw err;
            console.log(result);
        res.send('new user is created...')
    });
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard',{
        'username':'new user'
    });
});

 // create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//fake credentials
 const credentials = {
    username:"admin",
    password: "root"
 }

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: uuidv4(), 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

router.post('/authenticate',  urlencodedParser, (req, res) => {
  let = username = req.body.username;
  let = password = req.body.password;
    
  if(username === credentials.username && password === credentials.password){
    res.render('dashboard',{
        'username' : username
  });
  }
  else{
    req.session.username = 1
    // res.end("Invalid credentials!");
  }
});

module.exports = router;

