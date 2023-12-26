const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const ProductSchema = mongoose.Schema({
 productCode:{
  type: Number,
  default: 0,
 },
 randomNumber:{
  type: String,
 }
},
{ timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
ProductSchema.plugin(autoIncrement.plugin, { model: 'product', field: 'productCode' });
module.exports = mongoose.model('product', ProductSchema);
