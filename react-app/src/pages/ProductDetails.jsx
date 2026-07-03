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
          reviewName={reviewName}
          setReviewName={setReviewName}
          reviewText={reviewText}
          setReviewText={setReviewText}
          handleReviewSubmit={handleReviewSubmit}
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