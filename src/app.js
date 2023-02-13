const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');

const User = require('./models/User');
const intializePassport = require('./auth/passport-config');
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('./auth/check-authenticated');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

intializePassport(passport);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, () =>
  console.log('Mongoose connected')
);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', checkAuthenticated('/login'), (req, res) => {
  res.render('index.ejs', { username: req.user.username });
});

app.get('/register', checkNotAuthenticated('/'), (req, res) => {
  res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated('/'), async (req, res) => {
  const { username, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    res.redirect('/login');
  } catch (e) {
    console.error(e);
    res.redirect('/register');
  }
});

app.get('/login', checkNotAuthenticated('/'), (req, res) => {
  res.render('login.ejs');
});

app.post(
  '/login',
  checkNotAuthenticated('/'),
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.delete('/logout', (req, res) => {
  req.logOut(err => {
    if (err) {
      return console.error(err);
    }
    console.log('User logged out');
  });
  res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
