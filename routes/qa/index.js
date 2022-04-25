var express = require('express');
var router = express.Router();
const questionRouter = require('./question/question');
const answerRouter = require('./answer/answer')

router.use('/questions', questionRouter);
router.use('/answers', answerRouter);

module.exports = router;