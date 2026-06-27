import { Link } from "react-router-dom";

import heroImage from "../assets/hero.jpg";

import "../styles/Hero.css";

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage:
          `url(${heroImage})`,
      }}
    >
      <div className="hero-overlay">

        <h1>
          Handmade Crochet
          Creations
        </h1>

        <p>
          Unique crochet products
          crafted with creativity,
          care and attention to detail.
        </p>

        <Link
          to="/shop"
          className="hero-btn"
        >
          Shop Now
        </Link>

      </div>
    </section>
  );
}

export default Hero;