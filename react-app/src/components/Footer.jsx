import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import "../styles/Footer.css";

import FullLogo from "../assets/branding/logo-full.png";

function Footer() {

  return (

    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <div className="footer-logo">

            🧶

          </div>

          <h2>

            Knot & Bloom

          </h2>

          <p>

            Handcrafted crochet creations made with love,
            patience and creativity.

          </p>

          <div className="footer-socials">

            <a href="#">

              <FaInstagram size={18} />

            </a>

            <a href="#">

              <FaLinkedin size={18} />

            </a>

            <a href="#">

              <FaGithub size={18} />

            </a>

          </div>

        </div>

        <div className="footer-links">

          <h3>

            Explore

          </h3>

          <Link to="/">

            Home

          </Link>

          <Link to="/shop">

            Shop

          </Link>

          <Link to="/wishlist">

            Wishlist

          </Link>

          <Link to="/my-orders">

            Orders

          </Link>

        </div>

        <div className="footer-links">

          <h3>

            Support

          </h3>

          <Link to="/contact">

            Contact

          </Link>

          <a href="#">

            Shipping

          </a>

          <a href="#">

            Returns

          </a>

          <a href="#">

            FAQ

          </a>

        </div>

      </div>

      <div className="footer-bottom">

        © 2026 Knot & Bloom • Handmade with ❤️ in India

      </div>

    </footer>

  );

}

export default Footer;