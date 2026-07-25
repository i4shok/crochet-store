import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";

function GiveawayForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/giveaway/participate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("You're entered! Good luck 🎉");
      onSuccess(formData.email);

    } catch {

      toast.error("Something went wrong. Please try again.");

    } finally {

      setIsSubmitting(false);

    }
  };

  return (
    <Modal title="Enter The Giveaway" onClose={onClose}>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Delivery Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="giveaway-participate-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Entry"}
        </button>
      </form>
    </Modal>
  );
}

export default GiveawayForm;
