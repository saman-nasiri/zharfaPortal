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
        ref: "Student"
    },
    tickets: [{
        senderId: mongoose.SchemaTypes.ObjectId,
        replayTo: mongoose.SchemaTypes.ObjectId,
        text: String,
        audio: Object,
        date: Date
    }]
});


const TicketRoom = mongoose.model('TicketRoom', ticketRoomSchema);

module.exports = TicketRoom;
