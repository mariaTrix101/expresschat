
// Prepares object for new event log inserts
module.exports = class EventLogger {
    constructor(db) {
        this.db = db;
    }

    connection(ip, callbackfn) {
        this.db.addEvent('CONNECTION', {ip: ip}, callbackfn);
    }
    disconnect(connId) {
        this.db.addEvent('DISCONNECT', {conn: connId});
    }
    getProfile(connId) {
        this.db.addEvent('GET_PROFILE', {conn: connId});
    }
    getRooms(connId) {
        this.db.addEvent('GET_ROOMS', {conn: connId});
    }
    message(connId, sender, room, message, callbackfn) {
        this.db.addEvent('MESSAGE', {
            conn: connId,
            sender: sender,
            room: room.id,
            message: message
        }, callbackfn);
    }
    roomChange(connId, user, room) {
        this.db.addEvent('ROOM_SWITCH', {
            conn: connId,
            user: user.name,
            from: user.room,
            to: room
        });
    }
    nameChange(connId, from, to) {
        this.db.addEvent('NAME_CHANGE', {
            conn: connId,
            from: from,
            to: to
        });
    }
};