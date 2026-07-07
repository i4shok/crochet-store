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
from "./context/WishListContext";

import AuthProvider
from "./context/AuthContext";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>
);