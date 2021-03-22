const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel.js');
const bcrypt = require('bcrypt-nodejs');
const { validateEmail } = require('../utils');

let LocalLogin = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    process.nextTick(() => {
      UserModel.findOne({ email }).exec((err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(
            null,
            false,
            req.flash('loginMessage', 'Wrong Email or Password')
          );
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(
            null,
            false,
            req.flash('loginMessage', 'Wrong Email or Password')
          );
        }
        return done(null, user);
      });
    });
  }
);

let LocalSignup = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    if (!validateEmail(email)) {
      return done(
        null,
        false,
        req.flash('signupMessage', 'Please enter a valid email')
      );
    }
    UserModel.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(
          null,
          false,
          req.flash('signupMessage', 'User Already Exists')
        );
      } else {
        let newUser = new UserModel();
        newUser.email = email;
        newUser.password = bcrypt.hashSync(password);

        newUser.save(err => {
          if (err) {
            console.error(err);
          }
          return done(null, newUser);
        });
      }
    });
  }
);

module.exports = passport => {
  passport.serializeUser((user, done) => {
    if (Array.isArray(user)) {
      const id = user[0];
      user = {
        id: id
      };
    }
    done(null, user);
  });
  passport.deserializeUser((id, done) => {
    UserModel.findOne({ _id: id }).then(data => {
      const user = {
        id: data.id,
        email: data.email,
        admin: data.admin
      };
      done(null, user);
    });
  });
  passport.use('local-login', LocalLogin);
  passport.use('local-signup', LocalSignup);
};
