const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userjoin,getcurrentuser,userleave,getroomusers}=require('./utils/users');
const app=express();
const server=http.createServer(app);
const io=socketio(server);
app.use(express.static(path.join(__dirname,'public')));

const bot='Chat-bot'

//run when a client connects
io.on('connection',socket=>{
    socket.on('joinroom',({username,room})=>{

        const user=userjoin(socket.id,username,room);
        socket.join(user.room);
            // welcome current user 
        socket.emit('message',formatMessage(bot,'welcome to safe chat app')); 
            // broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',formatMessage(bot,`${user.username} has joined chat app`));
            //send user and room info
        io.to(user.room).emit('roomusers',{
            room:user.room,
            users:getroomusers(user.room)
        })
    });

    // listen for chat message
    socket.on('chatmessage',(msg)=>{
        const user=getcurrentuser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
        
    //runs when clinet disconnect
    socket.on('disconnect',()=>{
        const user=userleave(socket.id);
        if(user)
        {
            io.to(user.room).emit('message',formatMessage(bot,`${user.username} has left chat app`));
            io.to(user.room).emit('roomusers',{
                room:user.room,
                users:getroomusers(user.room)
            })

        }
    });
 });

const port=3000|| process.env.port;
server.listen(port,()=>console.log(`server  running on port 3000`));