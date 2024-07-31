import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          An ecommerce website is an online platform that facilitates the buying
          and seling of products or services over the internet. Serves as a virtual
          marketplace where business and individuals showcase their product,
          interact with customers and conducts transactions without the need for
          a physical presence. E-commerce webiste have gained immerse popularity
          due to their convinience accessibility and the global reach they offer
        </p>
        <p>
        An ecommerce website is an online platform that facilitates the buying
          and seling of products or services over the internet. Serves as a virtual
          marketplace where business and individuals showcase their product.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
