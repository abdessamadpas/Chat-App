const User = require("../models/User");

const setFriend = async (userId, friendId) => {
 console.log("set frind function");
  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(friendId);
 
    if (!sender) {
      console.log("Sender does not exist");
      throw new Error("Sender does not exist");
    }

    if (!receiver) {
      console.log("Friend does not exist");
      throw new Error("Friend does not exist");
    }

    // Check if there is an existing friend request from sender to receiver

    const existingInvitation = sender.invitations.find(
      (invitation) => invitation.sender.toString() === userId
    );
      console.log("invitations", sender.invitations);
    if (!existingInvitation) {
      return { error: "there is no invitation to this user" };
    }

    // Update the sender and receiver's friend lists and invitations
    existingInvitation.type = "accept";
    sender.friends.push(friendId);
    receiver.friends.push(userId);

    await sender.save();
    await receiver.save();
    console.log("Friend request sent and accepted");
    return { success: "Friend request sent and accepted" };
  } catch (error) {
    return { error: "An error occurred while processing the request" };
  }
};

module.exports = setFriend;
