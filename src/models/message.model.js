const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: {
      type: Boolean,
      default: false,
    },
    content: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);
