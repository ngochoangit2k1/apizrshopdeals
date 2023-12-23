const mongoose = require("mongoose");

const WalletSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    code: { type: String },
    bankName: {
      type: String,
    },
    bankNumber: {
      type: String,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wallet", WalletSchema);
