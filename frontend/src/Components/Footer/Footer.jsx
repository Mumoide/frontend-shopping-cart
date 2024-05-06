import React from "react";
import "./Footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="footer-content">
        <p>Contactanos: ferramas@duocuc.cl</p>
        <p>Telefono: 123-456-789</p>
        <div className="social-media-links">
          <a href="https://facebook.com">
            <i className="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="https://twitter.com">
            <i className="fab fa-twitter"></i> Twitter
          </a>
          <a href="https://instagram.com">
            <i className="fab fa-instagram"></i> Instagram
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Ferramas.</p>
      </div>
    </div>
  );
};

export default Footer;
