const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const FashionSchema = mongoose.Schema(
  {
    fashionCode: {
      type: Number,
      default: 0,
    },
    fashionPlus: {
      type: String,
      
    },
    randomNumber: {
      type: String,
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
