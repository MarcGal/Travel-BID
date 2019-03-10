const express = require('express');
const middlewares = require('../middlewares');
const Users = require('../models/user');


const router = express.Router();

router.use(middlewares.protectedRoute);

// GET PROFILE
router.get('/', (req, res, next) => {
  const id = req.session.currentUser._id;
  Users.findById(id)
    .then((user) => {
      res.render('protected/user', { user });
    })
    .catch((error) => {
      next(error);
    });
});


// GET UPDATE PROFILE
router.get('/update', (req, res, next) => {
  const id = req.session.currentUser._id;
  Users.findById(id)
    .then((user) => {
      res.render('protected/update', { user });
    })
    .catch((error) => {
      next(error);
    });
});


// POST UPDATE PROFILE
router.post('/update', (req, res, next) => {
  const userID = req.session.currentUser._id;
  const { 
    email, name, age, gender, description,
    accomodationAddress, accomodationDescription,
  } = req.body;

  // if (email === '' || password === '' || name === '') {
  //   req.flash('error', 'no empty fields');
  //   return res.render('auth/signup');
  // }
  Users.findByIdAndUpdate(userID, { email, name, age, gender, description,
    accomodationAddress, accomodationDescription })
    .then((user) => {
      req.flash('success', 'Your profile was succesfully updated!');
      res.redirect('/dashboard');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
