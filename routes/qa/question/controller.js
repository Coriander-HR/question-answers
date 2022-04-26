
const Question = require('../../../database/mongo/models/Question');
const Indexes = require('../../../database/mongo/models/Indexes');
const Answer = require('../../../database/mongo/models/Answer');

module.exports = {
    getQuestions: async (req, res) => {
        try {
            let {product_id, count, page} = req.query;

            const questions = await Indexes.find({_id: product_id})
            .populate({
                path: 'questions',
                match: {
                    reported: false
                },
                options:{
                    skip: (page*count),
                    limit: count,
                    sort: { question_date: -1 }
                },
                populate: [{
                  path: 'answers',
                  model: 'Answer'
                }] 
           })
           .lean();

           const response = {
            product_id,
            results: questions[0].questions
           };
           response.results = response.results.map(question => {
                const {question_date, answers} = question;
                question.question_id = question._id
                question.question_date = new Date(question_date);

                const obj2 = {};
                answers.forEach(obj => {
                    obj.date = new Date(obj.date);
                    obj2[obj._id] = obj;
                });
                question.answers = obj2;
                return question;
           })
            res.status(200).json(response);
        }
        catch(error) {
            res.status(500).json(error);
        }

    },

    getAnswers: async (req, res) => {
        try {
            const question_id = req.params.question_id;
            let {count, page} = req.query;

            const answers = await Question.find({_id: question_id}).populate({
                path: 'answers',
                match: {reported: false},
                options:{
                    skip: (page*count),
                    limit: count,
                    sort: { date: -1 }
                },
            }).lean();

            const response = {
                question: question_id,
                page,
                count,
                results: answers[0].answers.map(answer => {
                    answer.date = new Date(answer.date)
                    return answer;
                })
            };
            res.status(200).json(response);
        }
        catch(error) {
            res.status(500).json({error});
        }
        
        
    },

    addQuestion: async (req, res) => {
        try {
            const {body, name, email, product_id} = req.body;
            const newQuestion = await Question({
                _id: new mongoose.Types.ObjectId().toHexString(),
                product_id,
                question_body: body,
                asker_name: name,
                asker_email: email,
            });
            await newQuestion.save();
            await Indexes.findByIdAndUpdate({_id: `${product_id}`},{ "$push": { "questions": newQuestion._id } });
            res.status(201).json({
                Message: 'Question has been created'
            });
        }
        catch(error) {
            console.log(error)
            res.status(500).json({error})
        }
    },

    addAnswer: async (req, res) => {
        try {
            const {body, name, email, photos} = req.body;
            const question_id = req.params.question_id;
            const _id = new mongoose.Types.ObjectId().toHexString();
            const newAnswer = await Answer({
                _id,
                body,
                answerer_name: name,
                answerer_email: email,
                photos
            });
            await Promise.all([newAnswer.save(), Question.findByIdAndUpdate({_id: question_id},{ "$push": { "answers": _id } })]);
            res.status(201).json({
                Message: 'Answer has been created'
            });
        }
        catch(error) {
            res.status(500).json({error});
        }
    },

    updateQuestionHelpful: async(req, res) => {
        try {
            const question_id = req.params.question_id;
            const question = await Question.findByIdAndUpdate({_id: question_id},{ "$inc": { "question_helpfulness": 1 } });
            if (!question) {
                throw {
                    message:'Question ID NOT FOUND',
                    code: 404
                };
            }
            res.status(204).json({
                message: 'Question has been Updated'
            });
        }
        catch (error) {
            res.status(error.code || 500).json({error});
        }
    },

    reportQuestion: async(req, res) => {
        try {
            const question_id = req.params.question_id;
            const question = await Question.findByIdAndUpdate({_id: question_id},{ "reported": true });
            if (!question) {
                throw {
                    message:'Question ID NOT FOUND',
                    code: 404
                };
            }
            res.status(204).json({
                message: 'Question has been Updated'
            });
        }
        catch (error) {
            res.status(error.code || 500).json({error});
        }
    },

}