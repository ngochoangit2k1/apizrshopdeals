const mongoose = require("mongoose");

const PaymentAdminSchema = mongoose.Schema(
  {
    image: {
      type: Array,
      // required: false,
      default: [],
    },
    bankName: {
      type: String,
    },
    bankNumber: { type: Number },
    bankUsername: { type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment_admin", PaymentAdminSchema);
