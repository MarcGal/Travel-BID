const express = require('express');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const axios = require('axios');
const middlewares = require('../middlewares');
const Users = require('../models/user');
const Rooms = require('../models/room');


const router = express.Router();

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'BidImage',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
});

const parser = multer({ storage });

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
  // const accomodationImage = req.file.url;
  const userID = req.session.currentUser._id;
  // const coordinates = [req.body.location, req.body.location2]
  const {
    name, age, gender, description,
  } = req.body;
  // const encodedUrl = encodeURI(accomodationAddress);
  // console.log(encodedUrl);
  // const mapboxToken = 'pk.eyJ1IjoibWFyZ2FsIiwiYSI6ImNqdDRqbGJ2MzA0Mmc0NG55Y29sNnR1djUifQ.7_iCD0Qq6rri-WgOaFmCAg';

  // const resp = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${accomodationAddress}.json?access_token=${mapboxToken}`);
  // console.log(resp);
  // const address = [resp.data.features[1].geometry.coordinates[1], resp.data.features[1].geometry.coordinates[0]];
  // console.log(address);
  Users.findByIdAndUpdate(userID, {
    name,
    age,
    gender,
    description,
  }, { new: true })
    .then((user) => {
      req.flash('success', 'Your profile was succesfully updated!');
      res.redirect('/user');
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/update/room', parser.single('image'), (req, res, next) => {
  const accomodationImage = req.file.url;
  const userID = req.session.currentUser._id;
  const coordinates = [req.body.location, req.body.location2];
  const {accomodationDescription, privateRoom, sharedRoom, entireProperty, tv, wifi, air, garage, termo, washer, pool, privateBathroom, wheelchair, smoke, pet, couples } = req.body;
  Rooms.create({
    userID,
    location: {
      type: 'Point',
      coordinates,
    },
    privateRoom,
    sharedRoom,
    entireProperty,
    tv,
    wifi,
    air,
    garage,
    termo,
    washer,
    pool,
    privateBathroom,
    wheelchair,
    smoke,
    pet,
    couples,
    accomodationDescription,
    accomodationImage,
  }).then((room) => {
    room.save();
    console.log(room);
    req.flash('success', 'Your room was succesfully created!');
    res.redirect('/user');
  })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
