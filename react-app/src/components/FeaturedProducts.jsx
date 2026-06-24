import { Link } from "react-router-dom";
import products from "../data/products";

function FeaturedProducts() {
  const featuredProducts =
    products.slice(0, 3);

  return (
    <section className="featured">
      <h2>Featured Products</h2>

      <div className="product-grid">
        {featuredProducts.map(
          (product) => (
            <div
              key={product.id}
              className="product-card"
            >
              <img
                src={product.image}
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <p>
                ₹{product.price}
              </p>

              <Link
                to={`/product/${product.id}`}
                className="view-btn"
              >
                View Product
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;