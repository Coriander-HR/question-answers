
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IndexesSchema = new mongoose.Schema({
    _id: { 
        type:String,
    },
    questions : [{
        type: String, ref: 'Question',
    }]
});

module.exports = mongoose.model("Indexes", IndexesSchema)                                        