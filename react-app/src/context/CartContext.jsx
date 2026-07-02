import {
  createContext,
  useState,
  useEffect,
} from "react";

import { toast }
from "react-toastify";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart =
      localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });

const addToCart = (
  product,
  quantity = 1
) => {

const existingItem =
  cartItems.find(
    (item) =>
      item._id ===
      product._id
  );

if (
  product.stock <= 0
) {

    toast.error(
      "Out of stock!"
    );

    return false;

  }

if (
  existingItem &&
  existingItem.quantity + quantity >
    product.stock
)  {

    toast.error(
      "Not enough stock!"
    );

    return false;

  }


  if (existingItem) {

    setCartItems(
      cartItems.map(
        (item) =>

          item._id ===
          product._id

            ? {
                ...item,
                quantity:
  item.quantity +
  quantity,
              }

            : item
      )
    );
  return true;
  } else {

    setCartItems([
      ...cartItems,
      {
        ...product,
quantity: quantity,
      },
    ]);
  return true;
  }

};

  const removeItem = (id) => {
    setCartItems(
      cartItems.filter(
        (item) => item.id !== id
      )
    );
  };

  const clearCart = () => {
  setCartItems([]);
  };
  
const increaseQuantity = (
  id
) => {

  setCartItems(
    cartItems.map(
      (item) => {

        if (
          item._id === id
        ) {

          if (
            item.quantity >=
            item.stock
          ) {

            alert(
              "Stock limit reached"
            );

            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity + 1,
          };

        }

        return item;

      }
    )
  );

};

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id &&
        item.quantity > 1
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )
    );
  };
  

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

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