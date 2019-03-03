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
  const { email, password } = req.body;
  if (email === '' || password === '') {
    req.flash('error', 'No empty fields');
    return res.render('auth/login');
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'The email does not exist.');
        res.render('auth/login');
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/dashboard');
      } else {
        req.flash('error', 'Incorrect password');
        res.render('auth/login');
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
  const { 
    email, password,
    name, age, gender, description,
    accomodationAddress, accomodationDescription,
  } = req.body;

  if (email === '' || password === '' || name === '') {
    req.flash('error', 'no empty fields');
    return res.render('auth/signup');
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash('error', 'user already exists');
        res.render('auth/signup');
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.create({ email, password: hashedPassword, name, age, gender, description, accomodationAddress, accomodationDescription })
          .then((newUser) => {
            req.flash('success', `Welcome ${newUser.name}`);
            res.redirect('/dashboard');
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
