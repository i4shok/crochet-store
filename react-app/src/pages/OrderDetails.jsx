import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import StatusBadge from "../components/StatusBadge";

import "../styles/OrderDetails.css";

import DeliveryTimeline from "../components/DeliveryTimeline";

function OrderDetails() {

    const { id } =
        useParams();

    const [order, setOrder] =
        useState(null);

    useEffect(() => {

        const token =
            localStorage.getItem(
                "token"
            );

        fetch(
            `${import.meta.env.VITE_API_URL}/orders/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((res) =>
                res.json()
            )
            .then((data) =>
                setOrder(data)
            );

    }, [id]);

    if (!order) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="order-details-page">

            <div className="order-summary-card">

                <div>

                    <h2>

                        Order Summary

                    </h2>

                    <p>

                        Order #

                        {order._id.slice(-8).toUpperCase()}

                    </p>

                </div>

                <StatusBadge
                    status={order.status}
                />

                <DeliveryTimeline
                    status={order.status}
                />

                <div className="summary-grid">

                    <div>

                        <span>

                            Ordered On

                        </span>

                        <strong>

                            {new Date(
                                order.createdAt
                            ).toLocaleDateString()}

                        </strong>

                    </div>

                    <div>

                        <span>

                            Total Amount

                        </span>

                        <strong>

                            ₹{order.total}

                        </strong>

                    </div>

                </div>

            </div>

            <div className="delivery-info-card">

                <div className="delivery-info-box">

                    <h4>

                        📅 Ordered On

                    </h4>

                    <p>

                        {new Date(
                            order.createdAt
                        ).toLocaleDateString()}

                    </p>

                </div>

                <div className="delivery-info-box">

                    <h4>

                        🚚 Expected Delivery

                    </h4>

                    <p>

                        Coming Soon

                    </p>

                </div>

                <div className="delivery-info-box">

                    <h4>

                        💰 Order Total

                    </h4>

                    <p>

                        ₹{order.total}

                    </p>

                </div>

            </div>

            <div className="order-action-panel">

                <button className="primary-action">

                    📍 Track Order

                </button>

                <button className="secondary-action">

                    🛍 Continue Shopping

                </button>

            </div>

            {

                order.items.map((item) => (

                    <div
                        key={item._id}
                        className="product-order-card"
                    >

                        <img
                            src={item.product.image}
                            alt={item.product.name}
                        />

                        <div className="product-order-info">

                            <h2>

                                {item.product.name}

                            </h2>

                            <p>

                                Qty × {item.quantity}

                            </p>

                            <p>

                                Price : ₹{item.product.price}

                            </p>

                            <div className="order-actions">

                                <button>

                                    View Product

                                </button>


                                <button>

                                    Review Product

                                </button>

                            </div>

                        </div>
                    </div>

                ))

            }

        </div>

    );

}

export default OrderDetails;