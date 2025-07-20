import React from "react";
import "./navbar.scss";
import stylixLogo from "../../assets/logo.png"; // Update with STYLIX logo
import {
  Search,
  NotificationsNoneOutlined,
  ArrowDropDown,
  ShoppingCart,
  ArrowDropUp,
} from "@material-ui/icons";
import { Badge, IconButton } from "@material-ui/core";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ img }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <div
      className={
        isScrolled
          ? "navigation headers-container scrolled"
          : "navigation headers-container"
      }
    >
      <div className={isScrolled ? "navbar scrolled" : "navbar"}>
        <div className="container">
          <div className="left">
            <img src={stylixLogo} alt="STYLIX" className="logo" />
            <Link to="/" className="link">
              <span>Home</span>
            </Link>
            <Link to="/series" className="link">
              <span>TV Shows</span>
            </Link>
            <Link to="/movies" className="link">
              <span>Movies</span>
            </Link>
            <Link to="/new" className="link">
              <span>New & Popular</span>
            </Link>
            <Link to="/mylist" className="link">
              <span>My List</span>
            </Link>
            <Link to="/browse" className="link">
              <span>Browse by Language</span>
            </Link>
          </div>
          {/* <div className="right">
            <Search className="icon" />
            <div className="profile">
              <img src={avatar} alt="Profile" />
            </div>
          </div> */}
          <div className="right" style={{ marginLeft: "40px" }}>
            <Search className="icon" />
            <IconButton color="inherit">
              <Badge badgeContent="1" color="secondary">
                <NotificationsNoneOutlined className="icon1" />
              </Badge>
            </IconButton>
            <div className="profile">
              <img style={{ marginLeft: "10px" }} src={img} alt="" />
              <ArrowDropDown className="icon2" />
              <div className="options">
                <ArrowDropUp style={{ marginRight: "20px" }} className="icon" />
                <div
                  className="opt"
                  style={{ marginTop: "-10px", marginRight: "40px" }}
                >
                  <span>Settings</span>
                  <span onClick={() => dispatch(logout())}>Logout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
