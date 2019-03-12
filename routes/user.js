const express = require('express');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const middlewares = require('../middlewares');
const Users = require('../models/user');


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
router.post('/update', parser.single('image'), (req, res, next) => {
  const accomodationImage = req.file.url;
  const userImage = req.file.url;

  const userID = req.session.currentUser._id;
  const { 
    name, age, gender, description,
    accomodationAddress, accomodationDescription,
  } = req.body;
  Users.findByIdAndUpdate(userID, { 
    name,
    age,
    gender,
    description,
    accomodationAddress,
    accomodationDescription,
    userImage,
    accomodationImage,
  }, { new: true })
    .then((user) => {
      req.flash('success', 'Your profile was succesfully updated!');
      res.redirect('/user');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
