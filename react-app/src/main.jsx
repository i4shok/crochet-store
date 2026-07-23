import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "./context/ThemeContext";

import CartProvider from "./context/CartContext";
import {
  ToastContainer,
  Slide,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/Toast.css";

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
              <ToastContainer
                position="top-right"
                autoClose={2000}
                newestOnTop
                closeOnClick
                pauseOnHover
                transition={Slide}
              />
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);