const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const Message = require('../models/Message');
const { render404NotFound } = require('../errors/error-pages');

const router = express.Router();

router.get('/:userid', async (req, res) => {
  const userid = toObjectId(req.params.userid);
  if (userid == null) {
    return render404NotFound(req, res);
  }

  const exists = await userExists(userid);
  if (!exists) {
    return render404NotFound(req, res);
  }

  res.render('chat', { user: req.user, userid });
});

router.post(
  '/:userid/messages',
  body('message').trim().notEmpty().withMessage('Message cannot be empty.'),
  async (req, res) => {
    const userid = toObjectId(req.params.userid);
    if (userid == null) {
      return render404NotFound(req, res);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(({ msg }) => msg);
      return res.render('chat', { userid, errors: messages });
    }

    await Message.create({
      sender: req.user._id,
      receiver: userid,
      body: req.body.message,
    });

    res.redirect(`${req.baseUrl}/${userid}`);
  }
);

async function userExists(userid) {
  const user = await User.findById(userid);
  return user != null;
}

function toObjectId(str) {
  try {
    return mongoose.Types.ObjectId(str);
  } catch (e) {
    return null;
  }
}

module.exports = router;
