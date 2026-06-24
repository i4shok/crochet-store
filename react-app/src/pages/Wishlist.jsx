import {
  useContext,
} from "react";

import {
  WishlistContext,
} from "../context/WishListContext";

function Wishlist() {
  const {
  wishlistItems,
  removeFromWishlist,
} = useContext(
  WishlistContext
);

  return (
    <div className="page">
      <h1>
        Wishlist
      </h1>

      {wishlistItems.map(
        (item) => (
        <div
  key={item.id}
  className="wishlist-item"
>
  <h3>
    {item.name}
  </h3>

  <p>
    ₹{item.price}
  </p>

  <button
    onClick={() =>
      removeFromWishlist(
        item.id
      )
    }
  >
    Remove
  </button>
</div>
        )
      )}
    </div>
  );
}

export default Wishlist;