import {
  useState,
  useEffect,
} from "react";

import { Search } from "lucide-react";

import ProductQuickView from "../components/ProductQuickView";
import "../styles/Shop.css";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";

const CATEGORIES = [
  { label: "All", icon: "✨" },
  { label: "Toys", icon: "🧸" },
  { label: "Flowers", icon: "🌸" },
  { label: "Keychains", icon: "🔑" },
];

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

  const isLoading = products.length === 0;
  const hasNoResults =
    !isLoading && sortedProducts.length === 0;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortOption("default");
  };

  return (
    <section className="shop-page">

      <div className="shop-header">
        <span className="shop-eyebrow">🧶 Handcrafted With Care</span>
        <h1>Our Collection</h1>
        <p className="shop-subtitle">
          Every piece is stitched by hand, one loop at a time.
        </p>
      </div>

      <div className="shop-toolbar">

        <div className="shop-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search for something handmade..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />
        </div>

        <div className="shop-toolbar-row">

          <div className="filters">

            {CATEGORIES.map((cat) => (

              <button
                key={cat.label}
                className={
                  selectedCategory === cat.label
                    ? "active-filter"
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(cat.label)
                }
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>

            ))}

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

      </div>

      {!isLoading && (
        <p className="shop-results-count">
          {sortedProducts.length}{" "}
          handmade piece{sortedProducts.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
        </p>
      )}

      {hasNoResults ? (

        <div className="empty-search">
          <h2>🧵 Nothing here yet</h2>
          <p>
            We couldn't find anything matching your search.
            Try a different keyword or category.
          </p>
          <button onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

      ) : (

        <div className="product-grid">
          {

            isLoading

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

      )}

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