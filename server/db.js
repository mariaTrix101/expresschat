
const mongoose = require('mongoose');

var eventLogs = require('./models/event_logs');
var messageLogs = require('./models/message_logs');


function log_db_result(err, data, callbackfn) {
    if (err) console.log(err);
    else {
        console.log(data);
        if (callbackfn !== undefined)
            callbackfn(data);
    }
}

module.exports = {
    connect: function() {
        const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expresschat';
        mongoose.connect(mongoDbUri, {useNewUrlParser: true});
    },

    addEvent: function(eventname, data, callbackfn) {
        eventLogs.create({
            eventtype: eventname,
            data: data
        }, (err, data) => {
            log_db_result(err, data, callbackfn);
        });
    },

    addMessage: function(client, message) {
        messageLogs.create({
            id: client.id,
            username: client.name,
            room: client.room,
            message: message
        }, log_db_result);
    }
}