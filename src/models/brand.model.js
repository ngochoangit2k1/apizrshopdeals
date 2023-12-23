const mongoose = require('mongoose');

const BrandSchema = mongoose.Schema({
  nameBrand: {
    type: String,
  },
  slugBrand: {
    type: String,
  },
},
  { timestamps: true }
);


module.exports = mongoose.model('brand', BrandSchema);
