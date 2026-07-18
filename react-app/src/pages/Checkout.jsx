import {
  useContext,
  useEffect,
  useState,
} from "react";

import { CartContext } from "../context/CartContext";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

import "../styles/Checkout.css";

function Checkout() {

  const navigate =
    useNavigate();

  const {
    cartItems,
    clearCart,
  } = useContext(
    CartContext
  );

  const [
    isPlacingOrder,
    setIsPlacingOrder,
  ] = useState(false);

  const [
    addresses,
    setAddresses,
  ] = useState([]);

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState(null);

  const [
    checkoutForm,
    setCheckoutForm,
  ] = useState({

    fullName: "",

    email: "",

    phone: "",

    addressLine: "",

    city: "",

    postalCode: "",

  });

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    fetch(
      `${import.meta.env.VITE_API_URL}/me/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    )
      .then(res => res.json())
      .then(data => {

        setCheckoutForm(prev => ({
          ...prev,
          email: data.email || "",
        }));

        setAddresses(data);

        const defaultAddress =
          data.find(
            a => a.isDefault
          );

        if (defaultAddress) {

          setSelectedAddress(defaultAddress);

        }

      });

  }, []);

  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );

  const handleOrder =
    async (e) => {

      e.preventDefault();

      setIsPlacingOrder(
        true
      );

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        console.log("Cart Items:", cartItems);

        if (!selectedAddress) {

          toast.error(
            "Please select a delivery address."
          );

          return;

        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: cartItems,
              total: totalPrice,
              deliveryAddress: selectedAddress,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {

          toast.error(
            data.message
          );

          return;

        }

        toast.success(
          "Order placed successfully!"
        );

        clearCart();

        navigate(
          "/order-success"
        );

      } finally {

        setIsPlacingOrder(
          false
        );

      }

    };

  return (

    <div className="checkout-page">

      <h1>
        Checkout
      </h1>

      <div className="checkout-layout">

        <div className="checkout-left">

          <h2>

            Contact Information

          </h2>

          <form
            id="checkoutForm"
            className="checkout-form"
            onSubmit={handleOrder}
          >

            <input
              type="text"
              placeholder="Full Name"
              value={checkoutForm.fullName}
              onChange={(e) =>

                setCheckoutForm({

                  ...checkoutForm,

                  fullName: e.target.value,

                })

              }
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={checkoutForm.email}
              onChange={(e) =>
                setCheckoutForm({
                  ...checkoutForm,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={checkoutForm.phone}
              onChange={(e) =>
                setCheckoutForm({
                  ...checkoutForm,
                  phone: e.target.value,
                })
              }
              required
            />

            <hr className="checkout-divider" />

            <h2>

              Shipping Address

            </h2>

            <textarea
              placeholder="Shipping Address"
              value={checkoutForm.addressLine}
              onChange={(e) =>
                setCheckoutForm({
                  ...checkoutForm,
                  addressLine: e.target.value,
                })
              }
              required
            />

            <div className="checkout-row">

              <input
                type="text"
                placeholder="City"
                value={checkoutForm.city}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    city: e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Postal Code"
                value={checkoutForm.postalCode}
                onChange={(e) =>
                  setCheckoutForm({
                    ...checkoutForm,
                    postalCode: e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="checkout-address-section">

              <h2>

                Select Delivery Address

              </h2>

              {

                addresses.length === 0

                  ?

                  (

                    <p>

                      No saved addresses.

                    </p>

                  )

                  :

                  addresses.map(address => (

                    <div

                      key={address._id}

                      className={

                        `checkout-address-card ${selectedAddress?._id === address._id
                          ? "selected"
                          : ""
                        }`

                      }

                      onClick={() => {

                        setSelectedAddress(address);

                        setCheckoutForm({

                          fullName: address.fullName,

                          email: "",

                          phone: address.phone,

                          addressLine: address.addressLine,

                          city: address.city,

                          postalCode: address.postalCode,

                        });

                      }}

                    >

                      <strong>

                        {address.label}

                      </strong>

                      <p>

                        {address.fullName}

                      </p>

                      <p>

                        {address.phone}

                      </p>

                      <p>

                        {address.addressLine}

                      </p>

                      <p>

                        {address.city}, {address.state}

                      </p>

                      <p>

                        {address.postalCode}

                      </p>

                      {

                        address.isDefault && (

                          <span className="default-badge">

                            Default

                          </span>

                        )

                      }

                    </div>

                  ))

              }

            </div>

            <h2>

              Payment Method

            </h2>

            <div className="payment-options">

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                />

                <div>

                  <strong>

                    UPI

                  </strong>

                  <small>

                    Google Pay, PhonePe, Paytm

                  </small>

                </div>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                />

                <div>

                  <strong>

                    Credit / Debit Card

                  </strong>

                  <small>

                    Visa, Mastercard, RuPay

                  </small>

                </div>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                />

                <div>

                  <strong>

                    Cash On Delivery

                  </strong>

                  <small>

                    Pay when your order arrives

                  </small>

                </div>

              </label>

            </div>

          </form>

        </div>

        <aside className="checkout-summary">

          <h2>

            Order Summary

          </h2>

          {
            cartItems.map(item => (

              <div
                key={item._id}
                className="summary-item"
              >

                <span>

                  {item.name}

                  × {item.quantity}

                </span>

                <span>

                  ₹{item.price * item.quantity}

                </span>

              </div>

            ))
          }

          <div className="summary-row">

            <span>

              Shipping

            </span>

            <span className="free">

              FREE

            </span>

          </div>

          <div className="summary-row">

            <span>

              Estimated Delivery

            </span>

            <span>

              3–5 Days

            </span>

          </div>

          <hr />

          <div className="summary-total">

            <span>

              Total

            </span>

            <span>

              ₹{totalPrice}

            </span>

          </div>

          <div className="checkout-info">

            <div>

              🔒 256-bit SSL Encrypted

            </div>

            <div>

              🚚 Fast Delivery

            </div>

            <div>

              🔄 Easy Returns

            </div>

          </div>

          <button
            type="submit"
            form="checkoutForm"
            disabled={isPlacingOrder}
            className="place-order-btn"
          >

            {
              isPlacingOrder
                ? "Placing Order..."
                : "Place Order →"
            }

          </button>

        </aside>

      </div>
    </div>

  );

}

export default Checkout;