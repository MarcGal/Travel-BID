module.exports = {
  protectedRoute: (req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect('/login');
    }
  },
  anonRoute: (req, res, next) => {
    if (req.session.currentUser) {
      res.redirect('/moves');
    } else {
      next();
    }
  },
  checkRole: (role) => {
    return (req, res, next) => {
      if (req.session.currentUser.role === role) {
        next();
      } else {
        res.redirect('login');
      }
    };
  },
};
