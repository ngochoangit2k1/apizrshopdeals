const mongoose = require("mongoose");

const HistoryWalletSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    nameUser: {
      type: String,
    },
    bankName: { type: String },

    bankNumber: { type: String },
    regulations: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    codeOder: {
      type: String,
    },
    nfo: { type: String, default: "",},
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("history-wallet", HistoryWalletSchema);
