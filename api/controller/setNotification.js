const User = require("../models/User");

const setNotifications = async (senderId, receiverId) => {
    try {
        const isNotificationExist = await User.findOne({ _id: receiverId, 'notifications.sender': senderId});
        console.log('senderId',senderId);
        console.log('receiverId',receiverId);
        console.log("check",isNotificationExist);
        if (isNotificationExist) {
            await User.updateOne(
                { 'notifications.sender': senderId }, 
                { $inc: { "notifications.$.count": 1 } })
        } else {
            console.log('else');
          const result =   await User.updateOne(
                { _id: receiverId }, // Replace with the actual filter condition
                { $push: { notifications: { sender: senderId, count: 1 } } }
              );  
            console.log(result);}
    } catch(error) {
        console.log(error);
        return false;
    }
}

module.exports = setNotifications;