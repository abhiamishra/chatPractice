const path = require('path');

//used by express under the hood
const http = require('http');
const express = require('express');

const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const admin = 'Admin';
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const { Console } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder to public folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects; listens for some connection
io.on('connection', socket => {

    //Joining the room
    socket.on('joinRoom', ({ username, room}) => {

        const user =  userJoin(socket.id, username, room);

        socket.join(user.room);
        console.log(user.room);

        //emits to single user
        socket.emit('message', formatMessage(admin,'Welcome to ChatPractice!'));

        //Broadcast messages when a user connects
        //this will emit to everyone except to the user
        socket.broadcast.to(user.room).emit('message', formatMessage(admin, `A ${user.username} has joined the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //console.log('New connection....');
    //broadcast to everyone -> io.emit()

    //listen for client side emitting to server
    socket.on('chatMessage', messageWritten =>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, messageWritten));
    });

    
    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(admin,`A ${user.username} has left the chat`));

            //send users and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

//port number to listen to server
const PORT = 3000 || process.env.PORT;

//listens to a server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

