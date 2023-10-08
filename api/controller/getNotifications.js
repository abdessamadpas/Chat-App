const User = require("../models/User");

const getNotifications = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({userId});
        console.log(user.notifications);
        res.json({notifications: user.notifications});
    } catch (error) {
        res.json({error});
    }
}

module.exports = getNotifications;