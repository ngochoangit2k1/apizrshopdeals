
const mongoose = require('mongoose');

const factionConfigSchema = mongoose.Schema({
  number: {
    type: String,
    default: '1'
  },
},
  { timestamps: true }
);


module.exports = mongoose.model('config-faction', factionConfigSchema);
