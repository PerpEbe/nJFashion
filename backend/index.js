const port = 4000;
const express = require("express");
const app = express();
// const mongoose = require("mongoose"); //using this we can use the mongo database
const jwt = require("jsonwebtoken"); //we can generate token and uverify the token
const multer = require("multer"); //we can create image storage system
const path = require("path");
const cors = require("cors"); //provide access to react project
const admin=require('firebase-admin');
const serviceAccount=require('./config/njfashion-d0819-firebase-adminsdk-hzii6-2be3ee19b1.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: '2be3ee19b163c331aefa879b7e4792f93ca4b418.appspot.com'
// });

// const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  imageRef,
} = require("firebase/storage");

app.use(express.json()); //pass whatever request in json format

// Specify multiple origins
const allowedOrigins = [
  'https://n-j-fashion-admin.vercel.app', 
  'https://n-j-fashion-frontend.vercel.app'  // Add other frontend origins here
];

app.use(cors({
  origin: function (origin, callback) {
    // If the origin is in the allowed list or it's undefined (e.g., for non-browser requests), allow it
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT'],  // Specify the allowed methods
}));

app.options("/removeproduct", (req, res) => {
  res.header("Access-Control-Allow-Methods", "DELETE", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  return res.sendStatus(200);
});

//Database Connection with MongoDB
// const connectionString =
//   "mongodb+srv://ewasilwa19:1e1jWtnpGVje0sJW@products.hhzkk.mongodb.net/?retryWrites=true&w=majority&appName=products";
// mongoose.connect(connectionString);

//API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
  res.setHeader("Access-Control-Allow-Origin", "https://n-j-fashion-backend.vercel.app"); // Replace with your frontend's origin
  res.json(data);
});

app.post("/upload", multer().single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${req.file.originalname}`); // Create a reference with image name

  try {
    const uploadTask = await uploadBytes(storageRef, req.file.buffer);
    const imageURL = await getDownloadURL(uploadTask.ref);

    res.json({
      success: 1,
      image: imageURL,
    });
  } catch (error) {
    console.log(error);
  }
});

//Schema for creating products

// const Product = mongoose.model("Product", {
//   id: {
//     type: Number,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   new_price: {
//     type: Number,
//     required: true,
//   },
//   old_price: {
//     type: Number,
//     required: true,
//   },

//   tag: {
//     type: String,
//     required: true,
//   },

//   description: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   available: {
//     type: Boolean,
//     default: true,
//   },
// });

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

  const productData = req.body;
  const imageURL = productData.image;

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    tag: req.body.tag,
    description: req.body.description,
  });
  console.log(product);
  await product.save();
  console.log("Saved Successfully");
  res.json({
    success: true,
    message: "Product added successfully",
    name: req.body.name,
  });
});

//Creating API For deleting a product
app.post("/removeproduct", async (req, res) => {
<<<<<<< HEAD
  
  
=======
  const { id,image_url } = req.body;

  // const imageURL = ref(storage, product.image_url);
  
  try {
    const storage = getStorage();

    // Get a reference to the image
    const storageRef = admin.storage().refFromURL(image_url);
    console.log(storageRef);

    // Delete the image
    await storageRef.delete();
    res.json({ message: "Image deleted successfully" });

>>>>>>> 922a5dc7200ed30ca717e91f69c07f2387d5e72c
    // Delete the product from the database
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // res.json({ success: true, name: product.name });
<<<<<<< HEAD
  
=======
  } catch (error) {
    console.log(error);
  }
>>>>>>> 922a5dc7200ed30ca717e91f69c07f2387d5e72c

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
// const Users = mongoose.model("Users", {
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//   },
//   password: {
//     type: String,
//   },
//   cartData: {
//     type: Object,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

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
  try {
    const userData = await Users.findOne({ _id: req.user.id });

    if (!userData) {
      return res.status(404).send("User not found"); // Handle user not found scenario
    }

    res.json(userData.cartData); // Send response only if user is found
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error"); // Handle unexpected errors
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on port " + port);
  } else {
    console.log("Error : " + error);
  }
});
