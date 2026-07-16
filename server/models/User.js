const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  password: String,

  phone: {

    type: String,

    default: "",

  },

  avatar: {

    type: String,

    default: "",

  },

  role: {
    type: String,
    default: "user",
  },

  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],

  addresses: [

    {

      label: {

        type: String,

        default: "Home",

      },

      fullName: String,

      phone: String,

      addressLine: String,

      city: String,

      state: String,

      postalCode: String,

      isDefault: {

        type: Boolean,

        default: false,

      },

    },

  ],

});

module.exports = mongoose.model(
  "User",
  userSchema
);