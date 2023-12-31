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
const setFriend = require("./controller/setFriend.js");
const {changeInvitationStatus, getInvitation} = require("./controller/changeInvitationStatus.js");
const User = require("./models/User.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

dotenv.config();
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("server running ");
  })
  .catch((err) => {
    console.log(err);
  });

/* chat server */
const server = app.listen(PORT);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
}
});
const people = {};

io.on("connection", (socket) => {
  //! on work
  socket.emit("me", socket.id);


  socket.on("join-user", (userId) => {
    people[userId] = socket.id;
    //* USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
    io.sockets.emit("online", people);
  });

  const getUserSocketId=(userId)=> {
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
    const receiverIdSocket = getUserSocketId(newMessage.receiver)
    socket.to(newMessage.chatId).emit("receive-message", newMessage);
    socket.to(receiverIdSocket).emit("receive-message-notif", newMessage);
    saveMessageOnDB(newMessage);
    setNotifications(newMessage.sender, newMessage.receiver, "message");
  });
  
  socket.on("send-friend-request", async (data) => {
    const { senderId, receiverId } = data;

    setNotifications(senderId, receiverId, "requestFriend");
    setInvitations(senderId, receiverId);

    const receiverSocketID = getUserSocketId(receiverId);
    const senderInfo  = await User.findById(senderId);

    socket.to(receiverSocketID).emit("receive-friend-request", 
      { name : senderInfo.username,
        senderId : senderId,
        status : "pending"
      });
    });
    

  socket.on("send-friend-request-status", async (data) => {
    const { userId, status,  friendId} = data;
    
    if (status === "accept") {
      // change the status of the invitation and add the user to the friends list
      setFriend(userId,friendId);
    }
    if (status === "reject") {
      // just change the status of the invitation
      changeInvitationStatus(userId, friendId, status);
    }
  });

  const getUserIdBySocketId=(socketId) =>{
    for (const userId in people) {
      if (people[userId] === socketId) {
        return userId;
      }
    }
    return null; 
  }  

  //todo call RTC sectionds
  socket.on("callUser", (data) => {
    console.log("call send to backend");
    const UserToCallSocketId = getUserSocketId(data.userToCall);
    socket.to(UserToCallSocketId).emit("callUser", data);
  });

  socket.on("answerCall", (data) => {
    console.log("answer call send to backend" , data.to);
    socket.to(data.to).emit("callAccepted", data.signal)
  });

  // ! get socket id by user id
  socket.on("getSocketId", (userId) => {
    const socketId = getUserSocketId(userId);
    socket.emit("socketId", socketId);
  });
  socket.on('disconnect', () => {
    const userId = getUserIdBySocketId(socket.id);
    if (userId) {
      delete people[userId];
      io.sockets.emit('offline', people);
    }
    socket.broadcast.emit("callEnded")
    socket.disconnect();

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

// *  chat routes 
app.get("/friends/:userId", getFriends);
app.post("/addfriend/:sender/:receiver", addFriend);
app.get("/messages/:senderId/:receiverId", getMessages);
app.delete("/messages/:userId", clearChat);
app.get("/notifications/:id/:type", getNotifications);
app.delete("/notifications", deleteNotification);
app.get("/invitations/:userId", getInvitation );

module.exports = app;
