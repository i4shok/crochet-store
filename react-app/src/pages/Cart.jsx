import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return <h2>Your cart is empty.</h2>;
  }

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (

    <div className="cart-page">

      <div className="cart-header">

        <div>

          <h1>Shopping Cart</h1>

          <p>
            {cartItems.length} item(s) in your cart
          </p>

        </div>

      </div>

<div className="cart-progress">

  <div className="progress-step active">
    🛒 Cart
  </div>

  <div className="progress-line"></div>

  <div className="progress-step">
    💳 Checkout
  </div>

  <div className="progress-line"></div>

  <div className="progress-step">
    📦 Order Complete
  </div>

</div>

      <div className="cart-layout">

        <div className="cart-items">

          {cartItems.map((item) => (

            <div
              key={item._id}
              className="cart-card"
            >

              <div className="cart-image">

                <img
                  src={item.image}
                  alt={item.name}
                />

              </div>

              <div className="cart-details">

                <span className="cart-category">

                  {item.category}

                </span>

                <h3>{item.name}</h3>

                <p className="cart-price">

                  ₹{item.price}

                </p>

                <div className="cart-stock">

                  🟢 In Stock

                </div>

                <div className="cart-features">

                  <span>🧶 Handmade</span>

                  <span>🎁 Gift Ready</span>

                  <span>🌿 Eco Friendly</span>

                </div>

                <div className="cart-controls">

                  <div className="cart-quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                    >
                      −
                    </button>

                    <span>

                      {item.quantity}

                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item._id)
                      }
                    >
                      +

                    </button>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => {

                      removeItem(item._id);

                      toast.info(
                        `${item.name} removed`
                      );

                    }}
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        <aside className="cart-summary">

          <h2>

            Order Summary

          </h2>

          <div className="summary-row">

            <span>

              Items ({cartItems.length})

            </span>

            <span>

              ₹{totalPrice}

            </span>

          </div>

          <div className="summary-row">

            <span>
              Shipping
            </span>

            <span className="free">
              FREE
            </span>

          </div>

          <div className="summary-row">

            <span>
              Discount
            </span>

            <span className="discount">
              ₹0
            </span>

          </div>

          <div className="summary-row">

            <span>

              Estimated Delivery

            </span>

            <span>

              3-5 Days

            </span>

          </div>

          <hr />

          <div className="summary-total">

            <span>

              Total

            </span>

            <span>

              ₹{totalPrice}

            </span>

          </div>

          <div className="cart-banner">

            🎉 Your order qualifies for
            <strong> FREE Shipping</strong>

          </div>

          <div className="secure-checkout">

            🔒 Secure Checkout

          </div>

          <Link
            to="/checkout"
            className="checkout-btn"
          >

            Proceed To Checkout →

          </Link>

        </aside>

      </div>

    </div>

  );

}

export default Cart;