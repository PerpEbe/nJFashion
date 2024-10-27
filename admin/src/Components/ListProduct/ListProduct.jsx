/* eslint-disable no-unused-vars */
import React from "react";
import "./ListProduct.css";
import { useState, useEffect } from "react";
import cross_icon from "../../assets/cross_icon.png";
import {
  doc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
} from "firebase/firestore";
import { db, storage } from "../../firebase.js";
import { ref, deleteObject } from "firebase/storage";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  // const fetchInfo = async () => {
  //   await fetch("http://localhost:4000/allproducts")
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       setAllProducts(data);
  //     });
  // };

  useEffect(() => {
    const productRef = collection(db, "Products");
    // const q = query(productRef,orderBy("createdAt","desc"))
    const q = query(productRef);
    onSnapshot(q, (snapshot) => {
      const allproducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllProducts(allproducts);
      console.log(allproducts);
    });
    // fetchInfo();
  }, []);

  const remove_product = async (id, image) => {
    try {
      await deleteDoc(doc(db, "Products", id));
      const storageRef = ref(storage, image);
      await deleteObject(storageRef);
      toast.error("Product Deleted!");
    } catch (error) {
      console.log(error);
    }
    // await fetch("http://localhost:4000/removeproduct", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ id: id, image: image }),
    // });

    // await fetchInfo();
  };

  return (
    <div className="list-product">
      <h1>All Products</h1>
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
        {/* {allproducts.map((product) => { */}
        {allproducts.map((product) => {
          return (
            <React.Fragment key={product.id}>
              <div
                key={product.id} // Unique identifier for each product
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
                  onClick={() => remove_product(product.id, product.image)} // Correct event handler
                  src={cross_icon}
                  alt=""
                  className="listproduct-remove-icon"
                />
              </div>
              <hr />
            </React.Fragment>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ListProduct;
