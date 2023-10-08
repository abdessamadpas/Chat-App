const getUsers = require("./getUsers");
const getMessages = require("./getMessages");
const clearChat = require("./clearChat");
const saveMessageOnDB = require("./saveMessageOnDB");
const setNotifications = require("./setNotification");
const getNotifications = require("./getNotifications");
const deleteNotification = require("./deleteNotification");

module.exports = {
    getUsers,
    getMessages,
    clearChat,
    saveMessageOnDB,
    setNotifications,
    getNotifications,
    deleteNotification
}