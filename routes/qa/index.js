var express = require('express');
var router = express.Router();
const questionRouter = require('./question/question');

router.use('/questions', questionRouter);

module.exports = router;