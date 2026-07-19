import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  useContext,
  useEffect,
  useState,
} from "react";
import "../styles/Navbar.css";
import HeaderLogo from "../assets/branding/HeaderLogo.png";
import {
  ShoppingCart,
  Heart,
  User,
  Moon,
  Sun,
  LogOut,
  House,
  Store,
  Package,
} from "lucide-react";

import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { WishlistContext } from "../context/WishListContext";
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
    role,
    logout,
  } = useContext(
    AuthContext
  );

  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {

    const handleScroll = () => {

      setIsScrolled(window.scrollY > 60);

    };

    window.addEventListener("scroll", handleScroll);

    return () =>

      window.removeEventListener("scroll", handleScroll);

  }, []);

  return (

    <header
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>

      <NavLink

        to="/"

        className={({ isActive }) =>

          isActive

            ?

            "logo active"

            :

            "logo"

        }

      >

        <Link to="/" className="navbar-brand">

          <img
            src={HeaderLogo}
            alt="Knot & Bloom"
            className="navbar-logo"
          />

        </Link>

      </NavLink>

      <div className="nav-center">

        <NavLink
          to="/"
          className="nav-icon"
        >

          <House size={20} />

        </NavLink>

        <NavLink

          to="/shop"

          className={({ isActive }) =>

            isActive

              ?

              "nav-icon active"

              :

              "nav-icon"

          }

        >

          <Store size={20} />

        </NavLink>

        {token && (

          <NavLink

            to="/wishlist"

            className="icon-badge"

          >

            <Heart size={20} />

            {

              wishlistItems.length > 0 && (

                <span className="badge">

                  {wishlistItems.length}

                </span>

              )

            }

          </NavLink>

        )}

        <NavLink
          to="/my-orders"
          className="nav-icon"
        >

          <Package size={20} />

        </NavLink>

        {role === "admin" && (

          <NavLink
            to="/admin"
            className="admin-dashboard-link"
          >
            Admin Dashboard
          </NavLink>

        )}

      </div>

      <div className="nav-actions">

        <button
          onClick={toggleTheme}
          className="icon-btn"
          aria-label={
            darkMode
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          title={
            darkMode
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
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

            className="icon-badge"

          >

            <ShoppingCart size={20} />

            {

              cartItems.length > 0 && (

                <span className="badge">

                  {cartItems.length}

                </span>

              )

            }

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
            className="nav-logout-btn"
            onClick={() => {

              logout();

              navigate("/login");

            }}
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
