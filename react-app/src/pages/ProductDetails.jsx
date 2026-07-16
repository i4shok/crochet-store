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

import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ReviewPanel from "../components/ReviewPanel";
import RelatedProducts from "../components/RelatedProducts";

import StarRating from "../components/StarRating";

import "../styles/ProductDetails.css";

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

  const [selectedImage, setSelectedImage] =
    useState("");

  const [quantity, setQuantity] = useState(1);

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

  const [editingReview,
    setEditingReview] =
    useState(null);

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

        setSelectedImage(data.image);

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

    const token =
      localStorage.getItem("token");

    if (!token) {

      toast.error(

        "Please login to leave a review."

      );

      return;

    }

    const endpoint =
      editingReview

        ? `${import.meta.env.VITE_API_URL}/reviews/${editingReview}`

        : `${import.meta.env.VITE_API_URL}/reviews`;

    const method =
      editingReview

        ? "PUT"

        : "POST";

    const res =
      await fetch(

        endpoint,

        {

          method,

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,

          },

          body: JSON.stringify({

            product: id,

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

  const handleDeleteReview = async (reviewId) => {

    const token =
      localStorage.getItem("token");

    const res =
      await fetch(

        `${import.meta.env.VITE_API_URL}/reviews/${reviewId}`,

        {

          method: "DELETE",

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

    const data =
      await res.json();

    if (!res.ok) {

      toast.error(data.message);

      return;

    }

    setReviews(

      reviews.filter(

        review =>

          review._id !== reviewId

      )

    );

    toast.success(

      "Review deleted."

    );

  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (

    <div className="product-page">

      <section className="product-main">

        <div className="product-details-card">

          <ProductGallery
            product={product}
          />

          <ProductInfo
            product={product}
            averageRating={averageRating}
            reviews={reviews}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
          />

        </div>

        <ReviewPanel

          averageRating={averageRating}
          reviews={reviews}
          searchReview={searchReview}
          setSearchReview={setSearchReview}
          sortReviews={sortReviews}
          setSortReviews={setSortReviews}
          rating={rating}
          setRating={setRating}
          reviewText={reviewText}
          setReviewText={setReviewText}
          handleReviewSubmit={handleReviewSubmit}
          editingReview={editingReview}
          setEditingReview={setEditingReview}
          handleDeleteReview={handleDeleteReview}
          
        />

      </section>

      <RelatedProducts
        relatedProducts={relatedProducts}
        addToCart={addToCart}
        addToWishlist={addToWishlist}
      />

    </div>

  );
}

export default ProductDetails;