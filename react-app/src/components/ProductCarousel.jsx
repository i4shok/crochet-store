import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import RatingStars from "./RatingStars";

import "../styles/ProductCarousel.css";

function ProductCarousel() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <section className="collection">
      <div className="collection-header">
        <div>
          <h2>Our Collection</h2>
          <p>Handcrafted creations made with love and care.</p>
        </div>

        <Link to="/shop" className="shop-all-btn">
          Shop All →
        </Link>
      </div>

      <div className="collection-row">
        {products.length === 0 ? (
          <ProductCardSkeleton count={4} />
        ) : (
          products.map((product) => (
            <div key={product._id} className="collection-card">
              <div className="collection-image">
                <span className="collection-tag">Handmade</span>
                <img src={product.image} alt={product.name} />
              </div>

              <h3>{product.name}</h3>

              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
              />

              <p>₹{product.price}</p>

              <Link to={`/product/${product._id}`} className="view-btn">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ProductCarousel;