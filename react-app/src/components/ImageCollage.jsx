function ImageCollage({ items }) {

  const previewImages =
    items.slice(0, 4);

  return (

    <div className="image-collage">

      {

        previewImages.map((item) => (

          <div
            key={item.product._id}
            className="collage-tile"
          >

            <img

              src={item.product.image}

              alt={item.product.name}

              className="collage-image"

            />

          </div>

        ))

      }

    </div>

  );

}

export default ImageCollage;