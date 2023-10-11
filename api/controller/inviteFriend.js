const User = require("../models/User");


const addFriend = async (req, res)=> {
    const userId = req.params.senderId;
    const friendId = req.params.receiverId;

    try{
        const user = User.findById(userId);
        const friend = User.findById(friendId);
        const checkFriend = await User.find({friends: friendId});

        if (!user ){
            return res.status(400).json({ message: 'ur not existed 🩹' });
        }
        if (!friend ){
            return res.status(400).json({ message: 'ur friend not existed 🍳' });
        };
        if (checkFriend.length > 0){
            return res.status(400).json({message: 'u already added this friend 😒'});
        }

        await User.updateOne({_id: userId}, {$push:{friends: friendId}});
        await User.updateOne({_id: friendId}, {$push:{friends: userId}});
        return res.status(201).json({message:'friend added successfully'});
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to invite user'});
    }    
}

const getFriends = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);
        const friends = await User.find({_id: {$in: user.friends}});
        res.json(friends);
    } catch (error) {
        res.json({ error : error.message });
    }
}

module.exports ={addFriend, getFriends}; 