const User = require("../models/User");

const setNotifications = async (senderId, receiverId) => {
    try {
        const isNotificationExist = await User.findOne({ _id: receiverId, 'notifications.sender': senderId});
      
        if (isNotificationExist) {
            await User.updateOne(
                { 'notifications.sender': senderId }, 
                { $inc: { "notifications.$.count": 1 } })
        } else {
          await User.updateOne(
                { _id: receiverId }, // Replace with the actual filter condition
                { $push: { notifications: { sender: senderId, count: 1 } } }
              );  
        }
    } catch(error) {
        console.log(error);
        return false;
    }
}

module.exports = setNotifications;