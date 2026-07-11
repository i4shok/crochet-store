const mongoose =
  require("mongoose");

const reviewSchema =
  new mongoose.Schema({

    product: {
      user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    name: String,

    text: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },

    rating: {
      type: Number,
      required: true,
    },

  });

module.exports =
  mongoose.model(
    "Review",
    reviewSchema
  );