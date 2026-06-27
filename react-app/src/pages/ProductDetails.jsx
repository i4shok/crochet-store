import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import {
  useContext,
  useState,
  useEffect,
} from "react";

import { toast } from "react-toastify";

import {
  WishlistContext,
} from "../context/WishListContext";

import StarRating from "../components/StarRating";

function ProductDetails() {

  const { id } =
    useParams();

  const [product,
    setProduct] =
    useState(null);

  const [reviews,
    setReviews] =
    useState([]);

    const [relatedProducts,
  setRelatedProducts] =
  useState([]);

  const [reviewName,
    setReviewName] =
    useState("");

  const [reviewText,
    setReviewText] =
    useState("");

const [searchReview,
  setSearchReview] =
  useState("");

  const [sortReviews,
  setSortReviews] =
  useState("newest");

const [rating,
  setRating] =
  useState(5);

const averageRating =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, review) =>
            sum +
            review.rating,
          0
        ) / reviews.length
      ).toFixed(1)
    : 0;

useEffect(() => {

    fetch(
      `${import.meta.env.VITE_API_URL}/products/${id}`
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

  console.log(data);

  setProduct(data);

});
  }, [id]);
useEffect(() => {

  fetch(
    `${import.meta.env.VITE_API_URL}/products/${id}/related`
  )
    .then((res) =>
      res.json()
    )
    .then((data) =>
      setRelatedProducts(
        data
      )
    );

}, [id]);
  useEffect(() => {
  fetch(
  `${import.meta.env.VITE_API_URL}/reviews/${id}`
  )
    .then((res) =>
      res.json()
    )
    .then((data) =>
      setReviews(data)
    );
}, [id]);

  const { addToCart } =
    useContext(CartContext);

  const {
    addToWishlist,
  } = useContext(
    WishlistContext
  );

  const handleReviewSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch(
  `${import.meta.env.VITE_API_URL}/reviews`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        product: id,
        name: reviewName,
        text: reviewText,
        rating,
      }),
    }
  );

  const newReview =
  await res.json();

if (!res.ok) {

  toast.error(
    newReview.message
  );

  return;

}

toast.success(
  "Review Added"
);

setReviews([
    ...reviews,
    newReview,
  ]);

  setReviewName("");
  setReviewText("");
};



  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="product-details">

      <img
        src={product.image}
        alt={product.name}
      />

      <div>

       <h3>
  {product.name}
</h3>

<p>
  ⭐ {averageRating}
  / 5
  (
  {reviews.length}
  reviews)
</p>

        <p>
          {product.description}
        </p>

        <h2>
          ₹{product.price}
        </h2>
        <p>
  STOCK VALUE:
  {String(product.stock)}
</p>

        <button
          onClick={() => {

  const added =
    addToCart(
      product
    );

  if (added) {

    toast.success(
      `${product.name} added to cart!`
    );

  }

}}
        >
          {
            product.stock <= 0
              ? "Out Of Stock"
              : "Add To Cart"
          }
        </button>

<button
  onClick={() =>
    addToWishlist(
      product
    )
  }
>
  ❤️ Save
</button>
          
      </div>

      <section className="reviews">

        <h2>
          Reviews
        </h2>

        <input
  type="text"
  placeholder="Search reviews..."
  value={searchReview}
  onChange={(e) =>
    setSearchReview(
      e.target.value
    )
  }
/>

<select
  value={sortReviews}
  onChange={(e) =>
    setSortReviews(
      e.target.value
    )
  }
>

  <option value="newest">
    Newest First
  </option>

  <option value="oldest">
    Oldest First
  </option>

  <option value="highest">
    Highest Rated
  </option>

  <option value="lowest">
    Lowest Rated
  </option>

</select>

        <form
          onSubmit={
            handleReviewSubmit
          }
        >
<select
  value={rating}
  onChange={(e) =>
    setRating(
      Number(
        e.target.value
      )
    )
  }
>

  <option value={5}>
    5 Stars
  </option>

  <option value={4}>
    4 Stars
  </option>

  <option value={3}>
    3 Stars
  </option>

  <option value={2}>
    2 Stars
  </option>

  <option value={1}>
    1 Star
  </option>

</select>
          <input
            type="text"
            placeholder="Your Name"
            value={reviewName}
            onChange={(e) =>
              setReviewName(
                e.target.value
              )
            }
          />

          <textarea
            placeholder="Write a review"
            value={reviewText}
            onChange={(e) =>
              setReviewText(
                e.target.value
              )
            }
          />

          <button
            type="submit"
          >
            Submit Review
          </button>

        </form>

        <div className="review-list">

{reviews
  .filter(
    (review) =>
      review.text
        .toLowerCase()
        .includes(
          searchReview.toLowerCase()
        )
  )
  .sort((a, b) => {

    if (
      sortReviews ===
      "highest"
    ) {
      return (
        b.rating -
        a.rating
      );
    }

    if (
      sortReviews ===
      "lowest"
    ) {
      return (
        a.rating -
        b.rating
      );
    }

    if (
      sortReviews ===
      "oldest"
    ) {
      return (
        new Date(
          a.createdAt
        ) -
        new Date(
          b.createdAt
        )
      );
    }

    return (
      new Date(
        b.createdAt
      ) -
      new Date(
        a.createdAt
      )
    );

  })
  .map(
            (
              review,
              index
            ) => (

              <div
                key={index}
                className="review-card"
              >

                <h4>
  {review.name}
</h4>

<p>
  ⭐ {review.rating}/5
</p>

<p>
  {review.text}
</p>

              </div>

            )
          )}

        </div>

      </section>
<h2>
  You May Also Like
</h2>

<div
  className="product-grid"
>

  {relatedProducts.map(
    (product) => (

      <div
        key={product._id}
        className="product-card"
      >

        <img
          src={product.image}
          alt={product.name}
          width="120"
        />

        <h4>
          {product.name}
        </h4>

        <p>
          ₹{product.price}
        </p>

        <p>
          Stock:
          {product.stock}
        </p>

        <button
  disabled={
    product.stock <= 0
  }
  onClick={() => {

    addToCart(product);

    toast.success(
      `${product.name} added to cart!`
    );

  }}
>
  {
    product.stock <= 0
      ? "Out Of Stock"
      : "Add To Cart"
  }
</button>

<button
  onClick={() =>
    addToWishlist(product)
  }
>
  ❤️ Save
</button>

      </div>

    )
  )}

</div>
    </div>
  );
}

export default ProductDetails;