const Message = require("../models/Message");
const User = require("../models/User");

const saveMessageOnDB = async newMessage => {
    console.log("newMessage",newMessage);
    const newSavedMessage = new Message(newMessage);
    await newSavedMessage.save();
    await User.updateMany(
        { _id: { $in: [newMessage.sender, newMessage.receiver] } },
        { $push: { messages: { _id: newSavedMessage._id, chatId: newMessage.chatId } } });
}

module.exports = saveMessageOnDB;