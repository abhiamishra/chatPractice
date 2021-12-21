const path = require('path');

//used by express under the hood
const http = require('http');
const express = require('express');

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder to public folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects; listens for some connection
io.on('connection', socket => {
    //console.log('New connection....');

    //emits to single user
    socket.emit('message', 'Welcome to ChatPractice!');

    //Broadcast messages when a user connects
    //this will emit to everyone except to the user
    socket.broadcast.emit('message', 'A user has joined the chat');

    //broadcast to everyone -> io.emit()

    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat');
    });

    //listen for client side emitting to server
    socket.on('chatMessage', messageWritten =>{
        io.emit('message', messageWritten);
    });
});

//port number to listen to server
const PORT = 3000 || process.env.PORT;

//listens to a server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

