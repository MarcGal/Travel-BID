const express = require('express');
const middlewares = require('../middlewares');
const Offer = require('../models/offer');

// const User = require('../models/user');

const router = express.Router();

router.use(middlewares.protectedRoute);

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('users/start');
});

// GET create offer form
router.get('/create', (req, res, next) => {
  console.log('estamos en create offer');
  res.render('users/create');
});

// POST create offer
router.post('/create', (req, res, next) => {
  console.log('estamos creadon una offer');
  const { from, until, location, budget } = req.body;
  const userID = req.session.currentUser._id;
  const { username } = req.session.currentUser;
  const { userDescription } = req.session.currentUser;

  Offer.create({
    userID,
    username,
    userDescription,
    from,
    until,
    location,
    budget,
  })
    .then((createdOffer) => {
      res.redirect('/users/myoffers');
    })
    .catch((error) => {
      next(error);
    });
});

// GET myOffers
router.get('/myoffers', (req, res, next) => {
  const userID = res.locals.currentUser._id;
  console.log(userID);
  Offer.find({ userID })
    .then((offers) => {
      console.log(offers);
      res.render('users/myoffers', { offers });
    })
    .catch((error) => {
      next(error);
    });
});

// Ejemplos de referencia a utilizar cuando el usurio quiere
// realizar operaciones CRUD sobre ofertas y pujas
// const { name, origin, destination } = req.body;
// const userID = req.session.currentUser._id;


module.exports = router;
