const User = require("../models/User");

const deleteNotification = async (req, res) => {
  const sender = req.query.sender;
  const receiver = req.query.receiver;
  try {
    await User.updateOne(
      { userId: receiver },
      { $pull: { notifications: { sender } } },
    );
    res.json({ deleteNotify: true });
  } catch (error) {
    res.json({ error });
  }
};

module.exports = deleteNotification;
