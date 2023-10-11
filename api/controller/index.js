const getUsers = require("./getUsers");
const addUser = require("./getUsers");
const getMessages = require("./getMessages");
const clearChat = require("./clearChat");
const saveMessageOnDB = require("./saveMessageOnDB");
const setNotifications = require("./setNotification");
const getNotifications = require("./getNotifications");
const deleteNotification = require("./deleteNotification");
const addFriend = require("./inviteFriend");
const getFriends= require("./inviteFriend");



module.exports = {
    getUsers,
    addUser,
    addFriend,
    getFriends,
    getMessages,
    clearChat,
    saveMessageOnDB,
    setNotifications,
    getNotifications,
    deleteNotification
}