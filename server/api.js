
function jsonResponse(res, data) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200)
       .json(data);
}

function formatDatabaseResponse(res, err, data) {
    if (err) {
        console.log(err);
        res.status(500)
            .end('Server error');
    }
    else
        jsonResponse(res, data);
}


module.exports = class ExpressApi {

    constructor(server, app, port) {
        server.listen(port)
        console.log('Listening on port ' + port.toString());
        this.app = app;
    }

    bindEndpoints() {
        // Get a list of all of the chat logs
        this.app.get('/api/history', function(req, res) {
            messageLogs.find(
                {},
                (err, data) => formatDatabaseResponse(res, err, data)
            );
        });

        // Get a list of the chat logs for a room
        this.app.get('/api/roomhistory', function(req, res) {
            messageLogs.find(
                {room: req.params.roomName},
                (err, data) => formatDatabaseResponse(res, err, data)
            );
        });

        this.app.get('/api/eventlog', function(req, res) {
            eventLogs.find(
                {},
                (err, data) => formatDatabaseResponse(res, err, data)
            )
        });
    }
}