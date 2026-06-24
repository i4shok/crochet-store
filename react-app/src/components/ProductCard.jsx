import { Link } from "react-router-dom";
import StarRating from "./StarRating";

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="product-link"
    >
      <div className="product-card">
        <img
          src={product.image}
          alt={product.name}
        />

        <h3>{product.name}</h3>

        <StarRating
          rating={product.rating}
        />

        <p>{product.category}</p>

        <h4>₹{product.price}</h4>
        <p>
  Stock:
  {product.stock}
</p>
{
  product.stock <= 0 && (
    <p>
      ❌ Out Of Stock
    </p>
  )
}
      </div>
    </Link>
  );
}

export default ProductCard;