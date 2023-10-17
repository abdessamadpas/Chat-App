const User = require("../models/User");
const mongoose = require("mongoose");
const getNotifications = async (req, res) => {
  const userId = req.params.id;
  const type = req.params.type;
  try {

    const user = await User.findById(userId);
    if (!user) throw new Error("user not found");
    const notifications = user.notifications;
    if (type === "all") {
      res.json({ notifications: notifications });
      return;
    }
    if (type === "message") {
      const messages = notifications.filter((notification) => {
        return notification.type === "message";
      });
      res.json({ notifications: messages });
      return;
    }
    if (type === "requestFriend") {
      const requests = notifications.filter((notification) => {
        return notification.type === "requestFriend";
      });
      res.json({ notifications: requests });
      return;
    }
      
    

  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = getNotifications;
