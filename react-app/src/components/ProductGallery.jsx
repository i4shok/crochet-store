import { useState, useEffect } from "react";

function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.image);

  const images = product.images?.length
    ? product.images
    : [product.image];

  // When navigating from "You May Also Like" to a different product,
  // this component instance stays mounted (same route, different :id),
  // so selectedImage would otherwise keep pointing at the old product's
  // image while the thumbnails below correctly show the new product's set.
  useEffect(() => {
    setSelectedImage(product.image);
  }, [product._id, product.image]);

  return (
    <div className="product-gallery">

      <div className="gallery-main">

        <img
          src={selectedImage}
          alt={product.name}
          className="main-product-image"
        />

      </div>

      <div className="gallery-thumbnails">

        {images.map((image, index) => (

          <img
            key={index}
            src={image}
            alt={product.name}
            className={
              selectedImage === image
                ? "active-thumb"
                : ""
            }
            onClick={() =>
              setSelectedImage(image)
            }
          />

        ))}

      </div>

    </div>
  );
}

export default ProductGallery;