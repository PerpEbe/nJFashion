import React from "react";
import "./DescriptionBox.css";
// import { ShopContext } from "../../Context/ShopContext";

const DescriptionBox = (props) => {
  // const {product}= props;
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        {/* <p>
         {product.description}
        </p> */}
        <p>
          An ecommerce website is an onoine platform that facilitates the buying
          and seling of products or ser eces over te internet seves as a virtual
          marketlace where buiness and individula
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
