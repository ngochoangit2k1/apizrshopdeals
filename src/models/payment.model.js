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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    look:{
      type: String,
      default: "none",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", PaymentSchema);
