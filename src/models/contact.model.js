const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  content: {
    type: String,
  },
},
  { timestamps: true }
);


module.exports = mongoose.model('contact', ContactSchema);
