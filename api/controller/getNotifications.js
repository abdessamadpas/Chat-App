const User = require("../models/User");
const mongoose = require("mongoose");
const getNotifications = async (req, res) => {
    const userId = req.params.id;
    console.log("userId is",userId);
    try {
        // const user = await User.findOne({userId});
        // const user = await User.findOne({ _id : userId });
        const user = await User.findById(  userId );

        console.log("user is",user);
        if (!user) throw new Error("user not found" )
        res.json({notifications: user.notifications});
    } catch (error) {
        res.json({error : error.message});
    }
}

module.exports = getNotifications;