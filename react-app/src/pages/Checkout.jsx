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

const EMPTY_ADDRESS_FIELDS = {
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
};

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

  // null = the person is filling in / using a manual address rather than
  // one of their saved ones.
  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(null);

  const [
    checkoutForm,
    setCheckoutForm,
  ] = useState({

    fullName: "",

    email: "",

    phone: "",

    ...EMPTY_ADDRESS_FIELDS,

  });

  const [saveThisAddress, setSaveThisAddress] = useState(true);
  const [makeDefault, setMakeDefault] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {

    // Pull the account's name/email/phone so the contact fields are
    // pre-filled even when there are no saved addresses yet.
    fetch(
      `${import.meta.env.VITE_API_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {

        setCheckoutForm((prev) => ({
          ...prev,
          fullName: prev.fullName || data.name || "",
          email: data.email || "",
          phone: prev.phone || data.phone || "",
        }));

      })
      .catch(() => {});

    fetch(
      `${import.meta.env.VITE_API_URL}/me/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    )
      .then(res => res.json())
      .then(data => {

        if (!Array.isArray(data)) return;

        setAddresses(data);

        const defaultAddress =
          data.find(
            a => a.isDefault
          );

        if (defaultAddress) {

          applySavedAddress(defaultAddress);

        }

      })
      .catch(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySavedAddress = (address) => {

    setSelectedAddressId(address._id);

    setCheckoutForm(prev => ({

      ...prev,

      fullName: address.fullName,

      phone: address.phone,

      addressLine: address.addressLine,

      city: address.city,

      state: address.state || "",

      postalCode: address.postalCode,

    }));

  };

  const startNewAddress = () => {

    setSelectedAddressId(null);

    setCheckoutForm(prev => ({
      ...prev,
      ...EMPTY_ADDRESS_FIELDS,
    }));

    setSaveThisAddress(true);
    setMakeDefault(addresses.length === 0);

  };

  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );

  const saveNewAddress = async () => {

    try {

      setIsSavingAddress(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/me/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            label: "Home",
            fullName: checkoutForm.fullName,
            phone: checkoutForm.phone,
            addressLine: checkoutForm.addressLine,
            city: checkoutForm.city,
            state: checkoutForm.state,
            postalCode: checkoutForm.postalCode,
            isDefault: makeDefault,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {

        setAddresses(data);

        const saved = data[data.length - 1];

        if (saved) {
          setSelectedAddressId(saved._id);
        }

      }

    } catch (err) {

      console.error(err);

    } finally {

      setIsSavingAddress(false);

    }

  };

  const handleOrder =
    async (e) => {

      e.preventDefault();

      if (
        !checkoutForm.fullName ||
        !checkoutForm.phone ||
        !checkoutForm.addressLine ||
        !checkoutForm.city ||
        !checkoutForm.postalCode
      ) {

        toast.error(
          "Please fill in your delivery address."
        );

        return;

      }

      setIsPlacingOrder(
        true
      );

      try {

        // Best-effort: save the manually entered address if requested,
        // but never let a failure here block placing the order.
        if (selectedAddressId === null && saveThisAddress) {

          await saveNewAddress();

        }

        const selectedSavedAddress =
          addresses.find(a => a._id === selectedAddressId);

        const deliveryAddress = {

          label: selectedSavedAddress?.label || "Home",

          fullName: checkoutForm.fullName,

          phone: checkoutForm.phone,

          addressLine: checkoutForm.addressLine,

          city: checkoutForm.city,

          state: checkoutForm.state,

          postalCode: checkoutForm.postalCode,

        };

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
              deliveryAddress,
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

  const isManualEntry = selectedAddressId === null;

  return (

    <div className="checkout-page">

      <h1>
        Checkout
      </h1>

      <div className="checkout-layout">

        <div className="checkout-left-column">

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

              <div className="checkout-address-section">

                <div className="checkout-address-section-header">

                  <h2>

                    Shipping Address

                  </h2>

                  {

                    addresses.length > 0 && !isManualEntry && (

                      <button
                        type="button"
                        className="add-new-address-btn"
                        onClick={startNewAddress}
                      >

                        + Use A New Address

                      </button>

                    )

                  }

                </div>

                {

                  addresses.length > 0 && (

                    addresses.map(address => (

                      <div

                        key={address._id}

                        className={

                          `checkout-address-card ${selectedAddressId === address._id
                            ? "selected"
                            : ""
                          }`

                        }

                        onClick={() =>
                          applySavedAddress(address)
                        }

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

                  )

                }

                {

                  isManualEntry && (

                    <div className="manual-address-form">

                      {

                        addresses.length > 0 && (

                          <p className="manual-address-hint">

                            Enter a delivery address for this order.

                          </p>

                        )

                      }

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
                          placeholder="State"
                          value={checkoutForm.state}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              state: e.target.value,
                            })
                          }
                        />

                      </div>

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

                      <label className="save-address-checkbox">

                        <input
                          type="checkbox"
                          checked={saveThisAddress}
                          onChange={(e) =>
                            setSaveThisAddress(e.target.checked)
                          }
                        />

                        Save this address for future orders

                      </label>

                      {

                        saveThisAddress && (

                          <label className="save-address-checkbox default-checkbox">

                            <input
                              type="checkbox"
                              checked={makeDefault}
                              onChange={(e) =>
                                setMakeDefault(e.target.checked)
                              }
                            />

                            Set as my default address

                          </label>

                        )

                      }

                      {

                        isSavingAddress && (

                          <p className="manual-address-hint">

                            Saving address...

                          </p>

                        )

                      }

                    </div>

                  )

                }

              </div>

            </form>

          </div>

          <div className="checkout-payment-card">

            <h2>

              Payment Method

            </h2>

            <div className="payment-options">

              <label className="payment-option disabled">

                <input
                  type="radio"
                  name="payment"
                  disabled
                />

                <div>

                  <strong>

                    UPI

                  </strong>

                  <small>

                    Google Pay, PhonePe, Paytm

                  </small>

                </div>

                <span className="coming-soon-badge">

                  Coming Soon

                </span>

              </label>

              <label className="payment-option disabled">

                <input
                  type="radio"
                  name="payment"
                  disabled
                />

                <div>

                  <strong>

                    Credit / Debit Card

                  </strong>

                  <small>

                    Visa, Mastercard, RuPay

                  </small>

                </div>

                <span className="coming-soon-badge">

                  Coming Soon

                </span>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  readOnly
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

          </div>

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
