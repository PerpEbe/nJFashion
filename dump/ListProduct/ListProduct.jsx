/* eslint-disable no-unused-vars */
import React from "react";
import "./ListProduct.css";
import { useState, useEffect } from "react";
import cross_icon from "../../assets/cross_icon.png";
import { storage } from "../../firebase";
import { ref, deleteObject } from "firebase/storage";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch("https://n-j-fashion-backend.vercel.app/allproducts")
      .then((resp) => resp.json())
      .then((data) => {
        setAllProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    try {
      const productToDelete = allproducts.find((product) => product.id === id);
      if (!productToDelete) {
        console.error("Product not found");
        return;
      }
      // Delete the image from Firebase Storage (assuming image name is stored in product.image)
      await deleteImage(productToDelete.image);

      // Call your backend API to remove the product from the database
      const response = await fetch(
        "https://n-j-fashion-backend.vercel.app/removeproduct",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        }
      );

      if (response.ok) {
        await fetchInfo(); // Update product list after successful deletion
      } else {
        console.error(
          "Error deleting product from backend:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const deleteImage = async (image) => {
    try {
      const imageRef = ref(storage, `images/${image}`);
      await deleteObject(imageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>
              <div
                key={index}
                className="listproduct-format-main listproduct-format"
              >
                <img
                  src={product.image}
                  alt=""
                  className="listproduct-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  onClick={() => {
                    remove_product(product.id);
                  }}
                  src={cross_icon}
                  alt=""
                  className="listproduct-remove-icon"
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
