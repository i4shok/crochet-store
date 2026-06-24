import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    clearCart,
  } = useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const handleOrder = (e) => {
    
    e.preventDefault();
    
    const token =
  localStorage.getItem(
    "token"
  );
    

fetch(
  "${import.meta.env.VITE_API_URL}/orders",
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",

      Authorization:
        token,
    },

    body: JSON.stringify({
      items: cartItems,
      total: totalPrice,
    }),
  }
)
  .then((res) => res.json())
  .then((data) => {
    console.log(
      "Order Created:",
      data
    );

    clearCart();

    navigate(
      "/order-success"
    );
  });

  
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

        <form
        className="checkout-form"
        onSubmit={handleOrder}
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

        <button type="submit">
        Place Order
        </button>

      </form>
    </div>
  );
}

export default Checkout;