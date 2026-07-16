import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../styles/AddressManager.css"; ``
function AddressManager() {

  const [addresses, setAddresses] = useState([]);

  const [
    showAddForm,
    setShowAddForm,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({

    label: "Home",

    fullName: "",

    phone: "",

    addressLine: "",

    city: "",

    state: "",

    postalCode: "",

    isDefault: false,

  });

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const fetchAddresses = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(

          `${import.meta.env.VITE_API_URL}/me/addresses`,

          {

            headers: {

              Authorization: `Bearer ${token}`,

            },

          }

        );

      const data =
        await res.json();

      setAddresses(data);

    } catch (error) {

      toast.error(
        "Failed to load addresses."
      );

    }

  };

  const saveAddress = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(

          editingId

            ?

            `${import.meta.env.VITE_API_URL}/me/addresses/${editingId}`

            :

            `${import.meta.env.VITE_API_URL}/me/addresses`,

          {

            method:

              editingId

                ? "PUT"

                : "POST",

            headers: {

              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`,

            },

            body: JSON.stringify(formData),

          }

        );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(data.message);

        return;

      }

      toast.success(

        editingId

          ? "Address updated!"

          : "Address added!"

      );

      fetchAddresses();

      setEditingId(null);

      setShowAddForm(false);

      setFormData({

        label: "Home",

        fullName: "",

        phone: "",

        addressLine: "",

        city: "",

        state: "",

        postalCode: "",

        isDefault: false,

      });

    } catch (error) {

      toast.error(
        "Failed to save address."
      );

    }

  };

  const deleteAddress = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(

          `${import.meta.env.VITE_API_URL}/me/addresses/${id}`,

          {

            method: "DELETE",

            headers: {

              Authorization: `Bearer ${token}`,

            },

          }

        );

      const data =
        await res.json();

      if (!res.ok) {

        toast.error(data.message);

        return;

      }

      toast.success(
        "Address deleted."
      );

      fetchAddresses();

    }

    catch {

      toast.error(
        "Failed to delete address."
      );

    }

  };

  useEffect(() => {

    fetchAddresses();

  }, []);

  return (

    <div className="address-manager">

      <h3>

        Saved Addresses

      </h3>

      <button
        className="add-address-btn"
        onClick={() =>
          setShowAddForm(true)
        }
      >

        + Add New Address

      </button>

      {

        addresses.length === 0

          ?

          <p>

            No saved addresses yet.

          </p>

          :

          addresses.map(address => (

            <div
              key={address._id}
              className="address-card"
            >

              {

                address.isDefault &&

                <span className="default-badge">

                  Default

                </span>

              }

              <h4>

                {address.label}

              </h4>

              <p>

                {address.fullName}

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

              <p>

                {address.phone}

              </p>

              <div className="address-buttons">

                <button
                  className="edit-address-btn"
                  onClick={() => {

                    setEditingId(address._id);

                    setFormData({

                      label: address.label,

                      fullName: address.fullName,

                      phone: address.phone,

                      addressLine: address.addressLine,

                      city: address.city,

                      state: address.state,

                      postalCode: address.postalCode,

                      isDefault: address.isDefault,

                    });

                    setShowAddForm(true);

                  }}
                >

                  Edit

                </button>

                <button
                  className="delete-address-btn"
                  onClick={() =>
                    deleteAddress(address._id)
                  }
                >

                  Delete

                </button>

              </div>

            </div>

          ))

      }

      {

        showAddForm && (

          <div className="address-form">

            <input
              placeholder="Label (Home / Office)"
              value={formData.label}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  label: e.target.value,
                })
              }
            />

            <input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Address"
              value={formData.addressLine}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  addressLine: e.target.value,
                })
              }
            />

            <div className="address-row">

              <input
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    city: e.target.value,
                  })
                }
              />

              <input
                placeholder="State"
                value={formData.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value,
                  })
                }
              />

            </div>

            <input
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  postalCode: e.target.value,
                })
              }
            />

            <label className="default-checkbox">

              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isDefault: e.target.checked,
                  })
                }
              />

              Make this my default address

            </label>

            <button
              className="save-address-btn"
              onClick={saveAddress}
            >

              {

                editingId

                  ?

                  "Update Address"

                  :

                  "Save Address"

              }

            </button>

          </div>

        )

      }

    </div>

  );

}

export default AddressManager;