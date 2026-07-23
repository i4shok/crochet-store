const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema({

  name: String,

  email: String,

  category: {

    type: String,

    enum: ["Custom Order", "Shipping", "Return", "General Inquiry", "Other"],

    default: "General Inquiry",

  },

  message: String,

  status: {

    type: String,

    enum: ["New", "Reviewed", "Flagged"],

    default: "New",

  },

  createdAt: {

    type: Date,

    default: Date.now,

  },

});

module.exports = mongoose.model("ContactRequest", contactRequestSchema);