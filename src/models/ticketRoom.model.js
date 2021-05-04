const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');


const ticketRoomSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Task'
    },
    internId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Intern"
    },
    internResponse:{ type: Boolean, default: false },
    mentorResponse:{ type: Boolean, default: false },
    tickets: [{
        senderId: { type: mongoose.SchemaTypes.ObjectId },
        replayTo: { type: mongoose.SchemaTypes.ObjectId },
        text:  String,
        audio: Object,
        date:  Date
    }]
});


const TicketRoom = mongoose.model('TicketRoom', ticketRoomSchema);

module.exports = TicketRoom;
