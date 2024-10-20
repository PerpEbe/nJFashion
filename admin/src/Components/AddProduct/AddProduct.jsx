/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const AddProduct = () => {
  const [image, setImageUpload] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    tag: "",
    description: "",
  });

  // const imageHandler = (e) => {
  //   setImage(e.target.files[0]);
  // };
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (Add_Product == null) return;

    const storageRef = ref(storage, `images/${image.name + v4()}`); // Create a reference with image name
    // try {
    const uploadTask = await uploadBytes(storageRef, image);
    const image_url = await getDownloadURL(uploadTask.ref);
    // console.log("Image URL: ",image_url);

    if (image_url) {
      const productData = {
        ...productDetails, // Include existing product details
        image: image_url,
      };
      try {
        const resonse2 = await fetch("https://n-j-fashion-backend.vercel.app/addproduct", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
        const data = await resonse2.json();

        if (data.success) {
          alert("Product Added");
        } else {
          alert("Failed to add Product");
        }
      } catch (error) {
        console.log(error);
      }
    }
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
            placeholder="Type Here">
          </textarea>
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
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
          type="file"
          name="image"
          id="file-input"
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
