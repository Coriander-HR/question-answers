var express = require('express');
var router = express.Router();
const {getAll, getAnswers} = require('./controller');

/* GET home page. */
router.get('/', getAll);
router.get('/:question_id/answers', getAnswers);

module.exports = router;
