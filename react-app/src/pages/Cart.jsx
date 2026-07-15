import { useContext, useState, } from "react";
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

  const [couponCode, setCouponCode] =
  useState("");

  if (cartItems.length === 0) {
    return <h2>Your cart is empty.</h2>;
  }

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const FREE_SHIPPING_THRESHOLD = 1000;

  const remainingForFreeShipping =
    Math.max(
      FREE_SHIPPING_THRESHOLD - totalPrice,
      0
    );

  const shippingProgress =
    Math.min(
      (totalPrice / FREE_SHIPPING_THRESHOLD) * 100,
      100
    );

  const shippingCharge =
    totalPrice >= FREE_SHIPPING_THRESHOLD
      ? 0
      : 49;

  const finalTotal =
    totalPrice + shippingCharge;

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

          <div className="shipping-progress">

            <div className="shipping-progress-top">

              <span>

                Free Shipping Progress

              </span>

              <span>

                ₹{Math.min(totalPrice, FREE_SHIPPING_THRESHOLD)}
                /
                ₹{FREE_SHIPPING_THRESHOLD}

              </span>

            </div>

            <div className="shipping-progress-bar">

              <div

                className="shipping-progress-fill"

                style={{

                  width: `${shippingProgress}%`

                }}

              />

            </div>

            {

              remainingForFreeShipping > 0

                ?

                <p className="shipping-message">

                  🚚 Spend
                  <strong>

                    {" "}₹{remainingForFreeShipping}{" "}

                  </strong>

                  more to unlock

                  <strong>

                    FREE Shipping

                  </strong>

                </p>

                :

                <p className="shipping-message success">

                  🎉 Congratulations!

                  Your order qualifies for

                  <strong>

                    FREE Shipping!

                  </strong>

                </p>

            }

          </div>

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

            <span
              className={
                shippingCharge === 0
                  ? "free"
                  : ""
              }
            >

              {

                shippingCharge === 0

                  ?

                  "FREE"

                  :

                  `₹${shippingCharge}`

              }

            </span>

          </div>

          <div className="coupon-box">

            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(e.target.value)
              }
            />

            <button
              onClick={() =>
                toast.info(
                  "Coupon system coming soon 🚀"
                )
              }
            >

              Apply

            </button>

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

              ₹{finalTotal}

            </span>

          </div>

          <div className="cart-banner">

            {

              shippingCharge === 0

                ?

                <>

                  🎉 Your order qualifies for

                  <strong>

                    {" "}FREE Shipping

                  </strong>

                </>

                :

                <>

                  🚚 Add

                  <strong>

                    {" "}₹{remainingForFreeShipping}{" "}

                  </strong>

                  more for

                  <strong>

                    FREE Shipping

                  </strong>

                </>

            }

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