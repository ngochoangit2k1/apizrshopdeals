const mongoose = require('mongoose');

const numberSchema = mongoose.Schema({
    number: {
        type: Number,
        default: 0
    },
},
  { timestamps: true }
);


module.exports = mongoose.model('number-count', numberSchema);
