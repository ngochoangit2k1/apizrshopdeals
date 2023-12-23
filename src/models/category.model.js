const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
  nameCategory: {
    type: String,
  },
  slugCategory: {
    type: String,
  },
},
  { timestamps: true }
);


module.exports = mongoose.model('category', ContactSchema);
