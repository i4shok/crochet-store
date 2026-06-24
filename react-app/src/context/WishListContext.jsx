import {
  createContext,
  useState,
  useEffect,
} from "react";

export const WishlistContext =
  createContext();

function WishlistProvider({
  children,
}) {
  const [wishlistItems,
    setWishlistItems] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "wishlist"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(
        wishlistItems
      )
    );
  }, [wishlistItems]);

  const addToWishlist = (
    product
  ) => {
    const exists =
      wishlistItems.find(
        (item) =>
          item.id === product.id
      );

    if (!exists) {
      setWishlistItems([
        ...wishlistItems,
        product,
      ]);
    }
  };

  const removeFromWishlist =
    (id) => {
      setWishlistItems(
        wishlistItems.filter(
          (item) =>
            item.id !== id
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