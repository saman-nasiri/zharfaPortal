const mongoose = require('mongoose');
// const validator = valirequire('validator');
const { toJSON, paginate } = require('./plugins');


const internWeekActionSchema = mongoose.Schema({
    internId: mongoose.SchemaTypes.ObjectId,
    weekId: mongoose.SchemaTypes.ObjectId,
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
