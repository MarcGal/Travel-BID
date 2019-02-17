const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const saltRounds = 10;

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
  res.render('auth/signup', { errorMessage: undefined });
});

// POST SIGNUP FORM
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    return res.render('auth/signup', { errorMessage: 'no empty fields' });
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { errorMessage: 'user already exists' });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.create({ username, password: hashedPassword })
          .then(() => {
            res.redirect('/users');
          }).catch((error) => {
            next(error);
          });
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
