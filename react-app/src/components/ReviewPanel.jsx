import { useState } from "react";

function ReviewPanel({
  reviews,
  searchReview,
  setSearchReview,
  sortReviews,
  setSortReviews,
  rating,
  setRating,
  reviewName,
  setReviewName,
  reviewText,
  setReviewText,
  handleReviewSubmit,
}) {
  return (
    <aside className="review-panel">

      <h2>Reviews</h2>

      <input
        type="text"
        placeholder="Search reviews..."
        value={searchReview}
        onChange={(e) =>
          setSearchReview(e.target.value)
        }
      />

      <select
        value={sortReviews}
        onChange={(e) =>
          setSortReviews(e.target.value)
        }
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="highest">Highest Rated</option>
        <option value="lowest">Lowest Rated</option>
      </select>

      <form onSubmit={handleReviewSubmit}>

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
        >
          <option value={5}>★★★★★</option>
          <option value={4}>★★★★☆</option>
          <option value={3}>★★★☆☆</option>
          <option value={2}>★★☆☆☆</option>
          <option value={1}>★☆☆☆☆</option>
        </select>

        <input
          type="text"
          placeholder="Your Name"
          value={reviewName}
          onChange={(e) =>
            setReviewName(e.target.value)
          }
        />

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) =>
            setReviewText(e.target.value)
          }
        />

        <button type="submit">
          Submit Review
        </button>

      </form>

      <div className="review-list">

        {reviews
          .filter((review) =>
            review.text
              .toLowerCase()
              .includes(
                searchReview.toLowerCase()
              )
          )
          .sort((a, b) => {

            if (sortReviews === "highest")
              return b.rating - a.rating;

            if (sortReviews === "lowest")
              return a.rating - b.rating;

            if (sortReviews === "oldest")
              return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
              );

            return (
              new Date(b.createdAt) -
              new Date(a.createdAt)
            );

          })
          .map((review) => (

            <div
              key={review._id}
              className="review-card"
            >

              <div className="review-header">

                <strong>
                  {review.name}
                </strong>

                <span>
                  ⭐ {review.rating}/5
                </span>

              </div>

              <p>{review.text}</p>

            </div>

          ))}

      </div>

    </aside>
  );
}

export default ReviewPanel;