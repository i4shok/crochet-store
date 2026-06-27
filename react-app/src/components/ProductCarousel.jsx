import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

function FeaturedProducts() {

  const [products,
    setProducts] =
    useState([]);

  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/products`
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setProducts(data)
      );

  }, []);

  const featuredProducts =
    products.slice(0, 3);

  return (

    <section className="featured">

      <h2>
        Featured Products
      </h2>

      <div className="product-grid">

        {featuredProducts.map(
          (product) => (

            <div
              key={product._id}
              className="product-card"
            >

              <img
                src={product.image}
                alt={product.name}
              />

              <h3>
                {product.name}
              </h3>

              <p>
                ₹{product.price}
              </p>

              <Link
                to={`/product/${product._id}`}
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