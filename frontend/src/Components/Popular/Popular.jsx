import React, { useEffect, useState } from "react";
import "./Popular.css";
// import data_product from '../Assets/data';
import Item from "../Item/Item.jsx";
import { db } from "../../firebase.js";
import { getDocs,where, collection, query } from "firebase/firestore";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const productsRef = collection(db, "Products");
        const q = query(productsRef, where("category", "==", "women"));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const data = products.slice(0, 4);
        setPopularProducts(data);
      } catch (error) {
        console.error("Error fetching popular in women:", error);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={`${item.new_price}`}
              old_price={`${item.old_price}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
