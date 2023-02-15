const express = require('express');

const { checkAuthenticated } = require('../auth/check-authenticated');

const router = express.Router();

router.get('/', checkAuthenticated('/auth/login'), (req, res) => {
  res.render('index.ejs', { username: req.user.username });
});

module.exports = router;
