const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('./database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  // Local Strategy
  passport.use(new LocalStrategy( (username, password, done) => {
    // Match username
    let query = {username: username};
    User.findOne(query, (err, user) => {
      // Handle Errors
      if (err) console.log(err);
      // Handle user not found
      if (!user) {
        return done(null, false, {message: 'User not found.'});
      }
      // Match Password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) console.log(err);
        if (isMatch) {
          return done(null, user);
        }
        else {
          return done(null, false, {message: 'Incorrect password.'});
        }
      });
    });
  }));

  // Use a cookie to maintain user sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
