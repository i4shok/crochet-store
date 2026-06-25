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

const connectDB =
  require("./db");
const express = require(
  "express"
);

const cors = require(
  "cors"
);

const app = express();
const Product =
  require(
    "./models/Product"
  );
const multer =
  require("multer");

const path =
  require("path");

const storage =
  multer.diskStorage({

    destination:
      "./uploads",

    filename:
      (req, file, cb) => {

        cb(
          null,
          Date.now() +
          path.extname(
            file.originalname
          )
        );

      },
  });

const upload =
  multer({
    storage,
  });

const Review =
  require(
    "./models/Review"
  );

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    "uploads"
  )
);

app.get(
  "/",
  (req, res) => {
    res.send(
      "Crochet API Running"
    );
  }
);

const products = [
  {
    id: 1,
    name: "Crochet Teddy",
    category: "Toys",
    price: 499,
    rating: 4.8,
    description:
      "A handmade crochet teddy bear.",
    image:
      "https://via.placeholder.com/300",
  },

  {
    id: 2,
    name: "Crochet Sunflower",
    category: "Flowers",
    price: 299,
    rating: 4.6,
    description:
      "A beautiful crochet sunflower.",
    image:
      "https://via.placeholder.com/300",
  },

  {
    id: 3,
    name: "Crochet Keychain",
    category: "Keychains",
    price: 199,
    rating: 4.9,
    description:
      "Cute crochet keychain.",
    image:
      "https://via.placeholder.com/300",
  },
];

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

      const order =
        await Order.create({

          user:
            req.user.id,

          items:
            req.body.items,

          total:
            req.body.total,
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

app.put(
  "/orders/:id",
  async (req, res) => {
    try {

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          {
            new: true,
          }
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

      res.json({
        token,
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
  "/admin/stats",
  auth,
  admin,
  async (req, res) => {

    try {

      const totalUsers =
        await User.countDocuments();

      const totalOrders =
        await Order.countDocuments();

      const orders =
        await Order.find();

      const revenue =
        orders.reduce(
          (sum, order) =>
            sum +
            order.total,
          0
        );

      res.json({
        totalUsers,
        totalOrders,
        revenue,
      });

    } catch (error) {

      res.status(500).json({
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
    .populate("user","email")
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

          stock:
            req.body.stock,

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
  upload.single(
    "image"
  ),

  (req, res) => {

    res.json({
  imageUrl:
    `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
});

  }
);

app.post(
  "/reviews",
  async (req, res) => {

    try {

      const review =
        await Review.create(
          req.body
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
          product:
            req.params.productId,
        });

      res.json(reviews);

    } catch (error) {

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