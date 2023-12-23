const mongoose = require('mongoose');

const ConfigTransitiontSchema = mongoose.Schema({
  money: {
    type: Number,
  },
  numberOder: {
    type: Number,
  },
},
  { timestamps: true }
);


module.exports = mongoose.model('config-transition', ConfigTransitiontSchema);
