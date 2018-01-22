require('dotenv').config()
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var pool = require('../modules/pool.js');
var FacebookStrategy = require('passport-facebook').Strategy


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('called deserializeUser - pg');

  pool.connect(function (err, client, release) {
    if(err) {
      console.log('connection err ', err);
      release();
      done(err);
    }

    var user = {};

    client.query("SELECT * FROM users WHERE id = $1", [id], function(err, result) {

      // Handle Errors
      if(err) {
        console.log('query err ', err);
        done(err);
        release();
      }

      user = result.rows[0];
      release();

      if(!user) {
          // user not found
          return done(null, false, {message: 'Incorrect credentials.'});
      } else {
        // user found
        console.log('User row ', user);
        done(null, user);
      }

    });
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username'
    }, function(req, username, password, done) {
	    pool.connect(function (err, client, release) {
	    	console.log('called local - pg');

        // assumes the username will be unique, thus returning 1 or 0 results
        client.query("SELECT * FROM users WHERE username = $1", [username],
          function(err, result) {
            var user = {};

            console.log('here');

            // Handle Errors
            if (err) {
              console.log('connection err ', err);
              done(null, user);
            }

            release();

            if(result.rows[0] != undefined) {
              user = result.rows[0];
              console.log('User obj', user);
              // Hash and compare
              if(encryptLib.comparePassword(password, user.password)) {
                // all good!
                console.log('passwords match');
                done(null, user);
              } else {
                console.log('password does not match');
                done(null, false, {message: 'Incorrect credentials.'});
              }
            } else {
              console.log('no user');
              done(null, false);
            }

          });
	    });
    }
));


passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_APP_URL
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate( {facebookId: profile.id}, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}
));

module.exports = passport;
