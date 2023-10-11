const Message = require("../models/Message");
const User = require("../models/User");

const getMessages = async (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    // const chatId = re q.query.chatId;

    try {
        const user = await User.findById(senderId);
        const messagesIds = user.messages.map(message => message._id);
        // const messages = await Message.find({_id: {$in: messagesIds}, sender: receiverId, sender : senderId,  receiver: senderId, receiver:receiverId});
        const messages = await Message.find({_id: {$in: messagesIds}, $or: [{sender: receiverId, receiver: senderId},{sender : senderId,  receiver: receiverId}]});
        res.json(messages);
    } catch (error) {
        res.json({error: error.message});
    }
}

module.exports = getMessages;