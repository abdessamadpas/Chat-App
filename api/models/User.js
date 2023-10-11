const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    image : {
        type : String,
    },
    password:{
        type: String,
        require: true
    },
    messages: {
        type: [{
            id: String,
            chatId: String
        }],
        default: []
    },
    friends: {
        type: Array,
        default: []
    },
    notifications: {
        type: [{
            sender: String,
            count: Number,
            messages: Array,
        }],
        default: []
    },
    invitations: {
        type: [{
  
            sender: String
        }],
        default: []
    },    
    blocks: {
        type: Array,
        default: []
    }
},{timestamps: true});

const User = mongoose.model("User", UserSchema);

module.exports = User;