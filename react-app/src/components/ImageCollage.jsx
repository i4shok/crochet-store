function ImageCollage({ items }) {

  const validItems = (items || []).filter(
    (item) => item.product
  );

  const displayItems = validItems.slice(0, 4);

  const emptySlots = Math.max(0, 4 - displayItems.length);

  return (
    <div className="image-collage">

      {displayItems.map((item, index) => (

        <div
          key={item.product?._id || index}
          className="collage-tile"
        >

          <img
            src={item.product?.image}
            alt={item.product?.name || "Product"}
            className="collage-image"
          />

        </div>

      ))}

      {Array.from({ length: emptySlots }).map((_, index) => (

        <div
          key={`empty-${index}`}
          className="collage-tile collage-tile-empty"
        />

      ))}

    </div>
  );
}

export default ImageCollage;