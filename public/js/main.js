const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get the username and room from URL
const{ username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


//Connect the socket to the frontend so that
//when we have a new connection, we can listen to it
const socket = io();

//Notifying the server and join chatroom
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomLabel(room);
    outputRoomUsers(users);
});

//whenever we get a 'message' event
socket.on('message', message => {
    console.log(message);
    outputMsg(message);

    //Scroll downwards everytime we get a message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Sending a message to server
chatForm.addEventListener('submit', e =>{
    e.preventDefault();

    //Getting message text
    const messageWritten = e.target.elements.msg.value;
    //console.log(messageWritten);

    //emitting the user message to server
    socket.emit('chatMessage', messageWritten);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Function to output message to DOM
function outputMsg(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.user}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);

}

// add room nom to DOM
function outputRoomLabel(room){
    roomName.innerText = room;
}

// add room users to DOM
function outputRoomUsers(room){
    userList.innerHTML = `

        ${users.map(user => `<li>${user.username}</li>`.join(''))}

    `;
}