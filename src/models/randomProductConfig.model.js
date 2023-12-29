const mongoose = require('mongoose');

const productConfigSchema = mongoose.Schema({
    number: {
        type: String,
        default: '1'
      },
},
  { timestamps: true }
);


module.exports = mongoose.model('config-product', productConfigSchema);
