/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { storage } from "../../firebase.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase.js";

const AddProduct = () => {
  const [image] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    description: "",
    tag: "",
    new_price: "",
    old_price: "",
    image: "",
  });

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProductDetails({ ...productDetails, image: e.target.files[0] });
  };

  const Add_Product = async () => {
    // if (!productDetails.name || !productDetails.old_price) {
    //   alert("Please fill in all the details");
    //   return;
    // }

    const storageRef = ref(
      storage,
      `images/${Date.now()}${productDetails.image.name}`
    ); // Create a reference with image name
    const uploadImage = uploadBytesResumable(storageRef, productDetails.image);

    uploadImage.on(
      "state_changed",
      null, // Skip the progress handler
      (error) => {
        console.log(error);
      },
      async () => {
        // Clear product details after successful upload
        setProductDetails({
          name: "",
          category: "women",
          description: "",
          tag: "",
          new_price: "",
          old_price: "",
          image: "",
        });

        // Get the download URL and save the product details in the database
        try {
          const url = await getDownloadURL(uploadImage.snapshot.ref);
          const productRef = collection(db, "Products");
          await addDoc(productRef, {
            name: productDetails.name,
            category: productDetails.category,
            description: productDetails.description,
            tag: productDetails.tag,
            new_price: productDetails.new_price,
            old_price: productDetails.old_price,
            image: url,
            // created_at: new Date(),
          });
          alert("Product Added");
        } catch (uploadError) {
          console.error("Error saving product:", uploadError);
        }
      }
    );
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Tag</p>
        <input
          value={productDetails.tag}
          onChange={changeHandler}
          type="text"
          name="tag"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Description</p>
        <textarea
          rows={4}
          cols={70}
          maxLength={200}
          value={productDetails.description}
          onChange={changeHandler}
          type="textarea"
          name="description"
          placeholder="Type Here"
        ></textarea>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="">--Select--</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumbnail-img"
            alt=""
          />
        </label>
        <input
          // onChange={imageHandler()}
          onChange={(e) => {
            handleImageChange(e);
          }}
          type="file"
          name="image"
          id="file-input"
          accept="image/*"
          hidden
        />
      </div>
      <button
        onClick={() => {
          Add_Product();
        }}
        className="addproduct-btn"
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;

//   if (image) {
//     const productData = {
//       ...productDetails, // Include existing product details
//       image: image_url,
//     };
//     try {
//       const resonse2 = await fetch(
//         "https://n-j-fashion-backend.vercel.app/addproduct",
//         {
//           method: "post",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(productData),
//         }
//       );
//       const data = await resonse2.json();

//       if (data.success) {
//         alert("Product Added");
//       } else {
//         alert("Failed to add Product");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };
