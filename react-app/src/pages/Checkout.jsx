import {
  useContext,
  useState,
} from "react";

import { CartContext } from "../context/CartContext";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

function Checkout() {

  const navigate =
    useNavigate();

  const {
    cartItems,
    clearCart,
  } = useContext(
    CartContext
  );

  const [
    isPlacingOrder,
    setIsPlacingOrder,
  ] = useState(false);

  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  const handleOrder =
    async (e) => {

      e.preventDefault();

      setIsPlacingOrder(
        true
      );

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            `${import.meta.env.VITE_API_URL}/orders`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  token,
              },

              body:
                JSON.stringify({
                  items:
                    cartItems,

                  total:
                    totalPrice,
                }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          toast.error(
            data.message
          );

          return;

        }

        toast.success(
          "Order placed successfully!"
        );

        clearCart();

        navigate(
          "/order-success"
        );

      } finally {

        setIsPlacingOrder(
          false
        );

      }

    };

  return (

    <div className="checkout-page">

      <h1>
        Checkout
      </h1>

      <form
        className="checkout-form"
        onSubmit={
          handleOrder
        }
      >

        <input
          type="text"
          placeholder="Full Name"
        />

        <input
          type="text"
          placeholder="Phone Number"
        />

        <textarea
          placeholder="Shipping Address"
        />

        <h2>
          Order Total:
          ₹{totalPrice}
        </h2>

        <button
          type="submit"
          disabled={
            isPlacingOrder
          }
        >
          {
            isPlacingOrder
              ? "Placing Order..."
              : "Place Order"
          }
        </button>

      </form>

    </div>

  );

}

export default Checkout;