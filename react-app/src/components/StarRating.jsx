function StarRating({
  rating,
}) {
  const stars =
    Math.round(rating);

  return (
    <div>
      {"⭐".repeat(stars)}
      <span>
        {" "}
        ({rating})
      </span>
    </div>
  );
}

export default StarRating;