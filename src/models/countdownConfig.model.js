const mongoose = require('mongoose');
const validator = require('validator');

const countdownConfigSchema = mongoose.Schema({
    countdown:{
        type: Number,
    }
},
  { timestamps: true }
);


module.exports = mongoose.model('countdown-config', countdownConfigSchema);
