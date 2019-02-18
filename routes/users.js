const express = require('express');

// const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('users/start');
});

module.exports = router;
