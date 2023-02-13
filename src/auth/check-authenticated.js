function checkAuthenticated(redirect) {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect(redirect);
  };
}

function checkNotAuthenticated(redirect) {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect(redirect);
    }

    next();
  };
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
