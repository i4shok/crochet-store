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

                onChange={(e)=>

                    setStatusFilter(

                        e.target.value

                    )

                }

            >

                <option>All</option>

                <option>Pending</option>

                <option>Shipped</option>

                <option>Delivered</option>

            </select>

            <input

                type="text"

                placeholder="Search customer email..."

                value={orderSearch}

                onChange={(e)=>

                    setOrderSearch(

                        e.target.value

                    )

                }

            />

            {

                orders

                .filter(order=>{

                    const matchesSearch=

                    order.user?.email

                    ?.toLowerCase()

                    .includes(

                        orderSearch.toLowerCase()

                    );

                    const matchesStatus=

                    statusFilter==="All"

                    ||

                    order.status===statusFilter;

                    return matchesSearch && matchesStatus;

                })

                .map(order=>(

                    <div

                        key={order._id}

                        className="order-card"

                    >

                        <p>

                            User:

                            {order.user?.email}

                        </p>

                        <select

                            className={

                                order.status==="Delivered"

                                ? "status-delivered"

                                : order.status==="Shipped"

                                ? "status-shipped"

                                : "status-pending"

                            }

                            value={order.status}

                            onChange={(e)=>

                                updateStatus(order._id, e.target.value  , setOrders)

                            }

                        >

                            <option>

                                Pending

                            </option>

                            <option>

                                Shipped

                            </option>

                            <option>

                                Delivered

                            </option>

                        </select>

                        {

                            order.items.map(

                                (item,index)=>(

                                    <div key={index}>

                                        <p>

                                            Product:

                                            {

                                                item.product?.name

                                            }

                                        </p>

                                        <p>

                                            Qty:

                                            {

                                                item.quantity

                                            }

                                        </p>

                                    </div>

                                )

                            )

                        }

                        <p>

                            Total:

                            ₹{order.total}

                        </p>

                    </div>

                ))

            }

        </section>

    );

}

export default OrderManager;