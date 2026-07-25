const mongoose = require("mongoose");

const giveawayEntrySchema = new mongoose.Schema({
  giveaway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Giveaway",
    required: true,
  },

  // present if the person was logged in when they entered
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

// one entry per email per giveaway week
giveawayEntrySchema.index({ giveaway: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("GiveawayEntry", giveawayEntrySchema);
