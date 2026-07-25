const mongoose = require("mongoose");

const giveawaySchema = new mongoose.Schema({
  product: {
    name: { type: String, required: true },
    description: String,
    image: String,
    isExisting: { type: Boolean, default: false },
    existingProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },

  weekStart: { type: Date, default: Date.now },

  // Sunday 00:00:00 following weekStart — the draw deadline
  weekEnd: { type: Date, required: true },

  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Giveaway", giveawaySchema);
