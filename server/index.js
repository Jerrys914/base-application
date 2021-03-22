require('dotenv').config();
// require('./db/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const schedule = require('node-schedule');
const { checkForOrders } = require('./utils');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(
  session({
    secret: 'someSecret',
    resave: true,
    saveUninitialized: true
  })
);
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// require('./passport/config.js')(passport);
require('./routes.js')(app, passport);

// const rule = new schedule.RecurrenceRule();
// rule.hour = 18;

// const emailJob = schedule.scheduleJob(rule, checkForOrders);

let port = process.env.PORT || 4000;
app.listen(port, err => {
  console.log('Listening on port ' + port);
});
module.exports = app;
