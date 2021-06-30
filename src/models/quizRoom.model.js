const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');


const quizRoomSchema = mongoose.Schema({
    taskId:   { type: mongoose.SchemaTypes.ObjectId, ref: 'Task' },
    internId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Intern' },
    score:    { type: Number, default: 0 },
    testAnswer: { 
        type:String,
        enum: ['A', 'B', 'C', 'D']
    },
    discriptiveAnswer: String,
    internResponse:{ type: Boolean, default: false },
    mentorResponse:{ type: Boolean, default: false },
    mentorAnswer: {
        mentorId: { type: mongoose.SchemaTypes.ObjectId },
        mentorName: String,
        text: String,
        date:  Date
    }
    // chatContent: [{
    //     senderName: String,
    //     senderRole: String,
    //     senderId: { type: mongoose.SchemaTypes.ObjectId },
    //     replayTo: { type: mongoose.SchemaTypes.ObjectId },
    //     text:  String,
    //     audio: Object,
    //     pdf:   Object,
    //     date:  Date
    // }]
});

// add plugin that converts mongoose to json
quizRoomSchema.plugin(toJSON);
quizRoomSchema.plugin(paginate);


const QuizRoom = mongoose.model("QuizRoom", quizRoomSchema);

module.exports = QuizRoom;