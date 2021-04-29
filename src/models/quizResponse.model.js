const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');


const quizResponseSchema = mongoose.Schema({
    taskId: mongoose.SchemaTypes.ObjectId,
    internId: mongoose.SchemaTypes.ObjectId,
    score: { type: Number, default: 0 },
    responses: [{
        senderId: mongoose.SchemaTypes.ObjectId,
        replayTo: mongoose.SchemaTypes.ObjectId,
        text: String,
        audio: Object,
        pdf: Object,
        date: Date
    }]
});


const QuizResponse = mongoose.model("QuizResponse", quizResponseSchema);

module.exports = QuizResponse;