const mongoose = require('mongoose');

const RandomSchema = mongoose.Schema({
  idRandom: {
    type: String,
  },
},
  { timestamps: true }
);


module.exports = mongoose.model('random', RandomSchema);
