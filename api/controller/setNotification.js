const User = require("../models/User");

const setNotifications = async (senderId, receiverId, type) => {
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) return false;
    if (senderId === receiverId) return false;
    // if (sender.friends.includes(receiverId)) return false;

    const isNotificationExist = await User.findOne({
      _id: receiverId,
      "notifications.sender": senderId,
      "notifications.type": type,
    });

    if (isNotificationExist) {
      await User.updateOne(
        {
          _id: receiverId,
          "notifications.sender": senderId,
          "notifications.type": type,
        },
        { $inc: { "notifications.$.count": 1 } }
      ).then((res) => {
        console.log("notification updated");
      });
    } else {
      await User.updateOne(
        { _id: receiverId },
        {
          $push: {
            notifications: {
              sender: senderId,
              count: 1,
              type: type,
            },
          },
        }
      ).then((res) => {
        console.log("notification added");
      });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = setNotifications;
