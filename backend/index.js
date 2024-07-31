const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { log } = require("console");

app.use(express.json());
app.use(cors());

//Database Connection with MongoDB
const connectionString = "mongodb://127.0.0.1:27017/e-commerce";
mongoose.connect(connectionString);

//API Creation

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//Image Strate Engine

const storage = multer.diskStorage({
  destination: path.join(__dirname, "/upload/images"),
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//Creating Upload Endpoint for images

app.use("/images", express.static(path.join(__dirname, "upload/images")));

app.post("/upload", (req, res) => {
  upload.single("product")(req, res, (err) => {
    if (err) {
      // Handle Multer errors
      return res.status(400).json({ error: err.message });
    }
    // Multer upload successful, send response
    res.json({
      success: 1,
      image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
  });
});

//Schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1; // For the first product in the database, id will be 1.  For subsequent products, it will be incremented by 1 from the last product's id.  This ensures the id is always unique and in ascending order.  The default value for available is true.  If a product is not available, it can be set to false.  This will help in tracking the availability of products.  For example, a product with id 1 might be out of stock, and thus available would be set to false.  In this case, it would not be displayed in the frontend.  The user can still add this product to their cart, but it would not be available for purchase.  This design allows for easy management of products and their availability.  This design also allows for easy addition of new products to the database in the future without having to change the id of existing products.  This design also allows for easy updating of product details,
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved Successfully");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//Creating API For deleting a product

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Product deleted successfully");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on port " + port);
  } else {
    console.log("Error : " + error);
  }
});
