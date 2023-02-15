const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/User');
const { checkNotAuthenticated } = require('../auth/check-authenticated');

const router = express.Router();

router.get('/register', checkNotAuthenticated('/'), (req, res) => {
  res.render('register.ejs');
});

router.post('/register', checkNotAuthenticated('/'), async (req, res) => {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });
    res.redirect('/auth/login');
  } catch (e) {
    console.error(e);
    res.redirect('/auth/register');
  }
});

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
  req.logOut(err => {
    if (err) {
      return console.error(err);
    }
  });
  res.redirect('/auth/login');
});

module.exports = router;
