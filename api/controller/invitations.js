const User = require("../models/User");
const mongoose = require("mongoose");

const setInvitations = async (senderId, receiverId) => {
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender) {
      throw new Error("Sender is not a user 🍳");
    }
    if (!receiver) {
      throw new Error("Receiver is not a user 🍳");
    }

    const checkInvitationInReceiver = receiver.invitations.find(
      (invitation) => invitation.sender === senderId
    );
    const checkInvitationInSender = sender.invitations.find(
      (invitation) => invitation.sender === senderId
    );

    if (checkInvitationInReceiver || checkInvitationInSender) {
      throw new Error("You already sent an invitation to this user 🍳");
    }

    const idGenerated = new mongoose.Types.ObjectId();

    await User.updateOne(
      { _id: receiverId },
      {
        $push: {
          invitations: {
            id: idGenerated,
            sender: senderId,
            status: "receive",
            type: "pending",
            name: sender.username,
          },
        },
      }
    );

    await User.updateOne(
      { _id: senderId },
      {
        $push: {
          invitations: {
            id: idGenerated,
            sender: senderId,
            status: "send",
            type: "pending",
            name: sender.username,
          },
        },
      }
    );

    console.log("Invitation sent successfully");
  } catch (error) {
    console.error(error.message);
    // You can choose to return an error response or handle it according to your application's requirements.
  }
};

module.exports = setInvitations;
