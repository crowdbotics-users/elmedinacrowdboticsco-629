'use strict'

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
models = require('../../server/models');

module.exports = function(app){
  // Serialize

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // Deserialize

  passport.deserializeUser(function(user, done) {
    models.user.findById(user.id, function(err, user) {
      done(err, user);
    });
  });

  // For login purposes

  passport.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done){
      models.user.findOne({ where: {email: username} }).then(function(user){
        if (!user) {
          return done('User Not Found', false);
        }

        if (!user.validPassword(password)) {
          return done('Invalid Password', false);
        }
        // currently email config is not asked while scaffold
        // if (!user.is_verified) {
        //   return done('Email Not Verified Yet.', false);
        // }

        return done(null, user);
      });
    }
  ));

// For Signup purposes

  passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true,
      usernameField: 'email',
      passwordField: 'password'
    },
    function(req, username, password, done){
      models.user.create({
        email: username,
        password: password
      }).then(function(user) {
        return done(null, user);
      }).catch(function(error) {
        return done(error, false);
      });
    }
  ));

}
