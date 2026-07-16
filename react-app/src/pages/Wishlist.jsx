import {
  useContext,
} from "react";

import {
  WishlistContext,
} from "../context/WishListContext";

import {
  CartContext,
} from "../context/CartContext";

import { toast } from "react-toastify";

import EmptyState from "../components/EmptyState";

import "../styles/Wishlist.css";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useContext(
    WishlistContext
  );
  const {
    addToCart,
  } = useContext(
    CartContext
  );
  return (

    <div className="wishlist-page">

      <div className="wishlist-header">

        <h1>

          My Wishlist

        </h1>

        <p>

          Save your favorite handmade creations for later ❤️

        </p>

      </div>

      {

        wishlistItems.length === 0 ?

          (

            <EmptyState

              icon="❤️"

              title="Your wishlist is empty"

              description="Save your favourite handmade crochet products here so you can find them later."

              buttonText="Browse Products"

              buttonLink="/shop"

            />

          )

          :

          (

            <div className="wishlist-grid">

              {

                wishlistItems.map(item => (

                  <div
                    key={item._id}
                    className="wishlist-card"
                  >

                    <div className="wishlist-image">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    </div>

                    <div className="wishlist-info">

                      <span className="wishlist-category">
                        {item.category}
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <p className="wishlist-price">
                        ₹{item.price}
                      </p>

                      <div className="wishlist-stock">
                        {item.stock > 0 ? "🟢 In Stock" : "🔴 Out of Stock"}
                      </div>

                      <div className="wishlist-features">

                        <span>🧶 Handmade</span>

                        <span>🎁 Gift Ready</span>

                        <span>🌱 Eco Friendly</span>

                      </div>

                      <div className="wishlist-actions">

                        <button
                          className="wishlist-cart-btn"
                          onClick={() => {

                            const added = addToCart(item);

                            if (added) {

                              removeFromWishlist(item._id);

                              toast.success(
                                `${item.name} moved to cart!`
                              );

                            }

                          }}
                        >
                          Add To Cart
                        </button>

                        <button
                          className="wishlist-remove-btn"
                          onClick={() =>
                            removeFromWishlist(item._id)
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                ))

              }

            </div>

          )

      }

    </div>

  );
}

export default Wishlist;