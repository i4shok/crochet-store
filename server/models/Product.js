const mongoose =
  require("mongoose");

const productSchema =
  new mongoose.Schema({

    name: {
      type: String,
      required: true,
    },

    category: String,

    price: Number,

    stock: {
  type: Number,
  default: 0,
},

    rating: {
      type: Number,
      default: 0,
    },

    description: String,

    image: String,

  });

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );