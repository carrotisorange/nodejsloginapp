const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/authenticate', (req, res) => {
    let email = req.params.email;
    if($email === ''){
        //dashboard
    }else{
        //prompt invalid credentials
    }
});

module.exports = router;

