function OrderManager({

    orders,

    statusFilter,
    setStatusFilter,

    orderSearch,
    setOrderSearch,

    updateStatus,

    setOrders,

}) {

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

                            ||

                            order.status === statusFilter;

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

                            <div className="admin-order-footer">

                                <select

                                    className={

                                        order.status === "Delivered"

                                            ? "status-delivered"

                                            : order.status === "Shipped"

                                                ? "status-shipped"

                                                : "status-pending"

                                    }

                                    value={order.status}

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

                            </div>

                        </div>

                    ))

            }

        </section>

    );

}

export default OrderManager;