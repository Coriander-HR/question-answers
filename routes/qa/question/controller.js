const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../../../database/mongo/models/Question');
const Indexes = require('../../../database/mongo/models/Indexes');
const Answer = require('../../../database/mongo/models/Answer');
module.exports = {
    getAll: async (req,res) => {
        try {
            const {product_id, count = 5, page = 1} = req.query;
            const questions = await Indexes.find({_id: product_id}).populate({
              path: 'questions',
              populate: [{
                  path: 'answers',
                  model: 'Answer'
                 }] 
           });
           const response = {
            product_id,
            results: [...questions[0].questions].filter(question => !question.reported).splice(0,count)
           };
           response.results = response.results.map(question => {
               const {_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported, answers} = question
               const obj = {
                question_id : _id, 
                question_body, 
                question_date, 
                asker_name, 
                asker_email, 
                question_helpfulness, 
                reported, 
                answers
               };
               const obj2 = {};
               answers.forEach(obj => {
                obj2[obj._id] = obj;
               });
               obj.answers = obj2;
               return obj;
           })
            res.status(200).json({
                response
            });
        }
        catch(error) {
            res.status(500).json({err});
        }

    },

    getAnswers: async (req,res) => {
        res.send(req.params.question_id)
    }

}