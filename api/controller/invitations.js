const User = require("../models/User");
const mongoose = require("mongoose");
const setInvitations = async (senderId, receiverId) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  const checkInvitation = await User.find({
    _id: receiver._id,
    invitations: senderId._id,
  });
  const idGenerated = new mongoose.Types.ObjectId();
  if (!sender) {
    return res.status(400).json({ message: "ur not existed 🩹" });
  }
  if (!receiver) {
    return res.status(400).json({ message: "ur friend not existed 🍳" });
  }
  if (checkInvitation.length > 0) {
    return res
      .status(400)
      .json({ message: "u already send the invitation  to this user😒" });
  }
  await User.updateOne(
    { _id: receiverId },
    {
      $push: {
        invitations: { id: idGenerated, sender: senderId, type: "pending" },
      },
    },
  )
    .then((res) => console.log("invitation sent successfully", res))
    .catch((err) => console.log(err));
  // res.status(201).json({message:'invitation sent successfully'});
};

module.exports = setInvitations;
