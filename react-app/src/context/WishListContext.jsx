import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import {
  AuthContext,
} from "./AuthContext";

export const WishlistContext =
  createContext();

function WishlistProvider({
  children,
}) {

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState([]);

  const { token } = useContext(AuthContext);

  useEffect(() => {

    if (!token) {

      setWishlistItems([]);

      return;

    }
    fetch(
      `${import.meta.env.VITE_API_URL}/wishlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setWishlistItems(data)
      );

  }, [token]);

  const addToWishlist =
    async (product) => {

      if (!token)
        return;

      const alreadyExists = wishlistItems.some(

        (item) => item._id === product._id

      );

      if (alreadyExists) {

        return false;

      }

      await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/${product._id}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistItems((prev) => {

        const alreadyExists =

          prev.some(

            (item) =>

              item._id === product._id

          );

        if (alreadyExists) {

          return prev;

        }

        return [

          ...prev,

          product,

        ];

      });

      return true;

    };

  const removeFromWishlist =
    async (id) => {

      if (!token)
        return;

      await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistItems(
        wishlistItems.filter(
          (item) =>
            item._id !== id
        )
      );

    };

  return (

    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >

      {children}

    </WishlistContext.Provider>

  );

}

export default WishlistProvider;