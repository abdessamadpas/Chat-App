const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    messages: {
      type: [
        {
          id: String,
          chatId: String,
        },
      ],
      default: [],
    },
    friends: {
      type: Array,
      default: [],
    },
    notifications: {
      type: [
        {
          sender: String,
          count: Number,
          type: {
            type: String,
            enum: ["message", "requestFriend"],
          },
        },
      ],
      default: [],
    },
    invitations: {
      type: [
        {
          sender: String,
          name : String,
          status : {
            type: String,
            enum: ["send", "receive",],
            default: "send",
          },
          type: {
            type: String,
            enum: ["accept", "reject", "pending"],
            default: "pending",
          },
          
          time : { type : Date, default: Date.now },
        },
      ],
      default: [],
    },
    blocks: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
module.exports = User;