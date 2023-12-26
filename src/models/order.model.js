const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    status: { type: String, default: "pending" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    countNum: {
      type: Number,
    },
    codeOrder: {
      type: String,
    },
    randomNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);
