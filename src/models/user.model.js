const mongoose = require("mongoose");
const validator = require('validator');
const UserSchema = mongoose.Schema(
  {
    //name viết ngắn gọn cho họ và tên
    name: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    
    idRef: {
      type: String,
    },
    idUser:{
      type: String,
    },
    address: {
      type: String,
      default: null
    },

    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 6,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Mật khẩu phải chứa ít nhất một chữ cái và một số');
        }
      },
      private: true, //
    },
    avatar: {
      type: Array,
      required: false,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isStaff:{
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
