const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose"); //using this we can use the mongo database
const jwt = require("jsonwebtoken"); //we can generate token and uverify the token
const multer = require("multer"); //we can create image storage system
const path = require("path");
const cors = require("cors"); //provide access to react project

app.use(express.json()); //pass whatever request in json format
app.use(cors()); //get access to react frontend and connecting it with the backend

//Database Connection with MongoDB
// const connectionString = "mongodb://127.0.0.1:27017/njFashion";
const connectionString = "mongodb+srv://ewasilwa19:ayBXWmeVoZBOsiop@cluster0.iqxrvqz.mongodb.net/nJFashion";
mongoose.connect(connectionString);

//API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//Image Storage Engine
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
      // image_url: `http://localhost:${port}/images/${req.file.filename}`,
      image_url: `n-j-fashion-backend.vercel.app/images/${req.file.filename}`,
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
  description:{
    type:String,
    required:true,
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

//Add product API
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
    description: req.body.description,
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

//Schema creating for User model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creating Endpoint for Registering a User
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

//Creating Endpoint for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email address" });
  }
});

//Creating endpoint for newscollection data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("News Collection Fetched");
  res.send(newcollection);
});

//Creating endoint for popular in women section
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});

//Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authethicate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate using a valid token" });
    }
  }
};

//creating endpoint for adding products in cart
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

//Creating endpoint to remove product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

//Creating endpoint to get cartdata
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on port " + port);
  } else {
    console.log("Error : " + error);
  }
});
