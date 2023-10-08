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
    deleteNotification
} = require("./controller/");
const  {addUser,getUsers}  = require("./controller/getUsers");

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
            (newMessage.sender,newMessage.receiver );
    })
    socket.on('disconnect', () => {
    });
})

// routes
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

// * routes chat

    


module.exports = app;