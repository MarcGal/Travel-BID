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
    res.render('protected/offer', { offer, bids, userID });
  } catch (error) {
    next(error);
  }
});

// GET SEARCH INPUT
router.get('/search', (req, res, next) => {
  const { search } = req.query;
  Offer.find({ location: search, Status: 0 })
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
  Offer.findByIdAndUpdate(id, {
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
  res.render('protected/bidnew', { id });
});

// CREATE NEW BID
router.post('/offer/:id/bidnew', (req, res, next) => {
  const { bidValue, bidDescription } = req.body;
  const userID = req.session.currentUser._id;
  const { id } = req.params;
  Bid.create({
    userID,
    offerID: id,
    bidValue,
    bidDescription,
  })
    .then(() => {
      req.flash('success', 'bid creada');
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
router.post('/bid/:id/delete', async (req, res, next) => {
  const { id } = req.params;
  try {
    const bid = await Bid.findById(id);
    const offer = bid.offerID;
    await Bid.findByIdAndDelete(bid.id);
    req.flash('success', 'Bid deleted');
    res.redirect(`/dashboard/offer/${offer}`);
  } catch (error) {
    next(error);
  }
});
// GET BID ACCEPT
router.get('/bid/:id/accept', async (req, res, next) => {
  const { id } = req.params;
  try {
    const bid = await Bid.findById(id);
    const offer = await Offer.findById(bid.offerID);
    await Bid.findByIdAndUpdate(id, { Status: 1 });
    await Offer.findByIdAndUpdate(offer.id, { Status: 1 });
    const bids = await Bid.find({ offerID: bid.offerID, Status: 0 });
    await bids.forEach(async (bidDecline) => {
      await Bid.findByIdAndUpdate(bidDecline.id, { Status: 2 });
    });
    req.flash('success', 'Bid accepted');
    res.redirect(`/dashboard/offer/${offer.id}`);
  } catch (error) {
    next(error);
  }
});

// GET BID DECLINE
router.get('/bid/:id/decline', async (req, res, next) => {
  const { id } = req.params;
  try {
    const bid = await Bid.findById(id);
    const offer = await Offer.findById(bid.offerID);
    await Bid.findByIdAndUpdate(id, { Status: 2 });
    req.flash('error', 'Bid declined');
    res.redirect(`/dashboard/offer/${offer.id}`);
  } catch (error) {
    next(error);
  }
});

// UPDATE BID
router.get('/bid/:id/update', (req, res, next) => {
  const { id } = req.params;
  Bid.findById(id)
    .then((bid) => {
      res.render('protected/bidupdate', { bid });
    })
    .catch((error) => {
      next(error);
    });
});

// POST UPDATE BID
router.post('/bid/:id/update', (req, res, next) => {
  const { bidValue, bidDescription } = req.body;
  const { id } = req.params;
  Bid.findByIdAndUpdate(id, { bidValue, bidDescription })
    .then((bid) => {
      res.redirect(`/dashboard/bid/${bid.id}`);
    })
    .catch((error) => {
      next(error);
    });
});
module.exports = router;
