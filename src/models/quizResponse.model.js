const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');


const quizResponseSchema = mongoose.Schema({
    taskId:   { type: mongoose.SchemaTypes.ObjectId, ref: 'Task' },
    internId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Intern' },
    score:    { type: Number, default: 0 },
    responses: [{
        senderId: { type: mongoose.SchemaTypes.ObjectId },
        replayTo: { type: mongoose.SchemaTypes.ObjectId },
        text:  String,
        audio: Object,
        pdf:   Object,
        date:  Date
    }]
});


const QuizResponse = mongoose.model("QuizResponse", quizResponseSchema);

module.exports = QuizResponse;