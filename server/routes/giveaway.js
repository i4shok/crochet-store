const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const Giveaway = require("../models/Giveaway");
const GiveawayEntry = require("../models/GiveawayEntry");
const GiveawayWinner = require("../models/GiveawayWinner");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { sendGiveawayWinnerEmail } = require("../utils/mailer");
function optionalAuth(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) return next();

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
  }

  next();
}

function nextSundayMidnight(from = new Date()) {
  const date = new Date(from);
  const day = date.getDay(); 
  const daysUntilSunday = day === 0 ? 7 : 7 - day;

  date.setDate(date.getDate() + daysUntilSunday);
  date.setHours(0, 0, 0, 0);

  return date;
}
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

router.get("/giveaway/winners", async (req, res) => {
  try {
    const winners = await GiveawayWinner.find().sort({ announcedAt: -1 });

    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

router.post(
  "/admin/giveaway/announce-winner",
  auth,
  admin,
  async (req, res) => {
    try {
      const { entryId, comment } = req.body;

      if (!entryId) {
        return res
          .status(400)
          .json({ message: "Please select the winning entry." });
      }

      const giveaway = await Giveaway.findOne({ status: "active" }).sort({
        createdAt: -1,
      });

      if (!giveaway) {
        return res
          .status(400)
          .json({ message: "There's no active giveaway to close out." });
      }

      const entry = await GiveawayEntry.findOne({
        _id: entryId,
        giveaway: giveaway._id,
      });

      if (!entry) {
        return res
          .status(404)
          .json({ message: "That entry couldn't be found." });
      }

      const winner = await GiveawayWinner.create({
        giveaway: giveaway._id,
        name: entry.name,
        comment: comment || "",
        productName: giveaway.product.name,
        productImage: giveaway.product.image,
        weekStart: giveaway.weekStart,
        weekEnd: giveaway.weekEnd,
      });

      if (entry.user) {
        await Order.create({
          user: entry.user,
          items: [
            {
              product: giveaway.product.existingProductId || undefined,
              quantity: 1,
              isGiveaway: true,
              giveawayName: giveaway.product.name,
              giveawayImage: giveaway.product.image,
            },
          ],
          total: 0,
          status: "Processing",
          isGiveaway: true,
          deliveryAddress: {
            label: "Giveaway Prize",
            fullName: entry.name,
            phone: entry.phone,
            addressLine: entry.address,
          },
        });
      } else {
        try {
          await sendGiveawayWinnerEmail(entry.email, {
            name: entry.name,
            productName: giveaway.product.name,
            productImage: giveaway.product.image,
          });
        } catch (mailError) {
          console.log("Giveaway winner email failed:", mailError.message);
        }
      }

      giveaway.status = "closed";
      await giveaway.save();

      res.status(201).json(winner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
