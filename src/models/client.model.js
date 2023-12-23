const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
 clientCode:{
  type: Number,
  default: 0,
 },
 randomNumber:{
  type: Number,
 }
},
{ timestamps: true }
);

module.exports = mongoose.model('client', ClientSchema);
