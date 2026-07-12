import "../../styles/Skeleton.css";

function ProductCardSkeleton({

  count = 1,

}) {

  return (

    <>

      {

        Array.from({

          length: count,

        }).map((_, index) => (

          <div

            key={index}

            className="skeleton-product-card"

          >

            <div className="skeleton-image shimmer" />

            <div className="skeleton-title shimmer" />
            <div className="skeleton-rating shimmer" />
            <div className="skeleton-price shimmer" />
            <div className="skeleton-button shimmer" />

          </div>

        ))

      }

    </>

  );

}

export default ProductCardSkeleton;