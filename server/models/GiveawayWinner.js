const mongoose = require("mongoose");

const giveawayWinnerSchema = new mongoose.Schema({
  giveaway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Giveaway",
  },

  name: { type: String, required: true },
  comment: { type: String, default: "" },

  productName: String,
  productImage: String,

  weekStart: Date,
  weekEnd: Date,

  announcedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GiveawayWinner", giveawayWinnerSchema);
