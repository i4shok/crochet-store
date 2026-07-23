const { v2: cloudinary } = require("cloudinary");

const {
  CloudinaryStorage,
} = require(
  "multer-storage-cloudinary"
);

const admin =
  require(
    "./middleware/admin"
  );
const auth = require(
  "./middleware/auth"
);
const jwt = require(
  "jsonwebtoken"
);
const bcrypt = require(
  "bcryptjs"
);

const User = require(
  "./models/User"
);
const Order = require(
  "./models/Order"
);
require("dotenv").config();

cloudinary.config({

  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,

});

const connectDB =
  require("./db");
const express = require(
  "express"
);

const cors = require(
  "cors"
);

const app = express();
app.set("trust proxy", 1);

const Product =
  require(
    "./models/Product"
  );
const multer =
  require("multer");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "crochet-store",
    resource_type: "image",
  }),
});

const upload =
  multer({
    storage,
  });

const Review =
  require(
    "./models/Review"
  );

const crypto = require("crypto");
const { sendResetCodeEmail } = require("./utils/mailer");

app.use(cors());

app.use(express.json());

app.get(
  "/",
  (req, res) => {
    res.send(
      "Crochet API Running"
    );
  }
);

app.get(
  "/products",
  async (req, res) => {

    try {

      const search =
        req.query.search || "";

      const products =
        await Product.find({

          name: {
            $regex:
              search,

            $options:
              "i",
          },

        });

      const productsWithRatings =
        await Promise.all(

          products.map(
            async (product) => {

              const reviews =
                await Review.find({
                  product:
                    product._id,
                });

              const averageRating =
                reviews.length > 0
                  ? reviews.reduce(
                    (
                      sum,
                      review
                    ) =>
                      sum +
                      review.rating,
                    0
                  ) /
                  reviews.length
                  : 0;

              return {
                ...product.toObject(),
                averageRating:
                  Number(
                    averageRating.toFixed(
                      1
                    )
                  ),

                reviewCount:
                  reviews.length,
              };
            }
          )
        );

      res.json(
        productsWithRatings
      );



    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);



app.get(
  "/products/:id",
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });
      }

      res.json(
        product
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.get(
  "/products/:id/related",
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });

      }

      const related =
        await Product.find({

          _id: {
            $ne:
              product._id,
          },

        }).limit(4);

      res.json(
        related
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.post(
  "/orders",
  auth,
  async (req, res) => {
    try {

      console.log(
        "ORDER RECEIVED:",
        req.body
      );

      for (
        const item of req.body.items
      ) {

        const product =
          await Product.findById(
            item._id
          );

        if (
          product.stock <
          item.quantity
        ) {

          return res
            .status(400)
            .json({
              message:
                `${product.name} is out of stock`,
            });

        }

      }

      for (const item of req.body.items) {

        await Product.findByIdAndUpdate(

          item._id,

          {
            $inc: {
              stock:
                -item.quantity,
            },
          }

        );

      }
      const mappedItems = req.body.items.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      console.log("MAPPED ITEMS:");
      console.dir(mappedItems, { depth: null });

      const order = await Order.create({
        user: req.user.id,
        items: mappedItems,
        total: req.body.total,
        deliveryAddress: req.body.deliveryAddress,
      });

      console.log(
        "ORDER SAVED:",
        order
      );

      res
        .status(201)
        .json(order);

    } catch (error) {

      console.error(error);

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  }
);

app.get(
  "/orders",
  auth,
  admin,
  async (req, res) => {
    try {

      const orders =
        await Order.find();

      res.json(orders);

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  }
);

app.delete(
  "/orders/:id",
  async (req, res) => {
    try {

      const order =
        await Order.findByIdAndDelete(
          req.params.id
        );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      res.json({
        message:
          "Order deleted",
      });

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  }
);

connectDB();
app.post(
  "/register",
  async (req, res) => {
    try {

      const {
        name,
        email,
        password,
      } = req.body;

      const existingUser =
        await User.findOne({
          email,
        });

      if (
        existingUser
      ) {
        return res
          .status(400)
          .json({
            message:
              "User already exists",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
        });

      res.status(201).json({
        message:
          "User registered",
      });

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  }
);

app.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(400)
          .json({
            message:
              "User not found",
          });
      }

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (
        !validPassword
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid password",
          });
      }

      const token =
        jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      console.log("LOGIN ROUTE UPDATED");
      console.log("Role:", user.role);

      res.json({

        token,

        role: user.role,

        userId: user._id,

      });

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  }
);

app.post(
  "/forgot-password",
  async (req, res) => {

    try {

      const { email } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "No account found with that email.",
          });
      }

      const code =
        crypto
          .randomInt(100000, 999999)
          .toString();

      user.resetPasswordCode =
        await bcrypt.hash(code, 10);

      user.resetPasswordExpires =
        Date.now() + 10 * 60 * 1000;

      await user.save();

      await sendResetCodeEmail(
        user.email,
        code
      );

      res.json({
        message:
          "Verification code sent to your email.",
      });

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });

    }

  }
);

app.post(
  "/verify-reset-code",
  async (req, res) => {

    try {

      const { email, code } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (

        !user ||
        !user.resetPasswordCode ||
        !user.resetPasswordExpires

      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid or expired code.",
          });

      }

      if (
        user.resetPasswordExpires < Date.now()
      ) {

        return res
          .status(400)
          .json({
            message:
              "Code has expired. Please request a new one.",
          });

      }

      const validCode =
        await bcrypt.compare(
          code,
          user.resetPasswordCode
        );

      if (!validCode) {

        return res
          .status(400)
          .json({
            message:
              "Incorrect verification code.",
          });

      }

      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      const resetToken =
        jwt.sign(
          {
            id: user._id,
            purpose: "reset",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "15m",
          }
        );

      res.json({
        resetToken,
        message:
          "Code verified successfully.",
      });

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });

    }

  }
);

app.post(
  "/reset-password",
  async (req, res) => {

    try {

      const { resetToken, password } = req.body;

      let decoded;

      try {

        decoded =
          jwt.verify(
            resetToken,
            process.env.JWT_SECRET
          );

      } catch {

        return res
          .status(400)
          .json({
            message:
              "Reset session expired. Please start over.",
          });

      }

      if (decoded.purpose !== "reset") {

        return res
          .status(400)
          .json({
            message:
              "Invalid reset token.",
          });

      }

      const user =
        await User.findById(
          decoded.id
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found.",
          });

      }

      user.password =
        await bcrypt.hash(
          password,
          10
        );

      await user.save();

      res.json({
        message:
          "Password reset successful.",
      });

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });

    }

  }
);

app.get(
  "/me",
  auth,
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      res.json(user);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.put(
  "/me",
  auth,
  async (req, res) => {

    try {

      const {

        name,

        email,

        phone,

      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }

      user.name =
        name;

      user.email =
        email;

      user.phone =
        phone;

      await user.save();

      res.json({

        message:
          "Profile updated successfully.",

        user,

      });

    }

    catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }
);

app.get(
  "/me/addresses",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(req.user.id);

      res.json(user.addresses);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

app.post(
  "/me/addresses",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(req.user.id);

      const newAddress = {

        label:
          req.body.label,

        fullName:
          req.body.fullName,

        phone:
          req.body.phone,

        addressLine:
          req.body.addressLine,

        city:
          req.body.city,

        state:
          req.body.state,

        postalCode:
          req.body.postalCode,

        isDefault:
          req.body.isDefault || false,

      };

      if (newAddress.isDefault) {

        user.addresses.forEach(address => {

          address.isDefault = false;

        });

      }

      user.addresses.push(
        newAddress
      );

      await user.save();

      res.status(201).json(
        user.addresses
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }
);

app.put(
  "/me/addresses/:id",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(req.user.id);

      const address =
        user.addresses.id(req.params.id);

      if (!address) {

        return res.status(404).json({

          message: "Address not found",

        });

      }

      address.label =
        req.body.label;

      address.fullName =
        req.body.fullName;

      address.phone =
        req.body.phone;

      address.addressLine =
        req.body.addressLine;

      address.city =
        req.body.city;

      address.state =
        req.body.state;

      address.postalCode =
        req.body.postalCode;

      if (req.body.isDefault) {

        user.addresses.forEach(a => {

          a.isDefault = false;

        });

        address.isDefault = true;

      }

      await user.save();

      res.json(user.addresses);

    } catch (error) {

      res.status(500).json({

        message: error.message,

      });

    }

  }
);

app.delete(
  "/me/addresses/:id",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(req.user.id);

      const address =
        user.addresses.id(req.params.id);

      if (!address) {

        return res.status(404).json({

          message: "Address not found",

        });

      }

      address.deleteOne();

      if (
        user.addresses.length > 0 &&
        !user.addresses.some(a => a.isDefault)
      ) {

        user.addresses[0].isDefault = true;

      }

      await user.save();

      res.json(user.addresses);

    } catch (error) {

      res.status(500).json({

        message: error.message,

      });

    }

  }
);

app.get(
  "/my-orders",
  auth,
  async (req, res) => {

    try {

      console.log(
        "Logged User:",
        req.user.id
      );

      const orders =
        await Order.find({
          user:
            req.user.id,
        }).populate(
          "items.product"
        );

      res.json(
        orders
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.get(
  "/orders/:id",
  auth,
  async (req, res) => {

    try {

      const order =
        await Order.findOne({

          _id: req.params.id,

          user: req.user.id,

        }).populate(
          "items.product"
        );

      if (!order) {

        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });

      }

      res.json(order);

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });

    }

  }
);

app.get(
  "/admin/orders",
  auth,
  admin,
  async (req, res) => {

    try {

      const orders =
        await Order.find()
          .populate("user", "email")
          .populate("items.product");

      res.json(
        orders
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.get(
  "/admin/stats",
  auth,
  admin,
  async (req, res) => {

    try {

      const totalProducts =
        await Product.countDocuments();

      const totalOrders =
        await Order.countDocuments();

      const pendingOrders =
        await Order.countDocuments({
          status:
            "Pending",
        });

      const orders =
        await Order.find();

      const totalRevenue =
        orders.reduce(
          (sum, order) =>
            sum + order.total,
          0
        );

      res.json({
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);

app.put(
  "/admin/orders/:id",
  auth,
  admin,
  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });

      }

      order.status =
        req.body.status;

      await order.save();

      res.json(order);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);

app.post(
  "/seed-products",
  async (req, res) => {

    await Product.insertMany([
      {
        name:
          "Crochet Teddy",

        category:
          "Toys",

        price: 499,

        rating: 4.8,

        description:
          "Handmade Teddy",

        image:
          "https://via.placeholder.com/300",
      },

      {
        name:
          "Crochet Sunflower",

        category:
          "Flowers",

        price: 299,

        rating: 4.6,

        description:
          "Beautiful Sunflower",

        image:
          "https://via.placeholder.com/300",
      },
    ]);

    res.json({
      message:
        "Products Added",
    });
  }
);



app.post(
  "/admin/products",
  auth,
  admin,
  async (req, res) => {

    try {

      const product =
        await Product.create({

          name:
            req.body.name,

          category:
            req.body.category,

          price:
            req.body.price,

          description:
            req.body.description,

          image:
            req.body.image,

          stock:
            req.body.stock,

        });

      res
        .status(201)
        .json(product);

    } catch (error) {

      res
        .status(500)
        .json({
          message:
            error.message,
        });

    }
  }
);

app.delete(
  "/admin/products/:id",
  auth,
  admin,
  async (req, res) => {

    try {

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Product Deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.put(
  "/admin/products/:id",
  auth,
  admin,
  async (req, res) => {

    try {

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.json(
        product
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.post(
  "/upload",
  auth,
  admin,
  upload.single("image"),
  async (req, res) => {

    res.json({
      imageUrl: req.file.path,
    });

  }
);

app.get(
  "/wishlist",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).populate("wishlist");

      res.json(
        user.wishlist
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);

app.get(
  "/cart",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).populate("cart.product");

      res.json(user.cart);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

app.post(
  "/cart",
  auth,
  async (req, res) => {

    try {

      const {
        productId,
        quantity = 1,
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      const existingItem =
        user.cart.find(
          item =>
            item.product.toString() === productId
        );

      if (existingItem) {

        existingItem.quantity += quantity;

      } else {

        user.cart.push({
          product: productId,
          quantity,
        });

      }

      await user.save();

      await user.populate("cart.product");

      res.json(user.cart);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

app.put(
  "/cart/:productId",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      const item =
        user.cart.find(
          item =>
            item.product.toString() ===
            req.params.productId
        );

      if (!item) {

        return res.status(404).json({
          message: "Item not found in cart",
        });

      }

      item.quantity =
        req.body.quantity;

      await user.save();

      await user.populate("cart.product");

      res.json(user.cart);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

app.delete(
  "/cart/:productId",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      user.cart =
        user.cart.filter(
          item =>
            item.product.toString() !==
            req.params.productId
        );

      await user.save();

      await user.populate("cart.product");

      res.json(user.cart);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

app.delete(
  "/cart",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      user.cart = [];

      await user.save();

      res.json({
        message: "Cart cleared",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

app.post(
  "/wishlist/:productId",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      const exists =
        user.wishlist.some(
          (id) =>
            id.toString() ===
            req.params.productId
        );

      if (!exists) {

        user.wishlist.push(
          req.params.productId
        );

        await user.save();

      }

      res.json(
        user.wishlist
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);

app.delete(
  "/wishlist/:productId",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      user.wishlist =
        user.wishlist.filter(
          (id) =>
            id.toString() !==
            req.params.productId
        );

      await user.save();

      res.json(
        user.wishlist
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  }
);

app.post(
  "/reviews",
  auth,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        );

      const purchased = await Order.findOne({

        user: req.user.id,

        "items.product": req.body.product,

      });

      const existingReview =
        await Review.findOne({

          user: req.user.id,

          product: req.body.product,

        });

      if (existingReview) {

        return res.status(400).json({

          message:

            "You have already reviewed this product.",

        });

      }

      if (!purchased) {

        return res.status(403).json({

          message:

            "You can only review products you've purchased.",

        });

      }

      const review =
        await Review.create({

          product:
            req.body.product,

          user:
            req.user.id,

          name:
            user.name,

          text:
            req.body.text,

          rating:
            req.body.rating,

        });

      const productReviews =
        await Review.find({

          product: req.body.product,

        });

      const average =

        productReviews.reduce(

          (sum, review) =>

            sum + review.rating,

          0

        )

        / productReviews.length;

      await Product.findByIdAndUpdate(

        req.body.product,

        {

          rating: average,

          reviewCount:

            productReviews.length,

        }

      );

      res.json(review);

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }
);

app.get(
  "/reviews/:productId",
  async (req, res) => {

    try {

      const reviews =
        await Review.find({

          product: req.params.productId,

        })
          .populate(

            "user",

            "_id name"

          );

      res.json(reviews);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  }
);

app.get(
  "/admin/best-selling",
  auth,
  admin,
  async (req, res) => {

    try {

      const bestSelling =
        await Order.aggregate([

          { $unwind: "$items" },

          {

            $group: {

              _id: "$items.product",

              sold: {

                $sum: "$items.quantity",

              },

            },

          },

          {

            $sort: {

              sold: -1,

            },

          },

          {

            $limit: 5,

          },

          {

            $lookup: {

              from: "products",

              localField: "_id",

              foreignField: "_id",

              as: "product",

            },

          },

          {

            $unwind: "$product",

          },

        ]);

      res.json(bestSelling);

    }

    catch (error) {

      res.status(500).json({

        message: error.message,

      });

    }

  }
);

app.put(
  "/reviews/:id",
  auth,
  async (req, res) => {

    try {

      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {

        return res
          .status(404)
          .json({

            message:
              "Review not found",

          });

      }

      if (

        review.user.toString() !==
        req.user.id

      ) {

        return res
          .status(403)
          .json({

            message:
              "You can only edit your own review.",

          });

      }

      review.text =
        req.body.text;

      review.rating =
        req.body.rating;

      await review.save();

      res.json(review);

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }
);

app.delete(
  "/reviews/:id",
  auth,
  async (req, res) => {

    try {

      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {

        return res.status(404).json({

          message:
            "Review not found",

        });

      }

      if (

        review.user.toString() !==
        req.user.id

      ) {

        return res.status(403).json({

          message:
            "You can only delete your own review.",

        });

      }

      await review.deleteOne();

      res.json({

        message:
          "Review deleted.",

      });

    }

    catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }
);

app.listen(
  5000,
  () => {
    console.log(
      "Server running on port 5000"
    );
  }
);