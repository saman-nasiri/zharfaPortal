const mongoose = require('mongoose');
// const validator = valirequire('validator');
const { toJSON, paginate } = require('./plugins');


const termSchema = mongoose.Schema({
    title: String,
    tutorialCategory: String,
    termCode: String,
    description: String,
    startAt: Date,
    duration: Number,
    weeksList:   [ { type: mongoose.SchemaTypes.ObjectId, ref: 'Week' } ]
});


const Term = mongoose.model('Term', termSchema);

module.exports = Term;
