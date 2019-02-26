const express = require('express');
const middlewares = require('../middlewares');
const Offer = require('../models/offer');

const router = express.Router();

router.use(middlewares.protectedRoute);

/* GET users listing. */
router.get('/', (req, res, next) => {
  const userID = res.locals.currentUser._id;
  Offer.find({ userID })
    .then((offers) => {
      res.render('protected/dashboard', { offers });
    })
    .catch((error) => {
      next(error);
    });
});

// GET create offer form
router.get('/create', (req, res, next) => {
  res.render('protected/create');
});

// POST create offer
router.post('/create', (req, res, next) => {
  const { from, until, location, budget } = req.body;
  const userID = req.session.currentUser._id;

  Offer.create({
    userID,
    from,
    until,
    location,
    budget,
  })
    .then((createdOffer) => {
      res.redirect('/dashboard');
    })
    .catch((error) => {
      next(error);
    });
});

// // GET ONE OFFER DETAIL
router.get('/offer/:id', (req, res, next) => {
  const { id } = req.params;
  Offer.findById(id)
    .then((offer) => {
      res.render('protected/myoffer', { offer });
    })
    .catch((error) => {
      next(error);
    });
});

// GET SEARCH INPUT

router.get('/q', (req, res, next) => {
  const { location } = req.query;
  console.log(location);
  Offer.find(location)
    .then((offers) => {
      console.log(offers);
      res.render('protected/search', { offers });
    })
    .catch((error) => {
      next(error);
    });
});


module.exports = router;
