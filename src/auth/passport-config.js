const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

function intializePassport(passport) {
  passport.use(
    'local',
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      done(null, await User.findById(id));
    } catch (e) {
      done(e);
    }
  });
}

module.exports = intializePassport;

async function authenticateUser(username, password, done) {
  try {
    const user = await User.findOne({ username });
    if (user == null) {
      return done(null, false, { message: 'No user with that username' });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      return done(null, false, { message: 'Password incorrect' });
    }

    return done(null, user);
  } catch (e) {
    return done(e);
  }
}
