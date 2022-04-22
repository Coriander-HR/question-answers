// const mongoose = require('mongoose');
// const Question = require('../../../database/mongo/models/Question');
// const Indexes = require('../../../database/mongo/models/Indexes');
const Answer = require('../../../database/mongo/models/Answer');


module.exports = {
    updateAnswerHelpful: async(req, res) => {
        try {
            const answer_id = req.params.answer_id
            const answer = await Answer.findByIdAndUpdate({_id: answer_id},{ "$inc": { "helpfulness": 1 } });
            if (!answer) {
                throw {
                    message:'Answer ID NOT FOUND',
                    code: 404
                };
            }
            res.status(204).json({
                message: 'Answer has been Updated'
            });
        }
        catch (error) {
            res.status(error.code || 500).json({error});
        }
    },

    reportAnswer: async(req, res) => {
        try {
            const answer_id = req.params.answer_id;
            const answer = await Answer.findByIdAndUpdate({_id: answer_id},{"reported": true });
            if (!answer) {
                throw {
                    message:'Answer ID NOT FOUND',
                    code: 404
                };
            }
            res.status(204).json({
                message: 'Answer has been Updated'
            });
        }
        catch (error) {
            res.status(error.code || 500).json({error});
        }
    }

}