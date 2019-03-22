const express = require('express');
const axios = require('axios');
const middlewares = require('../middlewares');
const Offer = require('../models/offer');
const Bid = require('../models/bid');
const Users = require('../models/user');
const Rooms = require('../models/room');


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
router.post('/create', async (req, res, next) => {
  const { from, until, location, budget } = req.body;
  const unsplashKey = 'eaa9afcbc380f265dfce4a2a7fe4956c1b686d50ae369b133539b9a0e3b8fdc1';
  const userID = req.session.currentUser._id;
  try {
    const unsplashResp = await axios.get(`https://api.unsplash.com/photos/random?client_id=${unsplashKey}&query=${location}&orientation=squarish`);
    const image = unsplashResp.data.urls.regular;
    if (Date.parse(from) < Date.now()) {
      req.flash('error', 'You can not make a reservation in the past bro');
      res.redirect('./create');
    } else {
      await Offer.create({
        userID,
        image,
        from,
        until,
        location,
        budget,
      });
      res.redirect('/dashboard');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/offer/:id', async (req, res, next) => {
  const { id } = req.params;
  const userID = res.locals.currentUser._id;
  try {
    const offer = await Offer.findById(id);
    const offerOwner = await Users.findById(offer.userID);
    const bids = await Bid.find({ offerID: offer._id});
    // const rooms = await bids.forEach((bid) => {
    //   Rooms.find({ userID: bid.userID });
    // });
    res.render('protected/offer', { offer, bids, userID, offerOwner });
  } catch (error) {
    res.render('error');
    next(error);
  }
});

// GET SEARCH INPUT
router.get('/search', (req, res, next) => {
  const { search } = req.query;
  Offer.find({ location: { $regex: new RegExp(search, 'i') }, Status: 0 })
    .then((offers) => {
      res.render('protected/search', { offers, search });
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
  const { from, until, budget } = req.body;
  const { id } = req.params;
  const userID = req.session.currentUser._id;
  Offer.findByIdAndUpdate(id, {
    userID,
    from,
    until,
    // location,
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
router.post('/offer/:id/bidnew', async (req, res, next) => {
  try {
    const { bidValue, bidDescription } = req.body;
    const userID = req.session.currentUser._id;
    const bidOwner = await Users.findById(userID);
    const room = await Rooms.findOne({ userID: bidOwner.id });
    const { id } = req.params;
    const bidExists = await Bid.findOne({ offerID: id, userID });
    if (bidExists) {
      req.flash('error', 'Your can not bid twice on the same offer');
      res.redirect(`/dashboard/offer/${id}`);
    } else {
      await Bid.create({
        userID,
        offerID: id,
        roomID: room._id,
        accomodationImage: room.accomodationImage,
        bidValue,
        bidDescription,
      });
      req.flash('success', 'Your bid was succesfuly created');
      res.redirect(`/dashboard/offer/${id}`);
    }
  } catch (error) {
    next(error);
  }
});

// GET BID DETAIL
router.get('/bid/:id', async (req, res, next) => {
  console.log('estamos en bid detail');
  const { id } = req.params;
  const userID = res.locals.currentUser._id;
  try {
    const bid = await Bid.findById(id);
    const bidOwner = await Users.findById(bid.userID);
    const offer = await Offer.findById(bid.offerID);
    const room = await Rooms.findOne({ userID: bidOwner.id });
    console.log(room);
    res.render('protected/bid', { bid, userID, bidOwner, offer, room });
  } catch (error) {
    res.render('error');
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
    req.flash('success', 'The bid was succesfully deleted');
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
    req.flash('success', 'Great! You have accepted a bid');
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

// RENDER MAP

router.get('/offer/:id/map', async (req, res, next) => {
  const { id } = req.params;
  const userID = res.locals.currentUser._id;
  try {
    const offer = await Offer.findById(id);
    const bids = await Bid.find({ offerID: offer._id})
      .populate('roomID');
    res.render('protected/map', { offer, bids, userID });
  } catch (error) {
    res.render('error');
    next(error);
  }
});

// Stripe route
router.post('/accepted', (req, res, next)=> {
  res.redirect('/dashboard');
});


module.exports = router;
