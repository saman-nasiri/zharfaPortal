const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const InternTermActionsSchema = mongoose.Schema({
    internId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Intern' },
    termId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Term' },
    rate: { type: Boolean, default: false },
    // viewCount:  { type: Boolean, default: false },
    // doneTaskDuration: { type: Number, default: 0 },
    progressBar: {
        min: { type: Number, min: 0 },
        max: { type: Number, min: 100 }
    }
});

// add plugin that converts mongoose to json
InternTermActionsSchema.plugin(toJSON);
InternTermActionsSchema.plugin(paginate);


const InternWeekAction = mongoose.model('InternTermActions', InternTermActionsSchema);

module.exports = InternWeekAction;
