const User = require("../models/User");

const setFriend = async (userId, friendId) => {
  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(friendId);

    if (!sender) {
      return { error: "Sender does not exist" };
    }

    if (!receiver) {
      return { error: "Friend does not exist" };
    }

    // Check if there is an existing friend request from sender to receiver
    const existingInvitation = sender.invitations.find(
      (invitation) => invitation.sender.toString() === userId
    );

    if (!existingInvitation) {
      return { error: "there is no invitation to this user" };
    }

    // Update the sender and receiver's friend lists and invitations
    existingInvitation.type = "accept";
    sender.friends.push(friendId);
    receiver.friends.push(userId);

    await sender.save();
    await receiver.save();
    return { success: "Friend request sent and accepted" };
  } catch (error) {
    return { error: "An error occurred while processing the request" };
  }
};

module.exports = setFriend;
