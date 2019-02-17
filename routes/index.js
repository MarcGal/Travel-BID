const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET LOGIN PAGE
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

// GET SIGNUP PAGE
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

module.exports = router;
