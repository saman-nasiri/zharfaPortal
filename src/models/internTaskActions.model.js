const mongoose = require('mongoose');
// const validator = valirequire('validator');
const { toJSON, paginate } = require('./plugins');


const internTaskActionSchema = mongoose.Schema({
    internId: mongoose.SchemaTypes.ObjectId,
    taskId: mongoose.SchemaTypes.ObjectId,
    done: { type: Boolean, default: false }
});


const InternTaskAction = mongoose.model('InternTaskAction', internTaskActionSchema);

module.exports = InternTaskAction;
