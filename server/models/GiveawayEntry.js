const mongoose = require("mongoose");

const giveawayEntrySchema = new mongoose.Schema({
  giveaway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Giveaway",
    required: true,
  },

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

giveawayEntrySchema.index({ giveaway: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("GiveawayEntry", giveawayEntrySchema);
