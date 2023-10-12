const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const auth = require("./routes/auth.js");

const {
  clearChat,
  getMessages,
  saveMessageOnDB,
  setNotifications,
  getNotifications,
  deleteNotification,
} = require("./controller/");

const { getUsers } = require("./controller/getUsers");
const { addFriend, getFriends } = require("./controller/inviteFriend");
const setInvitations = require("./controller/invitations.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

dotenv.config();
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("server running");
  })
  .catch((err) => {
    console.log(err);
  });

/* chat server */
const server = app.listen(PORT);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
});
const people = {};

io.on("connection", (socket) => {
  //! on work

  socket.on("join-user", (userId) => {
    people[userId] = socket.id;
    //* USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
    io.sockets.emit("online", userId);
  });
  const getUserById=(userId)=> {
    return people[userId] || null;
  }
  socket.on("join-chat", (data) => {
    socket.join(data.chatId);
    io.emit("join-chat-req", data);
  });
  socket.on("join-req-accept", (chatId) => {
    socket.join(chatId);
  });
  socket.on("send-message", async (newMessage) => {
    socket.to(newMessage.chatId).emit("receive-message", newMessage);
    saveMessageOnDB(newMessage);
    setNotifications(newMessage.sender, newMessage.receiver);
  });
  socket.on("send-friend-request", async (data) => {
    const { senderId, receiverId } = data;

    setNotifications(senderId, receiverId);
    setInvitations(senderId, receiverId);

    const receiverSocketID = getUserById(receiverId);
    if (receiverSocketID !== null) {
      console.log(
        `User ${receiverId} is online with socket ID: ${receiverSocketID}`,
      );
    } else {
      console.log(`User ${receiverId} is not found or offline.`);
    }
    socket.to(receiverSocketID).emit("receive-friend-request", data);
    });
  

  const getUserIdBySocketId=(socketId) =>{
    for (const userId in people) {
      if (people[userId] === socketId) {
        return userId;
      }
    }
    return null; 
  }  
  socket.on('disconnect', () => {
    const userId = getUserIdBySocketId(socket.id);
    if (userId) {
      delete people[userId];
      io.sockets.emit('offline', userId);
    }
    socket.disconnect(); // DISCONNECT SOCKET

  });
});

// welcome message
app.get("/", (req, res) => {
  res.json("hello me");
});

// * routes auth
app.use("/auth", auth.signup); // todo done
app.use("/auth", auth.signIn); // todo done
app.use("/auth", auth.UpdateUser); // todo done
app.use("/auth", auth.DeleteUser); // todo done
app.use("/auth", auth.getAllUsers); // todo done
app.use("/auth", auth.getUserById); // todo done

// test
app.get("/setnotif", (req, res) => {
  const { senderId, receiverId } = req.body;
  setNotifications(senderId, receiverId);
  res.send("done");
});
app.get("/users", getUsers);

// * routes chat
app.get("/friends/:userId", getFriends);
app.post("/addfriend/:sender/:receiver", addFriend);
app.get("/messages/:senderId/:receiverId", getMessages);
app.delete("/messages/:userId", clearChat);
app.get("/notifications/:id", getNotifications);
app.delete("/notifications", deleteNotification);

module.exports = app;
