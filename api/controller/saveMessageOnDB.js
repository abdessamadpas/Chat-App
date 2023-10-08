const Message = require("../models/Message");
const User = require("../models/User");

const saveMessageOnDB = async newMessage => {
    const newSavedMessage = new Message(newMessage);
    await newSavedMessage.save();
    await User.updateMany(
        { userId: { $in: [newMessage.sender, newMessage.receiver] } },
        { $push: { messages: { id: newSavedMessage._id, chatId: newMessage.chatId } } });
}

module.exports = saveMessageOnDB;