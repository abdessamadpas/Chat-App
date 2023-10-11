const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const auth = require('./routes/auth.js');

const {
    clearChat,
    getMessages,
    saveMessageOnDB,
    setNotifications,
    getNotifications,
    deleteNotification,
} = require("./controller/");

const  {getUsers}  = require("./controller/getUsers");
const {addFriend, getFriends} = require("./controller/inviteFriend");
const setInvitations = require("./controller/invitations.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());


  
dotenv.config();
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;


mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {console.log('server running')}).catch(err => { console.log(err)});
        

/* chat server */
const server = app.listen(PORT);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001', ],
    },
});

io.on('connection', socket => {
//! on work
    // const people = {};

    // socket.on('join', (name) => {
    // if (!people[name]) {
    //     people[name] = [];
    // }
    // people[name].push(socket.id);
    // console.log(`${name} has joined with socket ID: ${socket.id}`);
    // });

    socket.on('join-chat', data => {
        socket.join(data.chatId);
        io.emit('join-chat-req', data);
    });
    socket.on('join-req-accept', chatId => {
        socket.join(chatId);

    });
    socket.on('send-message', async newMessage => {
        socket.to(newMessage.chatId).emit('receive-message', newMessage);
        saveMessageOnDB(newMessage);
        setNotifications(newMessage.sender,newMessage.receiver );
    })
    socket.on('send-friend-request', async data => {
        const {senderId,receiverId} = data;
        const receiverSocketID = people[receiverId];
        setNotifications(senderId,receiverId)
        setInvitations(senderId,receiverId)
        socket.to(receiverSocketID).emit('receive-friend-request', data); 
    })       
    
    socket.on('disconnect', () => {
    });
}) 

// welcome message
app.get('/', (req, res) => {
    res.json('hello me');
});

// * routes auth
app.use('/auth', auth.signup); // todo done
app.use('/auth', auth.signIn); // todo done
app.use('/auth', auth.UpdateUser); // todo done
app.use('/auth', auth.DeleteUser);// todo done
app.use('/auth', auth.getAllUsers);// todo done
app.use('/auth', auth.getUserById);// todo done


// test 
app.get ('/setnotif', (req,res) => {
    const {senderId,receiverId} = req.body;
    setNotifications(senderId,receiverId)
    res.send('done')
})
app.get('/users', getUsers);

// * routes chat*

app.get('/friends/:userId', getFriends);
app.post('/addfriend/:sender/:receiver', addFriend);
app.get('/messages/:senderId/:receiverId', getMessages);
app.delete('/messages/:userId', clearChat);
app.get('/notifications/:id', getNotifications);
app.delete("/notifications", deleteNotification);

module.exports = app;