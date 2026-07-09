function StatusBadge({ status }) {

  const badge = {

    Pending: {
      icon: "🟡",
      label: "Pending",
    },

    Processing: {
      icon: "🔵",
      label: "Processing",
    },

    Packed: {
      icon: "📦",
      label: "Packed",
    },

    Shipped: {
      icon: "🚚",
      label: "Shipped",
    },

    "Out for Delivery": {
      icon: "🛵",
      label: "Out for Delivery",
    },

    Delivered: {
      icon: "✅",
      label: "Delivered",
    },

    Cancelled: {
      icon: "❌",
      label: "Cancelled",
    },

  };

  return (

    <div
      className={`status-badge ${status.toLowerCase().replace(/\s/g, "-")}`}
    >

      {badge[status]?.icon}

      {" "}

      {badge[status]?.label || status}

    </div>

  );

}

export default StatusBadge;