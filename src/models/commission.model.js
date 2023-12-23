const mongoose = require("mongoose");

const CommissionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    moneyComissions: {
      type: Number,
      default: 0,
    },
    numberOder: {
      type: Number,
    },
    sumOder: {
      type: Number,
      default: 0,
    },
    frize: { type: Number, default: 0 },
    block: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("commission", CommissionSchema);
