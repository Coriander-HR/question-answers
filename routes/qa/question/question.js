const express = require('express');
const router = express.Router();
const {getQuestions, getAnswers, addQuestion, addAnswer, updateQuestionHelpful, reportQuestion, updateAnswerHelpful} = require('./controller');
const {query} = require('../middleware/query')


router.get('/', query, getQuestions);
router.get('/:question_id/answers', query, getAnswers);

router.post('/', addQuestion);
router.post('/:question_id/answers', addAnswer);

router.put('/:question_id/helpful', updateQuestionHelpful);
router.put('/:question_id/report', reportQuestion);



module.exports = router;
