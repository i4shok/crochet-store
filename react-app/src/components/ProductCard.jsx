import { Link } from "react-router-dom";
import StarRating from "./StarRating";

import "../styles/ProductCard.css";

function ProductCard({ product }) {

  return (

    <Link
      to={`/product/${product._id}`}
      className="product-link"
    >

      <div className="product-card">

        <div className="product-image">

          <img
            src={product.image}
            alt={product.name}
          />

          <span className="category-badge">

            {product.category}

          </span>

        </div>

        <div className="product-info">

          <h3>

            {product.name}

          </h3>

          <StarRating
            rating={product.rating || 5}
          />

          <h4>

            ₹{product.price}

          </h4>

          <div
            className={
              product.stock > 0
                ? "stock in-stock"
                : "stock out-stock"
            }
          >

            {product.stock > 0
              ? "🟢 In Stock"
              : "🔴 Out of Stock"}

          </div>

          <div className="view-details">

            View Details →

          </div>

        </div>

      </div>

    </Link>

  );

}

export default ProductCard;