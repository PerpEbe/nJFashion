const port = 4000;
import express  from "express";
const app = express();
// import mongoose = require("mongoose"); //using this we can use the mongo database
import jwt from "jsonwebtoken"; //we can generate token and uverify the token
import multer from "multer"; //we can create image storage system
import path from "path";
import cors from "cors"; //provide access to react project
import admin from "firebase-admin";
// import serviceAccount from "./config/njfashion-d0819-firebase-adminsdk-hzii6-2be3ee19b1.json";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: '2be3ee19b163c331aefa879b7e4792f93ca4b418.appspot.com'
// });

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { collection,where,query,getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

app.use(express.json()); //pass whatever request in json format

// Specify multiple origins
const allowedOrigins = [
  "https://n-j-fashion-admin.vercel.app",
  "https://n-j-fashion-frontend.vercel.app", // Add other frontend origins here
];

app.use(
  cors({
    origin: "*",
  })
);

app.options("/removeproduct", (req, res) => {
  res.header("Access-Control-Allow-Methods", "DELETE", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  return res.sendStatus(200);
});

//Database Connection with MongoDB
const connectionString =
  "mongodb+srv://ewasilwa19:1e1jWtnpGVje0sJW@products.hhzkk.mongodb.net/?retryWrites=true&w=majority&appName=products";
mongoose.connect(connectionString);

//API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://n-j-fashion-frontend.vercel.app"
  ); // Replace with your frontend's origin
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
// app.post("/addproduct", async (req, res) => {
//   // let products = await Product.find({});
//   // let id;
//   // if (products.length > 0) {
//   //   let last_product_array = products.slice(-1);
//   //   let last_product = last_product_array[0];
//   //   id = last_product.id + 1;
//   // } else {
//   //   id = 1; // For the first product in the database, id will be 1.  For subsequent products, it will be incremented by 1 from the last product's id.  This ensures the id is always unique and in ascending order.  The default value for available is true.  If a product is not available, it can be set to false.  This will help in tracking the availability of products.  For example, a product with id 1 might be out of stock, and thus available would be set to false.  In this case, it would not be displayed in the frontend.  The user can still add this product to their cart, but it would not be available for purchase.  This design allows for easy management of products and their availability.  This design also allows for easy addition of new products to the database in the future without having to change the id of existing products.  This design also allows for easy updating of product details,
//   // }

//   const productData = req.body;
//   const imageURL = productData.image;

//   // const product = new Product({
//   //   id: id,
//   //   name: req.body.name,
//   //   image: req.body.image,
//   //   category: req.body.category,
//   //   new_price: req.body.new_price,
//   //   old_price: req.body.old_price,
//   //   tag: req.body.tag,
//   //   description: req.body.description,
//   // });
//   console.log(product);
//   await product.save();
//   console.log("Saved Successfully");
//   res.json({
//     success: true,
//     message: "Product added successfully",
//     name: req.body.name,
//   });
// });

//Creating API For deleting a product
// app.post("/removeproduct", async (req, res) => {
//   // Delete the product from the database

//   // res.json({ success: true, name: product.name });

//   console.log("Product deleted successfully");
//   res.json({
//     success: true,
//     name: req.body.name,
//   });
// });

//Creating API for getting all products
// app.get("/allproducts", async (req, res) => {
// let products = await Product.find({});
// console.log("All Products Fetched");
// res.send(products);
// });

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
app.post("/signup", async (req,res)=>{
  try {
    const userSnapshot=await usersRef.where("email", "==", req.body.email).get();
    if(!userSnapshot.empty){
      return res.status(400).json({
        success: false,
        errors: "existing user found with same email address",
      });
    }

    let cart={}
    for(let i=0; i<300; i++){
      cart[i]=0;
    }

    const userData={
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    }
    const userDocRef=await usersRef.add(userData)

    const data={user:{id:userDocRef.id}}
    const token=jwt.sign(data, "secret_ecom")
    res.json({success: true, token})
  } catch (error) {
    res.status(500).json({success: false, errors: "Error registering user"})
  }
})

//Creating Endpoint for user login
app.post("/login", async (req, res) => {
  try {
    const userSnapshot = await usersRef.where("email", "==", req.body.email).get();
    if (userSnapshot.empty) {
      return res.json({ success: false, errors: "Wrong Email address" });
    }

    let user;
    userSnapshot.forEach((doc) => {
      user = doc.data();
      user.id = doc.id; // Include document ID as user ID
    });

    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: "Error logging in user" });
  }
});


// app.post("/signup", async (req, res) => {
//   let check = await Users.findOne({ email: req.body.email });
//   if (check) {
//     return res.status(400).json({
//       success: false,
//       errors: "existing user found with same email address",
//     });
//   }
//   let cart = {};
//   for (let i = 0; i < 300; i++) {
//     cart[i] = 0;
//   }
//   const user = new Users({
//     name: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     cartData: cart,
//   });
//   await user.save();

//   const data = {
//     user: {
//       id: user.id,
//     },
//   };
//   const token = jwt.sign(data, "secret_ecom");
//   res.json({ success: true, token });
// });

//Creating Endpoint for user login
// app.post("/login", async (req, res) => {
//   let user = await Users.findOne({ email: req.body.email });
//   if (user) {
//     const passCompare = req.body.password === user.password;
//     if (passCompare) {
//       const data = {
//         user: {
//           id: user.id,
//         },
//       };
//       const token = jwt.sign(data, "secret_ecom");
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, errors: "Wrong password" });
//     }
//   } else {
//     res.json({ success: false, errors: "Wrong Email address" });
//   }
// });

//Creating endpoint for newscollection data
// app.get("/newcollections", async (req, res) => {
//   // let products = await Product.find({});
//   // let newcollection = products.slice(1).slice(-8);
//   console.log("News Collection Fetched");
//   // res.send(newcollection);
// });

//Creating endoint for popular in women section
app.get("/popularinwomen", async (req, res) => {
    const productsRef = collection(db, "Products"); // Reference to the "Products" collection
    const q = query(productsRef, where("category", "==", "women")); // Query to get documents where category is "women"

    try {
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get the top 4 products
      const data = products.slice(0, 4);

      // console.log("Popular in women fetched");
      res.send(data);
    } catch (error) {
      console.error("Error fetching popular in women:", error);
      res.status(500).send("Error fetching popular products.");
    }
  
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
