import {
    useEffect,
    useState,
} from "react";

import { useContext } from "react";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import StatusBadge from "../components/StatusBadge";

import "../styles/OrderDetails.css";

import DeliveryTimeline from "../components/DeliveryTimeline";

function OrderDetails() {

    const { id } =
        useParams();

    const navigate = useNavigate();

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

    const { addToCart } = useContext(CartContext);

    const cancelOrder = async () => {

        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        const token = localStorage.getItem("token");

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/orders/${id}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            setOrder((prev) => ({
                ...prev,
                status: data.status,
                cancelReason: data.cancelReason,
            }));

            toast.success("Order cancelled.");

        } catch (err) {

            toast.error("Failed to cancel order");

        }

    };

    const reorder = async () => {

        for (const item of order.items) {

            if (!item.product) continue;

            await addToCart(item.product, item.quantity);

        }

        toast.success("Order items added to cart!");

        navigate("/checkout");

    };

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
                    reason={order.cancelReason}
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

                <button
                    className="primary-action"
                    onClick={() => {

                        document
                            .querySelector(".timeline")
                            ?.scrollIntoView({

                                behavior: "smooth",

                            });

                    }}
                >

                    📍 Track Order

                </button>

                {

                    order.status === "Cancelled" ? (

                        <button
                            className="primary-action"
                            onClick={reorder}
                        >

                            🔁 Order Again

                        </button>

                    ) : order.status !== "Delivered" && (

                        <button
                            className="cancel-order-action"
                            onClick={cancelOrder}
                        >

                            ✕ Cancel Order

                        </button>

                    )

                }

                <button
                    className="secondary-action"
                    onClick={() =>
                        navigate("/shop")
                    }
                >

                    🛍 Continue Shopping

                </button>

            </div>

            {

                order.items.map((item, index) => (

                    <div
                        key={item._id || index}
                        className="product-order-card"
                    >

                        <img
                            src={item.product?.image}
                            alt={item.product?.name || "Product no longer available"}
                        />

                        <div className="product-order-info">

                            <h2>

                                {item.product?.name || "Product no longer available"}

                            </h2>

                            <p>

                                Qty × {item.quantity}

                            </p>

                            <p>

                                Price : ₹{item.product?.price ?? "—"}

                            </p>

                            {

                                item.product?._id && (

                                    <div className="order-actions">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/product/${item.product._id}`
                                                )
                                            }
                                        >

                                            View Product

                                        </button>

                                        {

                                            order.status !== "Cancelled" && (

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/product/${item.product._id}`
                                                        )
                                                    }
                                                >

                                                    Review Product

                                                </button>

                                            )

                                        }

                                    </div>

                                )

                            }

                        </div>
                    </div>

                ))

            }

        </div>

    );

}

export default OrderDetails;