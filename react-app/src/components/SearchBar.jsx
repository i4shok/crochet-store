import { useState } from "react";
import { Link } from "react-router-dom";
import products from "../data/products";

function SearchBar() {
  const [search,
    setSearch] =
    useState("");

  const [query, setQuery] =
    useState("");

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
    );

  return (
    <div className="search-bar">

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      {query && (
        <div className="search-results">

          {filteredProducts.map(
            (product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
              >
                {product.name}
              </Link>
            )
          )}

        </div>
      )}

    </div>
  );
}

export default SearchBar;