const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const FashionSchema = mongoose.Schema(
  {
    fashionCode: {
      type: Number,
      default: 0,
    },
    randomNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
FashionSchema.plugin(autoIncrement.plugin, {
  model: "fashion",
  field: "fashionCode",
});
module.exports = mongoose.model("fashion", FashionSchema);
