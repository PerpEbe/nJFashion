import React from "react";
import "./Footer.css";
import footer_logo from "../Assets/logo_big.png";
import instagram_icon from '../Assets/instagram_icon.png'
import pinterst_icon from '../Assets/pintester_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'
import x_icon from '../Assets/x_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'


const Footer = () => {
  const getYear = () => {
    return new Date().getFullYear();
  };
  // const handleClick = () => {
  //   window.open("https://www.instagram.com/njfashion/");
  // };
  // const handleClickPinterst = () => {
  //   window.open("https://www.pinterest.com/njfashion/");
  // };
  // const handleClickFacebook = () => {
  //   window.open("https://www.facebook.com/njfashion/");
  // };
  const handleClickWhatsapp = () => {
    window.open("https://wa.me/254112681608");
  };
  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={footer_logo} alt="" />
        <p>nJFashion</p>
      </div>
      <ul className="footer-links">
        <li>nJFashion</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
            <img src={facebook_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={pinterst_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img onClick={handleClickWhatsapp} src={whatsapp_icon} alt="" />
        </div>
        <div className="footer-icons-container">
            <img src={x_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ {getYear()} All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
