import {
  useState,
  useEffect,
} from "react";

import ProductQuickView from "../components/ProductQuickView";

import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";

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

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showQuickView, setShowQuickView] =
    useState(false);


  useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/products`
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setProducts(data);

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

      <div className="shop-header">
        <h1>Our Collection</h1>
      </div>
      <div className="shop-toolbar">
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
            className={
              selectedCategory === "All"
                ? "active-filter"
                : ""
            }
            onClick={() =>
              setSelectedCategory("All")
            }
          >
            All
          </button>

          <button
            className={
              selectedCategory === "Toys"
                ? "active-filter"
                : ""
            }
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
      </div>

      <div className="product-grid">
        {

          products.length === 0

            ?

            <ProductCardSkeleton

              count={8}

            />

            :

            sortedProducts.map(

              (product) => (

                <ProductCard

                  key={product._id}

                  product={product}

                  onQuickView={() => {

                    setSelectedProduct(product);

                    setShowQuickView(true);

                  }}

                />

              )

            )

        }
      </div>

      <ProductQuickView

        product={selectedProduct}

        isOpen={showQuickView}

        onClose={() => {

          setShowQuickView(false);

          setSelectedProduct(null);

        }}

      />

    </section>

  );
}

export default Shop;