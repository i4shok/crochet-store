import { Link } from "react-router-dom";
import "../styles/ProductCard.css";
import RatingStars from "./RatingStars";

function ProductCard({

  product,

  onQuickView = () => { },

  showQuickView = true,

}) {

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

          {

            showQuickView &&

            <div className="image-overlay">

              <button

                className="quick-view-btn"

                onClick={(e) => {

                  e.preventDefault();

                  e.stopPropagation();

                  onQuickView();

                }}

              >

                👁 Quick View

              </button>

            </div>

          }

        </div>

        <div className="product-info">

          <h3>

            {product.name}

          </h3>

          <RatingStars

            rating={product.rating}

            reviewCount={product.reviewCount}

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