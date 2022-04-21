
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    
    body: {
        type:String,
        required: true,
    },
    
    date: {
        type: Number,
        default: () => Date.now(),
    },
    
    answerer_name: {
        type: String,
        required: true,
    },

    answerer_email: {
        type: String,
        required: true,
    },
    
    reported: {
        type: Boolean,
        default: false,
    },

    helpfulness: {
        type: Number,
        default: 0,
    },
    
    photos: [{
        type: String,
    }]
});

module.exports = mongoose.model("Answer", AnswerSchema);