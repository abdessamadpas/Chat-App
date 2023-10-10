const User = require("../models/User");

const clearChat = async (req, res) => {
    const userId = req.params.userId;
    const chatId = req.query.chatId;
    try {
        await User.updateOne({userId}, {$pull:{messages: {chatId}}});
        res.status(200).json({message: "chat cleared"});
    } catch (error) {
        res.json({error});
    }
}

module.exports = clearChat;