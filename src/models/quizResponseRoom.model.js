const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');


const quizResponseRoomSchema = mongoose.Schema({
    taskId:   { type: mongoose.SchemaTypes.ObjectId, ref: 'Task' },
    internId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Intern' },
    score:    { type: Number, default: 0 },
    internResponse:{ type: Boolean, default: false },
    mentorResponse:{ type: Boolean, default: false },
    responses: [{
        senderId: { type: mongoose.SchemaTypes.ObjectId },
        replayTo: { type: mongoose.SchemaTypes.ObjectId },
        text:  String,
        audio: Object,
        pdf:   Object,
        date:  Date
    }]
});


const QuizResponseRoom = mongoose.model("QuizResponseRoom", quizResponseRoomSchema);

module.exports = QuizResponseRoom;