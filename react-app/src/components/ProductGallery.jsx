import { useState } from "react";

function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.image);

  const images = product.images?.length
    ? product.images
    : [product.image];

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