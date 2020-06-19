const chatform=document.getElementById('chat-form');
const chatmessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

const socket=io();
// get username and room from url
const{username,room}=Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// join chat room
socket.emit('joinroom',{username,room});

//get room and users
socket.on('roomusers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//message from server
socket.on('message',message=>{
    output(message);
    chatmessages.scrollTop=chatmessages.scrollHeight;
    
});

//message submit
chatform.addEventListener('submit',(e)=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;
    //emitting a msg to server
    socket.emit('chatmessage',msg);
    //clear message box
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

//output message to DOM
function output(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.user}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
function outputRoomName(room){
    roomName.innerText=room;
}
function outputUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}