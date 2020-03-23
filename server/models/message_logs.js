const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageLogsSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    username: String,
    message: String,
    room: String
});

module.exports = new mongoose.model("messagelogs", messageLogsSchema);