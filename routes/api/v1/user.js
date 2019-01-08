var express = require('express');
var router = express.Router();
var passport = require("passport");
var async = require('async');
var nodemailer = require('nodemailer');
var moment = require('moment');
var crypto = require('crypto');
var path = require('path');
var models = require('../../../server/models');
var sessionHelper = require('../../../server/helpers/session');
var config = require('../../../server/config/config.js');
var smtpTransport = nodemailer.createTransport(config.mailer.options);

function sendVerificationEmail(user, req, res, callback) {
  async.waterfall([

    // Generate random token
    function(done) {
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },

    // Set the verification token
    function(token, done) {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      user
        .save()
        .then(function() {
          return done(null, token);
        })
        .catch(function(err) {
          return done(err);
        });
    },

    // Render path
    function(token, done) {
      res.render(path.resolve('./server/templates/email-verification'), {
        name: user.fullname,
        appName: config.app.title,
        url: req.protocol + '://' + req.headers.host + '/api/user/verify/' + token
      }, function(err, emailHTML) {
        done(err, emailHTML);
      });
    },

    // If valid email, send reset email using service
    function(emailHTML, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Verify your email address',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err);
      });
    }
  ], function(err) {
    callback(err);
  });
};

function signInUser(req, res, error, user){
  if (error) { return res.status(500).json({message: error}); }
  if (!user) { return res.status(401).json({message: 'Failed to sign in!'}); }

  sessionHelper.setCurrentUserId(req, res, user.id);

  res.status(200).json(user);
}

router.get('/', function(req, res){
  var userId = sessionHelper.currentUserId(req, res);
  if(userId) {
    models.user.findAll()
    .then(function(allUsers) {
      res.status(200).json(allUsers);
    });
  } else {
    res.status(403).json({ errors: { user: ["must_be_signed_in"] } });
  }
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(error, user) {
    signInUser(req, res, error, user);
  })(req, res, next);
});

router.post('/signup', function(req, res, next) {
  models.user.create({
    fullname: req.body.fullname,
    email: req.body.email,
    is_verified: false,
    password: req.body.password,
    resetPasswordToken: null,
    resetPasswordExpires: null
  })
  .then(function(user) {
    // currently scaffold doesn't ask for email config
    // sendVerificationEmail(user, req, res, function(err) {
    //   if (err) {
    //     console.error('Failed to send verification email.', err);
    //     return res.status(400).send({
    //       message: 'Failed to send verification email.'
    //     });
    //   } else {
    //     res.send({
    //       message: 'Verification email has been sent to the provided email with further instructions.'
    //     });
    //   }
    // });
      res.send({
          message: 'Signup Successful! You can login with your credentials now.'
        });
  })
  .catch(function(err) {
    console.error('Failed to create a new user');
    return res.status(400).send(err.errors ? err.errors : err);
  });
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  sessionHelper.clearCurrentUserId(req, res);
  res.status(200).end();
});

router.get('/current', function(req, res) {
  var userId = sessionHelper.currentUserId(req, res);
  if(userId){
    res.status(200).json({"userId": userId});
  } else {
    res.status(403).json({"userId": userId});
  }
});

router.get('/verify/:token', function(req, res) {
  models.user
    .findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: moment().format()
        }
      }
    })
    .then(function(user) {
      if (!user) {
        return res.redirect('/login?err=' + encodeURIComponent('Could not verify the email.'));
      }

      user.is_verified = true;

      // And save the user
      user
        .save()
        .then(function() {
          res.redirect('/login?msg=' + encodeURIComponent('Thanks for verifying your email!'));
        })
        .catch(function(err) {
          res.redirect('/login?err=' + encodeURIComponent('Failed to verify the email address.'));
        });
    })
    .catch(function(err) {
      return res.status(400).send(err.errors ? err.errors : err);
    });
});

module.exports = router;
