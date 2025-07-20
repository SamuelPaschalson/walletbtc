import React from "react";
import "./footer.scss";

const Footer = () => {
  return (
    <footer className="footer" style={{ marginTop: "20px" }}>
      <div className="footer-content">
        <div className="footer-column">
          <a href="#">Audio Description</a>
          <a href="#">Investor Relations</a>
          <a href="#">Privacy</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-column">
          <a href="#">Service Code</a>
          <a href="#">Help Center</a>
          <a href="#">Jobs</a>
          <a href="#">Legal Notices</a>
          <a href="#">Do Not Sell or Share My Personal Information</a>
        </div>
        <div className="footer-column">
          <a href="#">Gift Cards</a>
          <a href="#">Netflix Shop</a>
          <a href="#">Cookie Preferences</a>
          <a href="#">Ad Choices</a>
        </div>
        <div className="footer-column">
          <a href="#">Media Center</a>
          <a href="#">Terms of Use</a>
          <a href="#">Corporate Information</a>
        </div>
      </div>
      <div className="copyright">© 1997 - 2024 Netflix, Inc.</div>
    </footer>
  );
};

export default Footer;
