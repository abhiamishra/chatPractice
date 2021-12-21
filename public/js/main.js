const chatForm = document.getElementById('chat-form');

//Connect the socket to the frontend so that
//when we have a new connection, we can listen to it
const socket = io();

//whenever we get a 'message' event
socket.on('message', message => {
    console.log(message);
    outputMsg(message);
});

//Sending a message to server
chatForm.addEventListener('submit', e =>{
    e.preventDefault();

    //Getting message text
    const messageWritten = e.target.elements.msg.value;
    //console.log(messageWritten);

    //emitting the user message to server
    socket.emit('chatMessage', messageWritten);
});

//Function to output message to DOM
function outputMsg(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);

}