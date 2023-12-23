const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    bankName: {
      type: String,
    },
    nameUserBank:{
      type: String,
    },
    accountNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", PaymentSchema);
