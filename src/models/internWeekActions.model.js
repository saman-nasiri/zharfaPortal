const mongoose = require('mongoose');
// const validator = valirequire('validator');
const { toJSON, paginate } = require('./plugins');


const internWeekActionSchema = mongoose.Schema({
    internId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Intern' },
    weekId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Week' },
    score: { type: Boolean, default: false },
    viewCount:  { type: Boolean, default: false },
    doneTaskDuration: { type: Number, default: 0 },
    progressBar: {
        min: { type: Number, min: 0 },
        max: { type: Number, min: 100 }
    }
});


const InternWeekAction = mongoose.model('InternWeekAction', internWeekActionSchema);

module.exports = InternWeekAction;
