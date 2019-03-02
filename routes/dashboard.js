const express = require('express');
const middlewares = require('../middlewares');
const Offer = require('../models/offer');
const Bid = require('../models/bid');

const router = express.Router();

router.use(middlewares.protectedRoute);

// GET DASHBOARD
router.get('/', async (req, res, next) => {
  const userID = res.locals.currentUser._id;
  try {
    const offers = await Offer.find({ userID });
    const bids = await Bid.find({ userID });
    res.render('protected/dashboard', { offers, bids, userID });
  } catch (error) {
    next(error);
  }
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

router.get('/offer/:id', async (req, res, next) => {
  const { id } = req.params;
  const userID = res.locals.currentUser._id;
  try {
    const offer = await Offer.findById(id);
    const bids = await Bid.find({ offerID: offer._id});
    console.log(bids);
    console.log(offer._id);
    res.render('protected/offer', { offer, bids, userID });
  } catch (error) {
    next(error);
  }
});

// GET SEARCH INPUT
router.get('/search', (req, res, next) => {
  const { search } = req.query;
  console.log(search);
  Offer.find({ location: search })
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

// GET NEW BID FORM
router.get('/offer/:id/bidnew', (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  res.render('protected/bidnew', { id });
});

// CREATE NEW BID
router.post('/offer/:id/bidnew', (req, res, next) => {
  const { bidValue, bidDescription } = req.body;
  const userID = req.session.currentUser._id;
  const { id } = req.params;
  console.log(id);

  Bid.create({
    userID,
    offerID: id,
    bidValue,
    bidDescription,
  })
    .then(() => {
      console.log('bid creada');
      res.redirect(`/dashboard/offer/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

// GET BID DETAIL
router.get('/bid/:id', async (req, res, next) => {
  const { id } = req.params;
  const userID = res.locals.currentUser._id;
  try {
    const bid = await Bid.findById(id);
    const offer = await Offer.findById(bid.offerID);
    res.render('protected/bid', { bid, userID, offer });
  } catch (error) {
    next(error);
  }
});

// POST DELETE BID
router.post('/bid/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Bid.deleteOne({ _id: id })
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch((error) => {
      next(error);
    });
});
// GET BID ACCEPT
router.get('/bid/:id/accept', async (req, res, next) => {
  const { id } = req.params;
  try {
    const bid = await Bid.findById(id);
    const offer = await Offer.findById(bid.offerID);
    await Bid.findOneAndUpdate(id, { userID: bid.userID, offerID: bid.offerID, bidValue: bid.bidValue, bidDescription: bid.bidDescription, Status: 1 }, { new: true });
    await Offer.findOneAndUpdate(offer.id, {
      userID: offer.userID,
      from: offer.from,
      until: offer.until,
      location: offer.location,
      budget: offer.budget,
      Status: 1,
    }, { new: true });
    console.log(bid, offer.id);
    res.redirect(`/dashboard/offer/${offer.id}`);
  } catch (error) {
    next(error);
  }
});

// router.post('/offer/:id/update', (req, res, next) => {
//   const { from, until, location, budget } = req.body;
//   const { id } = req.params;
//   const userID = req.session.currentUser._id;
//   Offer.findOneAndUpdate(id, {
//     userID,
//     from,
//     until,
//     location,
//     budget,
//   }, { new: true })
//     .then((offer) => {
//       res.redirect(`/dashboard/offer/${offer.id}`);
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

module.exports = router;
