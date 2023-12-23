const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
 productCode:{
  type: Number,
  default: 0,
 },
 randomNumber:{
  type: Number,
 }
},
{ timestamps: true }
);

module.exports = mongoose.model('product', ProductSchema);
