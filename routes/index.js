const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const middlewares = require('../middlewares');

const saltRounds = 10;

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET LOGIN PAGE
router.get('/login', (req, res, next) => {
  res.render('auth/login', { errorMessage: undefined });
});

// POST LOGIN FORM
router.post('/login', (req, res, next) => {
  const { username, password } = req.body; 
  if (username === '' || password === '') {
    return res.render('auth/login', { errorMessage: 'no empty fields' });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'The username does not exist.' });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/users');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password' });
      }
    })
    .catch((error) => {
      next(error);
    });
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

// LOGOUT USER
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect('/');
  });
});

module.exports = router;
