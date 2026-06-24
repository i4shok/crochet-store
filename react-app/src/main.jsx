import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "./context/ThemeContext";

import CartProvider from "./context/CartContext";
import {
  ToastContainer,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import WishlistProvider
from "./context/WishlistContext";

import AuthProvider
from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AuthProvider>

      <ThemeProvider>

        <WishlistProvider>

          <CartProvider>

            <App />

            <ToastContainer />

          </CartProvider>

        </WishlistProvider>

      </ThemeProvider>

    </AuthProvider>

  </React.StrictMode>
);