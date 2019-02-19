const express = require('express');
const middlewares = require('../middlewares');

// const User = require('../models/user');

const router = express.Router();

router.use(middlewares.protectedRoute);

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('users/start');
});

// Ejemplos de referencia a utilizar cuando el usurio quiere
// realizar operaciones CRUD sobre ofertas y pujas
// const { name, origin, destination } = req.body;
// const userID = req.session.currentUser._id;


module.exports = router;
