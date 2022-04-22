const express = require('express');
const router = express.Router();
const {updateAnswerHelpful, reportAnswer} = require('./controller');

router.put('/:answer_id/helpful', updateAnswerHelpful);
router.put('/:answer_id/report', reportAnswer);

module.exports = router;