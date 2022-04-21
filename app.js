var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongo = require('./database/mongo/index.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const qaRouter = require('./routes/qa/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/qa', qaRouter);

module.exports = app;
