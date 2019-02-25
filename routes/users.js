const express = require('express');
const middlewares = require('../middlewares');
const Offer = require('../models/offer');

// const User = require('../models/user');

const router = express.Router();

router.use(middlewares.protectedRoute);

/* GET users listing. */
router.get('/', (req, res, next) => {
  const userID = res.locals.currentUser._id;
  Offer.find({ userID })
    .then((offers) => {
      res.render('users/dashboard', { offers });
    })
    .catch((error) => {
      next(error);
    });
});

// GET create offer form
router.get('/create', (req, res, next) => {
  res.render('users/create');
});

// POST create offer
router.post('/create', (req, res, next) => {
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
      res.redirect('/users');
    })
    .catch((error) => {
      next(error);
    });
});

// // GET ONE OFFER DETAIL
router.get('/offer/:id', (req, res, next) => {
  console.log('Estamos en offerID');
  const { id } = req.params;
  console.log(id);
  Offer.findById(id)
    .then((offer) => {
      res.render('users/myoffer', { offer });
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
