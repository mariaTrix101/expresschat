# Socket.IO Requirements
* listen for when a new socket is created
* listen for when a new user is joins a room
* listen for clientinput (chat message or game position)
* listen for switching room
* listen for the userdisconnect

# Express Requirements
* GET: /api/history -> List of all chat history
* GET: /api/roomhistory -> List of chat in a room (parameter: roomName)
* GET: /api/eventlog -> Get a list of **ALL** events


# Specification Percentage
* 20% | Backend Server (Node.js)
* 20% | Valid working ExpressAPI endpoints
* 20% | Implementing Mongoose
* 30% | Implementing Socket.io on Client and Server
* 5% | Deployment and Hosting to Heroku
* 5% | Clean Code and Clarity