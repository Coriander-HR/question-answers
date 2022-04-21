
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new mongoose.Schema({
    _id: {
        type: String,
    },

    product_id: {
        type: Number,
        required: true,
    },

    question_body: {
        type: String,
        required: true,
    },
    
    question_date: {
        type: Number,
        default: () => Date.now(),
    },
    
    asker_name: {
        type: String,
        required: true,
    },

    asker_email: {
        type: String,
        required: true,
    },
    
    question_helpfulness : {
        type: Number,
        default: 0,
    },
    
    reported : {
        type: Boolean,
        default: false,
    },
    
    answers: [{ 
        type: String, ref: 'Answer',
    }],
});

module.exports = mongoose.model("Question", QuestionSchema);