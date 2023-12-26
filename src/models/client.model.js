const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const ClientSchema = mongoose.Schema({
 clientCode:{
  type: Number,
  default:0
 },
 clientCodePlus:{
    type: String,
},
 randomNumber:{
  type: String,
 }
},
{ timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
ClientSchema.plugin(autoIncrement.plugin, { model: 'Client', field: 'clientCode' });

module.exports = mongoose.model('client', ClientSchema);
