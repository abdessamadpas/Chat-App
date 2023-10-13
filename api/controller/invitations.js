const User = require("../models/User");
const mongoose = require("mongoose");
const setInvitations = async ( senderId, receiverId) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  const checkInvitation = receiver.invitations.find(
    (invitation) => invitation.sender === senderId,
  )
  console.log("check invit : ", checkInvitation);
  const idGenerated = new mongoose.Types.ObjectId();
  if (!sender) {
    console.log("ur not a user 🍳");
  }
  if (!receiver) {
    console.log("this user is not a user 🍳");
  }
  if (checkInvitation) {
    console.log("you already sent an invitation to this user 🍳");
  }
  await User.updateOne(
    { _id: receiverId },
    {
      $push: {
        invitations: { id: idGenerated, sender: senderId, type: "pending", name :  sender.username},
      },
    },
  )
    .then((res) => console.log("invitation sent successfully", res))
    .catch((err) => console.log(err));
  // res.status(201).json({message:'invitation sent successfully'});
};



module.exports = setInvitations;
