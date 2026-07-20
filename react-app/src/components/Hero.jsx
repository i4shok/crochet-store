import { Link } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        
        <div className="hero-text">
          <h1>Every Stitch Tells A Story.</h1>
          <p>
            Discover handcrafted crochet creations made with care, patience and creativity. From timeless flowers to adorable plushies, every piece is designed to bring warmth into someone's life.
          </p>
          
          <div className="hero-features">
            <div>🌿 Handmade</div>
            <div>🚚 Fast Delivery</div>
            <div>🎁 Perfect Gifts</div>
          </div>
          
          <div className="hero-buttons">
            <Link to="/shop" className="hero-btn">
              Shop Collection
            </Link>
            <Link to="/contact" className="hero-btn secondary-btn">
              Custom Orders
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;