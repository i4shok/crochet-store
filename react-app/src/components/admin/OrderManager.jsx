import { useState } from "react";

function OrderManager({

    orders,

    statusFilter,
    setStatusFilter,

    orderSearch,
    setOrderSearch,

    updateStatus,

    setOrders,

    cancelOrder,

    deleteOrder,

}) {

    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    return (

        <section className="order-manager">

            <h2>

                Recent Orders

            </h2>

            <select

                value={statusFilter}

                onChange={(e) =>

                    setStatusFilter(

                        e.target.value

                    )

                }

            >

                <option>All</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Packed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>

            </select>

            <input

                type="text"

                placeholder="Search customer email..."

                value={orderSearch}

                onChange={(e) =>

                    setOrderSearch(

                        e.target.value

                    )

                }

            />

            {

                orders

                    .filter(order => {

                        const matchesSearch =

                            order.user?.email

                                ?.toLowerCase()

                                .includes(

                                    orderSearch.toLowerCase()

                                );

                        const matchesStatus =

                            statusFilter === "All"

                                ? order.status !== "Cancelled"

                                : order.status === statusFilter;

                        return matchesSearch && matchesStatus;

                    })

                    .map(order => (

                        <div

                            key={order._id}

                            className="order-card"

                        >
                            <div className="admin-order-header">

                                <div>

                                    <h3>

                                        Order #

                                        {order._id.slice(-6).toUpperCase()}

                                    </h3>

                                    <p>

                                        👤 {order.user?.email}

                                    </p>

                                    <p>

                                        📅 {

                                            new Date(order.createdAt)

                                                .toLocaleDateString(

                                                    "en-GB",

                                                    {

                                                        day: "numeric",

                                                        month: "short",

                                                        year: "numeric",

                                                    }

                                                )

                                        }

                                    </p>

                                </div>

                                <div>

                                    <strong>

                                        ₹{order.total}

                                    </strong>

                                </div>

                            </div>

                            <div className="admin-order-products">

                                {

                                    order.items.map((item, index) => (

                                        <div

                                            key={index}

                                            className="admin-order-product"

                                        >

                                            <img

                                                src={item.product?.image}

                                                alt={item.product?.name}

                                            />

                                            <div>

                                                <strong>

                                                    {item.product?.name}

                                                </strong>

                                                <p>

                                                    Qty × {item.quantity}

                                                </p>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                            {

                                order.status === "Cancelled" && order.cancelReason && (

                                    <div className="admin-order-cancel-reason">

                                        <strong>Cancellation Reason:</strong> {order.cancelReason}

                                    </div>

                                )

                            }

                            <div className="admin-order-footer">

                                <select

                                    className={

                                        order.status === "Delivered"

                                            ? "status-delivered"

                                            : order.status === "Shipped"

                                                ? "status-shipped"

                                                : order.status === "Cancelled"

                                                    ? "status-cancelled"

                                                    : "status-pending"

                                    }

                                    value={order.status}

                                    disabled={order.status === "Cancelled"}

                                    onChange={(e) =>

                                        updateStatus(

                                            order._id,

                                            e.target.value,

                                            setOrders

                                        )

                                    }

                                >

                                    <option>Pending</option>

                                    <option>Shipped</option>

                                    <option>Delivered</option>

                                </select>

                                <div className="admin-order-actions">

                                    {

                                        order.status !== "Cancelled" && (

                                            <button

                                                type="button"

                                                className="cancel-order-btn"

                                                onClick={() => {

                                                    setCancellingOrderId(order._id);

                                                    setCancelReason("");

                                                }}

                                            >

                                                Cancel Order

                                            </button>

                                        )

                                    }

                                    <button

                                        type="button"

                                        className="delete-order-btn"

                                        onClick={() => {

                                            if (

                                                window.confirm(

                                                    "Delete this order permanently? This cannot be undone."

                                                )

                                            ) {

                                                deleteOrder(order._id);

                                            }

                                        }}

                                    >

                                        Delete Order

                                    </button>

                                </div>

                            </div>

                            {

                                cancellingOrderId === order._id && (

                                    <div className="cancel-order-form">

                                        <label>

                                            Reason for cancellation (this will be emailed to the customer)

                                        </label>

                                        <textarea

                                            placeholder="e.g. Item out of stock, unable to fulfil delivery address, etc."

                                            value={cancelReason}

                                            onChange={(e) =>

                                                setCancelReason(e.target.value)

                                            }

                                        />

                                        <div className="cancel-order-form-actions">

                                            <button

                                                type="button"

                                                className="cancel-order-form-cancel"

                                                onClick={() => {

                                                    setCancellingOrderId(null);

                                                    setCancelReason("");

                                                }}

                                            >

                                                Back

                                            </button>

                                            <button

                                                type="button"

                                                className="cancel-order-form-confirm"

                                                disabled={!cancelReason.trim()}

                                                onClick={async () => {

                                                    await cancelOrder(order._id, cancelReason);

                                                    setCancellingOrderId(null);

                                                    setCancelReason("");

                                                }}

                                            >

                                                Confirm Cancellation

                                            </button>

                                        </div>

                                    </div>

                                )

                            }

                        </div>

                    ))

            }

        </section>

    );

}

export default OrderManager;