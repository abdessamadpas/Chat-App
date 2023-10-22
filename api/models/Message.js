const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    chatId: String,
    sender: String,
    receiver: String,
    type: {
      type: String,
      enum: ["text", "audio", "file"],
      default: "text",
    },
    content: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
