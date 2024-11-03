// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Navbar.css";
import navlogo from "../../assets/logo.png";
import navProfile from "../../assets/nav-profile.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">
        <img src={navlogo} className="nav-logo" alt="" />
      </Link>
      <img src={navProfile} className="nav-profile" alt="" />
    </div>
  );
};

export default Navbar;
