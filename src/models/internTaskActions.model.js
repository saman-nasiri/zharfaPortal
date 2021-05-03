const mongoose = require('mongoose');
// const validator = valirequire('validator');
const { toJSON, paginate } = require('./plugins');


const internTaskActionSchema = mongoose.Schema({
    internId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Intern' },
    taskId:   { type: mongoose.SchemaTypes.ObjectId, ref: 'Task' },
    done:     { type: Boolean, default: false }
});


const InternTaskAction = mongoose.model('InternTaskAction', internTaskActionSchema);

module.exports = InternTaskAction;
