const express = require('express');
const app = express();
const qaRouter = require('../routes/qa/');
const testQuestion = require('./question/question')
const mongo = require('../database/mongo/index')
app.use('/qa',qaRouter);


testQuestion(app);



