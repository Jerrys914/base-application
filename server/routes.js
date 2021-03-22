const path = require('path');
const express = require('express');

module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    app.use(express.static(path.join(__dirname, '/../client')));
    res.sendFile(path.join(__dirname, '/../client/index.html'));
  });
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/api/login');
};
