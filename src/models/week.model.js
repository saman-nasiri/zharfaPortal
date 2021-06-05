const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const weekSchema = mongoose.Schema({
    title: String,
    tutorialCategory: String,
    duration: Number,
    score:     { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    description: String,
    order: Number,
    termId : [ { type: mongoose.SchemaTypes.ObjectId, ref: 'Term' } ],
});

// add plugin that converts mongoose to json
weekSchema.plugin(toJSON);
weekSchema.plugin(paginate);


const Week = mongoose.model('Week', weekSchema);

module.exports = Week;