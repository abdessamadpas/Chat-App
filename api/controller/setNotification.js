const User = require("../models/User");

const setNotifications = async (senderId, receiverId, type) => {
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    
    const isNotificationExist = await User.findOne({
      _id: receiverId,
      "notifications.sender": senderId,
      "notifications.type": type,
    });

    if (isNotificationExist) {
      await User.updateOne(
        { "notifications.sender": senderId },
        { $inc: { "notifications.$.count": 1 } },
      );
    } else {
      await User.updateOne(
        { _id: receiverId }, // Replace with the actual filter condition
        { $push: { notifications: { sender: senderId, count: 1 ,type : type} } },
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = setNotifications;
