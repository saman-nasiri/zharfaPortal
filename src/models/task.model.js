const { string } = require('@hapi/joi');
const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const taskSchema = mongoose.Schema({
    title: String,
    order: Number,
    weekId:  [ { type: mongoose.SchemaTypes.ObjectId, ref: 'Week' } ],
    termId : [ { type: mongoose.SchemaTypes.ObjectId, ref: 'Term' } ],
    content: Object,
    duration: Number,
    doneCount: { type: Number, default: 0 },
    haveTicket: {
        type: Boolean,
        default: false
    },
    course: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String
    },
    video: {
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String,
    },
    audio:{
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String
    },
    pdf: {
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String
    },
    testQuiz: {
        type: Boolean,
        default: false,
    },
    discriptiveQuiz:  {
        type: Boolean,
        default: false,
    },
    quiz: {
                description: Object,
                alternatives: [{
                    value: {
                        type: String,
                        required: true,
                        enum: ['A', 'B', 'C', 'D']
                    },
                    text: {
                        type: String,
                        required: true
                    },
                    isCorrect: {
                        type: Boolean,
                        required: true,
                        default: false
                    }
                }]
    },

});

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);


const Task = mongoose.model('Task', taskSchema);


module.exports = Task;