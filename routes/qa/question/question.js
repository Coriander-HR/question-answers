var express = require('express');
var router = express.Router();
const {getQuestions, getAnswers, addQuestion, addAnswer} = require('./controller');
const {query} = require('../middleware/query')


router.get('/', query, getQuestions);
router.get('/:question_id/answers', query, getAnswers);

router.post('/', addQuestion);
router.post('/:question_id/answers', addAnswer);

module.exports = router;
