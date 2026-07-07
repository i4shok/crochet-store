import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

  import {
  AuthContext,
} from "./AuthContext";

import { toast }
  from "react-toastify";



export const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const {
  token,
} = useContext(
  AuthContext);

  const fetchCart = async () => {

  if (!token) {

    setCartItems([]);
    return;

  }

  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/cart`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await res.json();

    setCartItems(

  data.map(item => ({

    ...item.product,

    quantity: item.quantity,

  }))

);

  } catch (err) {

    console.error(err);

  }

};

 const addToCart = async (
  product,
  quantity = 1
) => {

  if (!token) {

    toast.error(
      "Please login first"
    );

    return false;

  }

  try {

    const res =
      await fetch(
        `${import.meta.env.VITE_API_URL}/cart`,
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              token,

          },

          body: JSON.stringify({

            productId:
              product._id,

            quantity,

          }),

        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      toast.error(
        data.message
      );

      return false;

    }

    await fetchCart();

    return true;

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to add to cart"
    );

    return false;

  }

};

const removeItem = async (id) => {

  console.log("🗑 removeItem called:", id);

  console.log("Token:", token);

 if (!token) {

  setCartItems([]);

  return;

}

  try {

    const res =
      await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: token,
          },
        }
      );

    console.log("Status:", res.status);

    const data =
      await res.json();

    console.log(data);

    if (!res.ok) {

      toast.error(data.message);

      return;

    }

    await fetchCart();

    toast.success("Product removed from cart");

  } catch (err) {

    console.error(err);

    toast.error("Failed to remove product");

  }

};

  const clearCart = async () => {

  if (!token) {

    setCartItems([]);

    return;

  }

  try {

    const res =
      await fetch(
        `${import.meta.env.VITE_API_URL}/cart`,
        {

          method: "DELETE",

          headers: {
            Authorization:
              token,
          },

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

    await fetchCart();

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to clear cart"
    );

  }

};

  const increaseQuantity = async (id) => {

  const item =
    cartItems.find(
      item => item._id === id
    );

  if (!item) return;

  if (item.quantity >= item.stock) {

    toast.error(
      "Stock limit reached"
    );

    return;

  }

  try {

    const res =
      await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${id}`,
        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              token,

          },

          body: JSON.stringify({

            quantity:
              item.quantity + 1,

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

    await fetchCart();

  } catch (err) {

    console.error(err);

  }

};

  const decreaseQuantity = async (id) => {

  const item =
    cartItems.find(
      item => item._id === id
    );

  if (!item) return;

  if (item.quantity <= 1) {

    removeItem(id);

    return;

  }

  try {

    const res =
      await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${id}`,
        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              token,

          },

          body: JSON.stringify({

            quantity:
              item.quantity - 1,

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

    await fetchCart();

  } catch (err) {

    console.error(err);

  }

};

  useEffect(() => {

  fetchCart();

}, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;