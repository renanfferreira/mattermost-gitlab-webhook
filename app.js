if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var logger = require('morgan');
var express = require('express');
var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

module.exports = app;
