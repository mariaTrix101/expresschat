const SocketEvents = require('./socketEvents');

module.exports = class Client {
    constructor(io, socket, eventLogger) {
        this.id = '';
        this.io = io;
        this.socket = socket
        this.eventLogger = eventLogger;
        this.name = 'Person';
        this.room = {id: -1};
    }

    start(defaultRoom, getUsersInRoom, callbackfn) {
        // All connections have an id in mongodb that is associated with a 'CONNECTION' event
        // In order to properly log all requests about THIS client
        // We need to wait for mongodb to return the ID it generates so we can attach it to further events
        this.eventLogger.connection(this.address(), (data) => {
            this.id = data._id.toString();
            this.joinRoom(defaultRoom, getUsersInRoom(data.id, defaultRoom.id));
            callbackfn();
        });
    }

    address() { return this.socket.conn.remoteAddress; }
    profile() {
        return {
            id: this.id,
            displayName: this.name,
            currentRoom: this.room
        }
    }
    onGetProfile() {
        this.eventLogger.getProfile(this.id);
        this.socket.emit(SocketEvents.GetProfileResponse, this.profile());
    }
    onGetRooms(roomList) {
        this.eventLogger.getRooms(this.id);
        this.socket.emit(SocketEvents.GetRoomsResponse, roomList);
    }

    onSetDisplayName(name) {
        // Should probably include ip
        this.eventLogger.nameChange(this.id, this.name, name);
        this.name = name;

        this.io.to(this.room.name).emit(SocketEvents.UserDisplayNameChanged, this.profile());
    }

    onChangeRoomRequest(newRoom, userList) {
        this.eventLogger.roomChange(this.id, this, newRoom);
        this.leaveRoom();
        this.joinRoom(newRoom);
    }

    onSendMessage(message) {
        this.eventLogger.message(this.id, this.name, this.room, message, (data) => {
            this.io.to(this.room.name).emit(
                SocketEvents.RoomMessage,
                {
                    id: data.id.toString(),
                    user: this.profile(),
                    message: message
                }
            );
        });
    }

    onDisconnected() {
        this.eventLogger.disconnect(this.address());
        this.leaveRoom();
    }

    leaveRoom() {
        this.io.to(this.room.name).emit(SocketEvents.UserLeftRoom, this.profile());
        this.socket.leave(this.room.name);
        this.room = { id: 0, name: '', icon: '' };
    }

    joinRoom(room, userList) {
        var users = userList.map((user) => user.profile());
        this.room = room;
        this.socket.join(room.name);
        this.socket.emit(SocketEvents.RoomListData, {
            room: room,
            users: users
        });
        this.socket.to(room.name).broadcast.emit(SocketEvents.UserJoinedRoom, this.profile());
    }
};