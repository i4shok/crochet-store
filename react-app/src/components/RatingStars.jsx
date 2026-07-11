function RatingStars({

    rating = 0,

    reviewCount = 0,

}) {

    return (

        <div className="collection-rating">

            <span>

                {"★".repeat(

                    Math.round(rating)

                )}

                {"☆".repeat(

                    5 -

                    Math.round(rating)

                )}

            </span>

            <small>

                {Number(rating).toFixed(1)}

                {" "}

                ({reviewCount})

            </small>

        </div>

    );

}

export default RatingStars;