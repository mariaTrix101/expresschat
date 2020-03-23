const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventDataSchema = new Schema({
    key: String,
    value: String
}, {strict: false});

const eventLogSchema = new Schema({
    eventname: String,
    occurredAt: {
        type: Date,
        default: Date.now
    },
    data: [eventDataSchema]
}, {strict: false});

module.exports = new mongoose.model('eventlogs', eventLogSchema);