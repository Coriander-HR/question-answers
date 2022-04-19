const { type } = require("express/lib/response")

mongodb Question schema        

question_body: {
    type:String,
    required: true,
},

question_date: date: {
    type: String,
    default: () => Date.now(),
},

asker_name: {
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

answers: { 
    type: Schema.Types.ObjectId, 
    ref: 'Answers',
},


mongodb AnswerS schema
body: {
    type:String,
    required: true,
},

date: {
    type: String,
    default: () => Date.now(),
},

answerer_name: {
    type: String,
    required: true,
},

helpfulness: {
    type: Number,
    default: 0,
},

photos: [{
    type: String,
}]