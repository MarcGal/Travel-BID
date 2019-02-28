const express = require('express');
const middlewares = require('../middlewares');
const Offer = require('../models/offer');

const router = express.Router();

router.use(middlewares.protectedRoute);

// GET DASHBOARD
router.get('/', (req, res, next) => {
  const userID = res.locals.currentUser._id;
  console.log(userID);
  Offer.find({ userID })
    .then((offers) => {
      console.log(offers);
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
  const userID = req.session.currentUser._id;
  Offer.findById(id)
    .then((offer) => {
      res.render('protected/offer', { offer, userID });
    })
    .catch((error) => {
      next(error);
    });
});

// GET SEARCH INPUT

router.get('/q', (req, res, next) => {
  const { q } = req.query;
  Offer.find({ location: q })
    .then((offers) => {
      res.render('protected/search', { offers });
    })
    .catch((error) => {
      next(error);
    });
});

// UPDATE OFFER
router.get('/offer/:id/update', (req, res, next) => {
  const { id } = req.params;
  Offer.findById(id)
    .then((offer) => {
      res.render('protected/offerupdate', { offer });
    })
    .catch((error) => {
      next(error);
    });
});

// POST UPDATE OFFER
router.post('/offer/:id/update', (req, res, next) => {
  const { from, until, location, budget } = req.body;
  const { id } = req.params;
  const userID = req.session.currentUser._id;
  Offer.findOneAndUpdate(id, {
    userID,
    from,
    until,
    location,
    budget,
  }, { new: true })
    .then((offer) => {
      res.redirect(`/dashboard/offer/${offer.id}`);
      // res.redirect('/dashboard');
    })
    .catch((error) => {
      next(error);
    });
});


// POST DELETE OFFER
router.post('/offer/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Offer.deleteOne({ _id: id })
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch((error) => {
      next(error);
    });
});


module.exports = router;
