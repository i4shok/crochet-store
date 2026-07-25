const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const Giveaway = require("../models/Giveaway");
const GiveawayEntry = require("../models/GiveawayEntry");
const GiveawayWinner = require("../models/GiveawayWinner");
const Product = require("../models/Product");

// Reads the token if present but never blocks the request — participation
// is open to guests too, we just tag the entry with a user id when we can.
function optionalAuth(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) return next();

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // ignore invalid/expired token for this route, treat as guest
  }

  next();
}

function nextSundayMidnight(from = new Date()) {
  const date = new Date(from);
  const day = date.getDay(); // 0 = Sunday
  const daysUntilSunday = day === 0 ? 7 : 7 - day;

  date.setDate(date.getDate() + daysUntilSunday);
  date.setHours(0, 0, 0, 0);

  return date;
}

// ---------- PUBLIC ----------

// current active giveaway
router.get("/giveaway/current", async (req, res) => {
  try {
    const giveaway = await Giveaway.findOne({ status: "active" }).sort({
      createdAt: -1,
    });

    res.json(giveaway || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// has this person (by token OR email) already entered the current giveaway?
router.get("/giveaway/my-status", optionalAuth, async (req, res) => {
  try {
    const giveaway = await Giveaway.findOne({ status: "active" }).sort({
      createdAt: -1,
    });

    if (!giveaway) return res.json({ hasEntered: false, giveaway: null });

    const filter = { giveaway: giveaway._id };

    if (req.user?.id) {
      filter.user = req.user.id;
    } else if (req.query.email) {
      filter.email = req.query.email.toLowerCase();
    } else {
      return res.json({ hasEntered: false, giveaway });
    }

    const entry = await GiveawayEntry.findOne(filter);

    res.json({ hasEntered: !!entry, giveaway });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// submit a participation
router.post("/giveaway/participate", optionalAuth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const giveaway = await Giveaway.findOne({ status: "active" }).sort({
      createdAt: -1,
    });

    if (!giveaway) {
      return res
        .status(400)
        .json({ message: "There's no active giveaway right now." });
    }

    const existing = await GiveawayEntry.findOne({
      giveaway: giveaway._id,
      email: email.toLowerCase(),
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You've already entered this week's giveaway." });
    }

    const entry = await GiveawayEntry.create({
      giveaway: giveaway._id,
      user: req.user?.id || undefined,
      name,
      email: email.toLowerCase(),
      phone,
      address,
    });

    res.status(201).json(entry);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You've already entered this week's giveaway." });
    }

    res.status(500).json({ message: error.message });
  }
});

// winners list, most recent first (scrollable panel on the frontend)
router.get("/giveaway/winners", async (req, res) => {
  try {
    const winners = await GiveawayWinner.find().sort({ announcedAt: -1 });

    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------- ADMIN ----------

// create the giveaway product for the current/upcoming week
router.post("/admin/giveaway", auth, admin, async (req, res) => {
  try {
    const { name, description, image, existingProductId } = req.body;

    let productData = { name, description, image, isExisting: false };

    if (existingProductId) {
      const product = await Product.findById(existingProductId);

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      productData = {
        name: product.name,
        description: product.description,
        image: product.image,
        isExisting: true,
        existingProductId: product._id,
      };
    }

    if (!productData.name || !productData.image) {
      return res
        .status(400)
        .json({ message: "A product name and image are required." });
    }

    // close out any still-active giveaway before starting a new one
    await Giveaway.updateMany({ status: "active" }, { status: "closed" });

    const weekStart = new Date();
    const weekEnd = nextSundayMidnight(weekStart);

    const giveaway = await Giveaway.create({
      product: productData,
      weekStart,
      weekEnd,
      status: "active",
    });

    res.status(201).json(giveaway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// entries for the current giveaway
router.get("/admin/giveaway/entries", auth, admin, async (req, res) => {
  try {
    const giveaway = await Giveaway.findOne({ status: "active" }).sort({
      createdAt: -1,
    });

    if (!giveaway) return res.json({ giveaway: null, entries: [] });

    const entries = await GiveawayEntry.find({
      giveaway: giveaway._id,
    }).sort({ createdAt: -1 });

    res.json({ giveaway, entries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// announce a winner for the current giveaway, then close it
router.post(
  "/admin/giveaway/announce-winner",
  auth,
  admin,
  async (req, res) => {
    try {
      const { name, comment } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Winner name is required." });
      }

      const giveaway = await Giveaway.findOne({ status: "active" }).sort({
        createdAt: -1,
      });

      if (!giveaway) {
        return res
          .status(400)
          .json({ message: "There's no active giveaway to close out." });
      }

      const winner = await GiveawayWinner.create({
        giveaway: giveaway._id,
        name,
        comment: comment || "",
        productName: giveaway.product.name,
        productImage: giveaway.product.image,
        weekStart: giveaway.weekStart,
        weekEnd: giveaway.weekEnd,
      });

      giveaway.status = "closed";
      await giveaway.save();

      res.status(201).json(winner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
