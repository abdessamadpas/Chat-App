const Message = require("../models/Message");
const User = require("../models/User");

const getMessages = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findOne({userId});
        const messagesIds = user.messages.map(message => message.id);
        const messages = await Message.find({_id: {$in: messagesIds}});
        res.json(messages);
    } catch (error) {
        res.json({error});
    }
}

module.exports = getMessages;