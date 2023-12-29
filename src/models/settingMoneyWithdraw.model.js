const mongoose = require('mongoose');

const moneyConfigSchema = mongoose.Schema({
    number: {
        type: String,
        default: '0'
    },
},
  { timestamps: true }
);


module.exports = mongoose.model('config-money', moneyConfigSchema);
