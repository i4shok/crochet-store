import {
  useState,
  useEffect,
} from "react";

import ProductCard from "../components/ProductCard";

import teddy from "../assets/teddy.jpg";
import sunflower from "../assets/sunflower.jpg";
import keychain from "../assets/keychain.jpg";

function Shop() {

  const [searchTerm,
    setSearchTerm] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    sortOption,
    setSortOption,
  ] = useState("default");

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
      .then((data) => {

        const productsWithImages =
          data.map((product) => {

            if (
              product.name ===
              "Crochet Teddy"
            ) {
              return {
                ...product,
                image: teddy,
              };
            }

            if (
              product.name ===
              "Crochet Sunflower"
            ) {
              return {
                ...product,
                image: sunflower,
              };
            }

            if (
              product.name ===
              "Crochet Keychain"
            ) {
              return {
                ...product,
                image: keychain,
              };
            }

            return product;
          });

        setProducts(
          productsWithImages
        );

      });

}, []);

  const filteredProducts =
    products.filter((product) => {

     const matchesSearch =
  (product.name || "")
    .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );

    });

  const sortedProducts = [
    ...filteredProducts,
  ];

  if (
    sortOption ===
    "low-high"
  ) {
    sortedProducts.sort(
      (a, b) =>
        a.price - b.price
    );
  }

  if (
    sortOption ===
    "high-low"
  ) {
    sortedProducts.sort(
      (a, b) =>
        b.price - a.price
    );
  }

  if (
    sortOption ===
    "a-z"
  ) {
    sortedProducts.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name
        )
    );
  }

  return (
    <section className="shop-page">

      <h1>Shop</h1>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
      />

      <div className="filters">

        <button
          onClick={() =>
            setSelectedCategory(
              "All"
            )
          }
        >
          All
        </button>

        <button
          onClick={() =>
            setSelectedCategory(
              "Toys"
            )
          }
        >
          Toys
        </button>

        <button
          onClick={() =>
            setSelectedCategory(
              "Flowers"
            )
          }
        >
          Flowers
        </button>

        <button
          onClick={() =>
            setSelectedCategory(
              "Keychains"
            )
          }
        >
          Keychains
        </button>

      </div>

      <select
        value={sortOption}
        onChange={(e) =>
          setSortOption(
            e.target.value
          )
        }
      >

        <option value="default">
          Sort By
        </option>

        <option value="low-high">
          Price: Low → High
        </option>

        <option value="high-low">
          Price: High → Low
        </option>

        <option value="a-z">
          Name: A → Z
        </option>

      </select>

      <div className="product-grid">

        {sortedProducts.map(
          (product) => (

            <ProductCard
              key={product._id}
              product={product}
            />

          )
        )}

      </div>

    </section>
  );
}

export default Shop;