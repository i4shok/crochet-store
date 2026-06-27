import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import {
  useContext
} from "react";

import {
  ThemeContext
} from "./context/ThemeContext";
import Wishlist
from "./pages/Wishlist";
import AdminOrders
from "./pages/AdminOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute
from "./components/ProtectedRoute";
import Profile
from "./pages/profile";
import "./App.css";
import "./styles/Theme.css";
import MyOrders
from "./pages/MyOrders";
import AdminDashboard
from "./pages/AdminDashboard";
import AdminRoute
from "./components/AdminRoute";

function App() {
  const { darkMode } =
  useContext(ThemeContext);
  return (
  <div
    className={
      darkMode
        ? "app dark"
        : "app"
    }
  >
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
        <Route
          path="/checkout"
          element={<Checkout />}
        />
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />
       <Route
            path="/wishlist"
            element={
              <ProtectedRoute>

                <Wishlist />

              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>

                <MyOrders />

              </ProtectedRoute>
            }
          />
<Route
  path="/admin"
  element={
    <AdminRoute>

      <AdminDashboard />

    </AdminRoute>
  }
/>
      </Routes>

      <Footer />
    </BrowserRouter>
  </div>
);
}

export default App;