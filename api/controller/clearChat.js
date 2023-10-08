const User = require("../models/User");

const clearChat = async (req, res) => {
    const userId = req.params.userId;
    const chatId = req.query.chatId;
    try {
        await User.updateOne({userId}, {$pull:{messages: {chatId}}});
        res.json({deleted: true});
    } catch (error) {
        res.json({error});
    }
}

module.exports = clearChat;