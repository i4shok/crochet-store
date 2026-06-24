import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
      <h1>Your Cart</h1>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="cart-item"
        >
          <h3>{item.name}</h3>

          <p>₹{item.price}</p>

          <div className="quantity-controls">
            <button
              onClick={() =>
                decreaseQuantity(item.id)
              }
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                increaseQuantity(item.id)
              }
            >
              +
            </button>

            <button
              onClick={() => {
                removeItem(item.id);

                toast.info(
                  `${item.name} removed from cart`
                );
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <h2>Total: ₹{totalPrice}</h2>

      <Link
        to="/checkout"
        className="checkout-btn"
      >
        Proceed To Checkout
      </Link>
    </div>
  );
}

export default Cart;