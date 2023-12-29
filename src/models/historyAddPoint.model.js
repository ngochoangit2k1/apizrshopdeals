const mongoose = require("mongoose");

const HistoryAddPointSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    idUser: {
      type: String,
    },
    nameUser: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    info: { type: String, default: "Nạp tiền",},
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("history-add-points", HistoryAddPointSchema);
