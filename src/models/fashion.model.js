const mongoose = require('mongoose');

const FashionSchema = mongoose.Schema({
 fashionCode:{
  type: Number,
  default: 0,
 },
 randomNumber:{
  type: Number,
 }
},
{ timestamps: true }
);

module.exports = mongoose.model('fashion', FashionSchema);
