const User = require("../models/User");

const deleteNotification = async (req, res) => {
  const sender = req.query.sender;
  const receiver = req.query.receiver;
  try {
    await User.updateOne(
      { _id: sender },
      { $pull: { notifications: { sender : receiver } } },
    ).then((res) => {
    });
    res.json({ deleteNotify: true });
  } catch (error) {
    res.json({ error });
  }
};

module.exports = deleteNotification;
