import { useState } from "react";

function ReviewPanel({
  averageRating,
  reviews,
  searchReview,
  setSearchReview,
  sortReviews,
  setSortReviews,
  rating,
  setRating,
  reviewText,
  setReviewText,
  handleReviewSubmit,
  editingReview,
  setEditingReview,
  handleDeleteReview,
}) {
  return (
    <aside className="review-panel">

      <div className="rating-summary">

        <div className="rating-score">

          <h1>

            {averageRating}

          </h1>

          <div className="summary-stars">

            {"★".repeat(
              Math.round(averageRating)
            )}

            {"☆".repeat(
              5 - Math.round(averageRating)
            )}

          </div>

          <p>

            {reviews.length} Reviews

          </p>

        </div>

        <div className="rating-bars">

          {[5, 4, 3, 2, 1].map((star) => {

            const count =
              reviews.filter(
                r => r.rating === star
              ).length;

            const percent =
              reviews.length
                ?
                (count / reviews.length) * 100
                :
                0;

            return (

              <div
                key={star}
                className="rating-row"
              >

                <span>

                  {star}★

                </span>

                <div
                  className="rating-bar"
                >

                  <div

                    className="rating-fill"

                    style={{
                      width: `${percent}%`
                    }}

                  />

                </div>

                <span>

                  {count}

                </span>

              </div>

            );

          })}

        </div>

      </div>

      <h2>Reviews</h2>

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

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) =>
            setReviewText(e.target.value)
          }
        />

        <button type="submit">
          {

            editingReview

              ?

              "Update Review"

              :

              "Submit Review"

          }
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

              <div className="review-top">

                <div className="review-avatar">

                  {

                    (review.user?.name || review.name || "?")

                      .charAt(0)

                      .toUpperCase()

                  }

                </div>

                <div className="review-user">

                  <h4>

                    {review.user?.name || review.name}

                  </h4>

                  <span className="verified">

                    ✔ Verified Purchase

                  </span>

                </div>

                <span className="review-date">

                  {new Date(review.createdAt).toLocaleDateString()}

                </span>

              </div>

              <div className="review-stars">

                {"★".repeat(review.rating)}

                {"☆".repeat(5 - review.rating)}

              </div>

              <p className="review-text">

                {review.text}

              </p>

              {

                review.user?._id ===
                localStorage.getItem("userId")

                &&

                <div className="review-actions">

                  <button

                    type="button"

                    className="edit-review-btn"

                    onClick={() => {

                      setEditingReview(review._id);

                      setRating(review.rating);

                      setReviewText(review.text);

                    }}

                  >

                    ✏️ Edit

                  </button>

                  <button

                    type="button"

                    className="delete-review-btn"

                    onClick={() => {

                      if (

                        window.confirm(

                          "Delete this review?"

                        )

                      ) {

                        handleDeleteReview(review._id);

                      }

                    }}

                  >

                    🗑 Delete

                  </button>

                </div>

              }

            </div>

          ))

        }

      </div>

    </aside>
  );
}

export default ReviewPanel;
