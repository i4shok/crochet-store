import { NavLink } from "react-router-dom";
import { useContext } from "react";

import "../styles/Navbar.css";

import {
  ShoppingCart,
  Heart,
  User,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { WishlistContext } from "../context/WishListContext";
import SearchBar from "./SearchBar";
import { AuthContext } from "../context/AuthContext";

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

    <header className="navbar">

      <div className="logo">

        🧶

        <span>
          Knot & Bloom
        </span>

      </div>

      <div className="nav-center">

        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/shop">
          Shop
        </NavLink>

        {token && (

          <NavLink to="/wishlist">

            <Heart size={18} />

            <span>
              {wishlistItems.length}
            </span>

          </NavLink>

        )}

        <NavLink to="/my-orders">
          Orders
        </NavLink>

      </div>

      <div className="nav-actions">

        <SearchBar />

        <button
          onClick={toggleTheme}
          className="icon-btn"
        >

          {darkMode
            ?

            <Sun size={20} />

            :

            <Moon size={20} />

          }

        </button>

        {token && (

          <NavLink
            to="/cart"
            className="cart-link"
          >

            <ShoppingCart
              size={20}
            />

            <span>
              {cartItems.length}
            </span>

          </NavLink>

        )}

        <NavLink
          to="/profile"
          className="icon-btn"
        >

          <User
            size={20}
          />

        </NavLink>

        {token

          ?

          <button
            onClick={logout}
            className="logout-btn"
          >

            <LogOut
              size={20}
            />

          </button>

          :

          <NavLink
            to="/login"
            className="login-btn"
          >

            Login

          </NavLink>

        }

      </div>

    </header>

  );
}

export default Navbar;