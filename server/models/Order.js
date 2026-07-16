const mongoose = require(
  "mongoose"
);

const orderSchema =
  new mongoose.Schema({
    user: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        product: {
          type:
            mongoose.Schema.Types.ObjectId,

          ref:
            "Product",
        },

        quantity:
          Number,
      },
    ],

    total: Number,

    status: {

      type: String,

      enum: [

        "Pending",

        "Processing",

        "Packed",

        "Shipped",

        "Delivered"

      ],

      default: "Pending",

    },

    createdAt: {
      type: Date,

      default: Date.now,
    },

    deliveryAddress: {

      label: String,

      fullName: String,

      phone: String,

      addressLine: String,

      city: String,

      state: String,

      postalCode: String,

    },

  });

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );