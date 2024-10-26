import React, { useEffect, useState } from "react";
import "./Popular.css";
// import data_product from '../Assets/data';
import Item from "../Item/Item";
import { db } from "../../firebase";
import { onSnapshot, collection, query } from "firebase/firestore";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const popularRef=collection(db,"Products")
    const q=query(popularRef)
    onSnapshot(q,(snapshot)=>{
      const popularProducts=snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      }));
      setPopularProducts(popularProducts)
    })

    fetch("https://n-j-fashion-frontend.vercel.app/popularinwomen")
      .then((response) => response.json())
      .then((data) => setPopularProducts(data));
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
