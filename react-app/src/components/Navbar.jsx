import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import "../styles/Navbar.css";
import HeaderLogo from "../assets/branding/HeaderLogo.png";
import { ShoppingCart, Heart, User, Moon, Sun, LogOut, House, Store, Package } from "lucide-react";

import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { WishlistContext } from "../context/WishListContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { token, role, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 60);

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
          isHidden ? "navbar-hidden" : ""
        }`}
      >
        <NavLink to="/" className={({ isActive }) => `navbar-brand ${isActive ? "active" : ""}`}>
          <img src={HeaderLogo} alt="Knot & Bloom" className="navbar-logo" />
        </NavLink>

        <div className="nav-center desktop-only">
          <NavLink to="/" className="nav-icon"><House size={20} /></NavLink>
          <NavLink to="/shop" className={({ isActive }) => (isActive ? "nav-icon active" : "nav-icon")}><Store size={20} /></NavLink>
          {token && (
            <NavLink to="/wishlist" className="icon-badge">
              <Heart size={20} />
              {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
            </NavLink>
          )}
          <NavLink to="/my-orders" className="nav-icon"><Package size={20} /></NavLink>
          {role === "admin" && <NavLink to="/admin" className="admin-dashboard-link">Admin Dashboard</NavLink>}
        </div>

        <div className="nav-actions desktop-only">
          <button onClick={toggleTheme} className="icon-btn">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {token && (
            <NavLink to="/cart" className="icon-badge">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
            </NavLink>
          )}
          <NavLink to="/profile" className="icon-btn"><User size={20} /></NavLink>
          {token ? (
            <button className="nav-logout-btn" onClick={() => { logout(); navigate("/login"); }}>
              <LogOut size={20} />
            </button>
          ) : (
            <NavLink to="/login" className="login-btn">Login</NavLink>
          )}
        </div>

        <div className="mobile-top-actions mobile-only">
          {role === "admin" && <NavLink to="/admin" className="icon-btn"><Package size={20} /></NavLink>}
          <button onClick={toggleTheme} className="icon-btn">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {token ? (
            <button className="icon-btn logout-mobile" onClick={() => { logout(); navigate("/login"); }}>
              <LogOut size={20} />
            </button>
          ) : (
            <NavLink to="/login" className="login-btn">Login</NavLink>
          )}
        </div>
      </header>

      <nav className={`mobile-bottom-dock mobile-only ${isHidden ? "dock-hidden" : ""}`}>
        <NavLink to="/" className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}>
          <House size={22} />
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}>
          <Store size={22} />
        </NavLink>
        {token && (
          <NavLink to="/cart" className={({ isActive }) => `dock-item icon-badge ${isActive ? "active" : ""}`}>
            <ShoppingCart size={22} />
            {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
          </NavLink>
        )}
        {token && (
          <NavLink to="/wishlist" className={({ isActive }) => `dock-item icon-badge ${isActive ? "active" : ""}`}>
            <Heart size={22} />
            {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
          </NavLink>
        )}
        <NavLink to="/profile" className={({ isActive }) => `dock-item ${isActive ? "active" : ""}`}>
          <User size={22} />
        </NavLink>
      </nav>
    </>
  );
}

export default Navbar;