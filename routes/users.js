const express = require('express');
const middlewares = require('../middlewares');

// const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', middlewares.protectedRoute, (req, res, next) => {
  res.render('users/start');
});

module.exports = router;
