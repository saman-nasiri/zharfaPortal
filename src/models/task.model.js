const { string } = require('@hapi/joi');
const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const taskSchema = mongoose.Schema({
    title: String,
    order: Number,
    weekId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Week' },
    content: String,
    duration: Number,
    doneCount: { type: Number, default: 0 },
    // rate:  Number,
    // tickets: Array,
    course: {
        type: String,
        trim: true,
        default: null
    },
    images: [{
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String
    }],
    videos: [{
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String
    }],
    audios:[{
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String
    }],
    pdf: [{
        title: String,
        description: String,
        filename: String,
        mimetype: String,
        size: String
    }],
    quiz: [{
                description: String,
                alternatives: [{
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
    }],

});

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);


const Task = mongoose.model('Task', taskSchema);


module.exports = Task;