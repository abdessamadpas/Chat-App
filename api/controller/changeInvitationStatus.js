const User = require("../models/User");

const changeInvitationStatus = async (userId, friendId, status) => {
  const sender = await User.findById(userId);
  const receiver = await User.findById(friendId);
  const existingInvitation = sender.invitations.find(
    (invitation) => invitation.sender.toString() === userId
  );

  if (!existingInvitation) {
    return { error: "there is no invitation to this user" };
  }

  if (!sender) {
    return res.status(400).json({ message: "sender not existed 🩹"});
  }

  if (!receiver) {
    return res.status(400).json({ message: "ur friend not existed 🍳"});
  }

  existingInvitation.type = status;
    await sender.save();
    return { success: " invitation change status " };
};

const getInvitation = async (req, res)=>{

    const userId = req.params.userId;
    if(!userId){
        return res.status(400).json({ message: " user id is required " });
    }
    const user = await User.findById(userId);
    console.log(userId);
if(!user){
    return res.status(400).json({ message: " user not found " });
}

     const invitations = user.invitations;
    if(invitations.length === 0){
        return res.status(400).json({ message: "there is no invitation to this user" });
    }
    return res.status(200).json({ invitations: invitations });
}


module.exports = {changeInvitationStatus, getInvitation};