import React from "react";
import "./DescriptionBox.css";
// import { ShopContext } from "../../Context/ShopContext";

const DescriptionBox = (props) => {
  // const {product}= props;
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (0)</div>
      </div>
      <div className="descriptionbox-description">
        {/* <p>
         {product.description}
        </p> */}
        <p>
          nJFashion defines timeless style, translating key trends
          into, wearable and attainable collections of footwear, apparel and
          accessories.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
