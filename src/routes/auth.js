const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const { checkNotAuthenticated } = require('../auth/check-authenticated');

const router = express.Router();

router.get('/register', checkNotAuthenticated('/'), (req, res) => {
  res.render('register.ejs');
});

router.post(
  '/register',
  checkNotAuthenticated('/'),
  body('username')
    .notEmpty()
    .isLength({ min: 5, max: 15 })
    .custom(usernameNotInUse),
  body('password').notEmpty().isLength({ min: 8 }),
  async (req, res) => {
    const renderErrors = (errors) => res.render('register.ejs', { errors });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(({ msg }) => msg);
      return renderErrors(messages);
    }

    const { username, password } = req.body;

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ username, passwordHash });
      res.redirect('/auth/login');
    } catch (e) {
      console.error(e);
      renderErrors(['Server error']);
    }
  }
);

router.get('/login', checkNotAuthenticated('/'), (req, res) => {
  res.render('login.ejs');
});

router.post(
  '/login',
  checkNotAuthenticated('/'),
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

router.delete('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) {
      return console.error(err);
    }
  });
  res.redirect('/auth/login');
});

module.exports = router;

async function usernameNotInUse(username) {
  const getUser = async (username) => {
    try {
      return await User.findOne({ username });
    } catch (e) {
      console.error(e);
      throw new Error('Server error');
    }
  };

  const user = await getUser(username);
  if (user != null) {
    throw new Error('Username alredy in use');
  }
  return true;
}
