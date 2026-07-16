import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  Link,
} from "react-router-dom";

import { toast } from "react-toastify";

import Modal from "../components/Modal";

import "../styles/Profile.css";

import {
  Package,
  Heart,
  ShoppingCart,
  Shield,
  MapPin,
} from "lucide-react";

import {
  CartContext,
} from "../context/CartContext";

import {
  WishlistContext,
} from "../context/WishListContext";

import {
  AuthContext,
} from "../context/AuthContext";

import AddressManager from "../components/AddressManager";

function Profile() {

  const [user,
    setUser] =
    useState(null);

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    showAddresses,
    setShowAddresses,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({

    name: "",

    email: "",

    phone: "",

  });

  const {
    cartItems,
  } = useContext(
    CartContext
  );

  const {
    wishlistItems,
  } = useContext(
    WishlistContext
  );

  const {
    token,
    logout,
  } = useContext(
    AuthContext
  );


  const [
    orderCount,
    setOrderCount,
  ] = useState(0);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    fetch(
      `${import.meta.env.VITE_API_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setUser(data);

        setFormData({

          name: data.name || "",

          email: data.email || "",

          phone: data.phone || "",

        });

      });

    fetch(
      `${import.meta.env.VITE_API_URL}/my-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => {

        setOrderCount(
          data.length
        );

      });

  }, []);

  if (!user) {
    return <h2>Loading...</h2>;
  }

  const saveProfile =
    async () => {

      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(

          `${import.meta.env.VITE_API_URL}/me`,

          {

            method: "PUT",

            headers: {

              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`,

            },

            body: JSON.stringify(
              formData
            ),

          }

        );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(
          data.message
        );

        return;

      }

      setUser(data.user);

      setIsEditing(false);

      toast.success(
        "Profile Updated!"
      );

    };


  return (

    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-sidebar">

          <div className="profile-avatar">

            {(user?.name || "?")
              .charAt(0)
              .toUpperCase()}

          </div>

          <h2>

            {user.name}

          </h2>

          <p>

            {user.email}

          </p>

          <span className="profile-role">

            <Shield size={16} />

            {user.role}

          </span>

          <button
            className="edit-profile-btn"
            onClick={() =>
              setIsEditing(true)
            }
          >

            Edit Profile

          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >

            Logout

          </button>

        </div>

        <div className="profile-content">

          <h1>

            Welcome Back 👋

          </h1>

          <p>

            Manage your account and keep track of your crochet journey.

          </p>

          <div className="profile-stats">

            <div className="profile-stat">

              <span>📦</span>

              <h3>

                {orderCount}

              </h3>

              <p>

                Orders

              </p>

            </div>

            <div className="profile-stat">

              <span>❤️</span>

              <h3>

                {wishlistItems.length}

              </h3>

              <p>

                Wishlist

              </p>

            </div>

            <div className="profile-stat">

              <span>🛒</span>

              <h3>

                {cartItems.length}

              </h3>

              <p>

                Cart

              </p>

            </div>

          </div>

          <div className="profile-actions">

            <Link
              to="/my-orders"
              className="profile-action-card"
            >

              <Package size={22} />

              <div>

                <h4>

                  My Orders

                </h4>

                <p>

                  View your purchase history

                </p>

              </div>

            </Link>

            <Link
              to="/wishlist"
              className="profile-action-card"
            >

              <Heart size={22} />

              <div>

                <h4>

                  Wishlist

                </h4>

                <p>

                  Saved crochet favourites

                </p>

              </div>

            </Link>

            <Link
              to="/cart"
              className="profile-action-card"
            >

              <ShoppingCart size={22} />

              <div>

                <h4>

                  Shopping Cart

                </h4>

                <p>

                  Review your selected items

                </p>

              </div>

            </Link>

            <button
              className="profile-action-card"
              onClick={() => {

                setShowAddresses(true);

              }}
            >

              <MapPin size={22} />

              <div>

                <h4>

                  Saved Addresses

                </h4>

                <p>

                  Manage delivery locations

                </p>

              </div>

            </button>

          </div>

        </div>

      </div>

      {

        isEditing && (

          <Modal>

            <div className="edit-profile-modal">

              <div className="edit-avatar">

                <div className="avatar-circle">

                  {(user?.name || "?")
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <h3>

                  Edit Profile

                </h3>

                <p>

                  Update your personal information.

                </p>

              </div>

              <div className="profile-form">

                <label>

                  Full Name

                </label>

                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />

                <label>

                  Email

                </label>

                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />

                <label>

                  Phone Number

                </label>

                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                />

                <div className="modal-buttons">

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      setIsEditing(false)
                    }
                  >

                    Cancel

                  </button>

                  <button
                    className="save-btn"
                    onClick={saveProfile}
                  >

                    Save Changes

                  </button>

                </div>

              </div>

            </div>

          </Modal>

        )

      }

      {

        showAddresses && (

          <Modal
            title="Saved Addresses"
            onClose={() =>
              setShowAddresses(false)
            }
          >

            <AddressManager />

          </Modal>

        )

      }

    </div>

  );

}

export default Profile;