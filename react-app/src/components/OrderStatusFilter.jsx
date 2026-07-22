function OrderStatusFilter({ activeStatus, onChange, orders }) {

    const statuses = [
        "all",
        "pending",
        "processing",
        "packed",
        "shipped",
        "out-for-delivery",
        "delivered",
        "cancelled",
    ];

    const present = statuses.filter(
        (status) =>
            status === "all" ||
            orders.some((order) => order.status === status)
    );

    return (

        <div className="status-filter-bar">

            {present.map((status) => (

                <button
                    key={status}
                    className={`status-filter-btn ${activeStatus === status ? "active" : ""}`}
                    onClick={() => onChange(status)}
                >

                    {status === "all" ? "All" : status.replace(/-/g, " ")}

                </button>

            ))}

        </div>

    );

}

export default OrderStatusFilter;