var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const db = require('./db');
db.connect();

const expressApi = require('./api');

var EventLogger = new (require('./eventLogger'))(db);
const SocketEvents = require('./socketEvents');

const Client = require('./client');

// Start the servers
const port = process.env.PORT || 4000;
const api = new expressApi(server, app, port);
api.bindEndpoints();

// Use when deployed to heroku for the react app
app.use(express.static(path.join(__dirname, "build")));

var clientData = {};
// TODO: Move to the database
// manageable by admins or public?
var roomList = [
    { id: 1, name: 'General', icon: 'home' },
    { id: 2, name: 'Cooking', icon: 'restaurant' }
];

function getUsersInRoom(clientId, roomId) {
    var userList = [];
    for (var key in clientData)
    {
        const otherClient = clientData[key];
        if (otherClient.room.id == roomId || clientId == otherClient.id)
            userList.push(otherClient);
    }
    return userList;
}

io.on(SocketEvents.Connection, function (socket) {
    var client = new Client(io, socket, EventLogger);
    clientData[socket.id] = client;
    client.start(roomList[0], getUsersInRoom, () => {
        socket.on(SocketEvents.GetProfileRequest, function() {
            client.onGetProfile();
        });
    
        socket.on(SocketEvents.SetDisplayName, function (newName) {
            client.onSetDisplayName(newName);
        });
    
        socket.on(SocketEvents.GetRoomsRequest, function() {
            client.onGetRooms(roomList);
        });
    
        socket.on(SocketEvents.RoomChangeRequest, function(roomId) {
            var client = clientData[socket.id];
            var newRoom = roomList[roomId];
            var userList = getUsersInRoom(roomId);
            client.onChangeRoomRequest(newRoom, userList);
        });
        socket.on(SocketEvents.SendMessage, function(message) {
            var client = clientData[socket.id];
            client.onSendMessage(message);
        });
        socket.on(SocketEvents.Disconnect, function() {
            var client = clientData[socket.id];
            client.onDisconnected();
            delete clientData[socket.id];
        });
    });
});
