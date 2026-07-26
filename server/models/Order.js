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
        isGiveaway: {
          type: Boolean,
          default: false,
        },

        giveawayName: String,

        giveawayImage: String,
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
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    cancelReason: {
      type: String,
      default: "",
    },

    isGiveaway: {
      type: Boolean,
      default: false,
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
