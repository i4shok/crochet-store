import { Link } from "react-router-dom";
import { useContext } from "react";

import "../styles/Navbar.css";

import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  WishlistContext
} from "../context/WishListContext";
import SearchBar
  from "./SearchBar";

import {
  AuthContext,
} from "../context/AuthContext";

function Navbar() {
  const { cartItems } = useContext(CartContext);

  const { wishlistItems } =
    useContext(WishlistContext);

  const {
    darkMode,
    toggleTheme,
  } = useContext(ThemeContext);

  const {
    token,
    logout,
  } = useContext(
    AuthContext
  );


  return (
    <nav>
      <h2>Crochet Store</h2>

      <SearchBar />

      <div>
        <Link to="/">Home</Link>

        <Link to="/shop">Shop</Link>

        <Link to="/about">About</Link>

        <Link to="/contact">Contact</Link>

        {token && (
          <>
            <Link to="/cart">
              Cart ({cartItems.length})
            </Link>

            <Link to="/wishlist">
              Wishlist (
              {wishlistItems.length}
              )
            </Link>
          </>
        )}
        <Link to="/profile">
          Profile
        </Link>
        {!token && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}
        <Link
          to="/my-orders"
        >
          My Orders
        </Link>

        <button onClick={toggleTheme}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        {token && (
          <button
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;