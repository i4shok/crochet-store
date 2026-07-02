import { useState } from "react";
import { toast } from "react-toastify";
import StarRating from "./StarRating";

function ProductInfo({
  product,
  averageRating,
  reviews,
  addToCart,
  addToWishlist,
}) {

  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-info">

      <span className="category-tag">
        {product.category}
      </span>

      <h1 className="product-title">
        {product.name}
      </h1>

      <div className="product-rating">

        <StarRating
          rating={Number(averageRating)}
        />

        <span>
          {averageRating} ({reviews.length} Reviews)
        </span>

      </div>

      <p className="product-description">
        {product.description}
      </p>

      <h2 className="product-price">
        ₹{product.price}
      </h2>

      <div className="stock-box">

        {product.stock > 0 ? (
          <>
            <span className="stock-green">
              🟢 In Stock
            </span>

            <small>
              Only {product.stock} left
            </small>
          </>
        ) : (
          <span className="stock-red">
            🔴 Out Of Stock
          </span>
        )}

      </div>

      <hr />

      <div className="quantity-row">

        <span>
          Quantity
        </span>

        <div className="quantity-selector">

          <button
            onClick={() =>
              setQuantity(prev => Math.max(1, prev - 1))
            }
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              setQuantity(prev =>
                Math.min(product.stock, prev + 1)
              )
            }
          >
            +
          </button>

        </div>

      </div>
      <div className="product-actions">
        <button
          className="cart-btn"
          disabled={product.stock <= 0}
          onClick={() => {

            const added =
              addToCart(
                product,
                quantity
              );

            if (added) {
              toast.success(`${product.name} added to cart!`);
              setQuantity(1);
            }

          }}
        >

          {product.stock <= 0
            ? "Out Of Stock"
            : "Add To Cart"}

        </button>

        <button
          className="wishlist-btn"
          onClick={() =>
            addToWishlist(product)
          }
        >
          ♡ Save to Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductInfo;