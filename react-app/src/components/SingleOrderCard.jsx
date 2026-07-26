import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";

function SingleOrderCard({ order, onCancel, onReorder }) {

    const item =
        order.items[0];

    return (

        <div className="order-card">

            <div className="single-order-card">

                <img
                    src={item.product?.image || item.giveawayImage}
                    alt={item.product?.name || item.giveawayName}
                    className="order-product-image"
                />
                ...
                <h2>
                    {item.product?.name || item.giveawayName}
                </h2>
                {item.isGiveaway && <span className="giveaway-order-badge">🎁 Giveaway</span>}

                <div className="order-info">

                    <h2>

                        {item.product?.name}

                    </h2>

                    <p className="product-category">

                        Handmade Crochet Product

                    </p>

                    <p className="order-date">

                        Ordered • {

                            new Date(order.createdAt).toLocaleDateString(

                                "en-GB",

                                {

                                    day: "numeric",

                                    month: "short",

                                    year: "numeric",

                                }

                            )

                        }

                    </p>

                    <div className="order-actions">

                        <StatusBadge
                            status={order.status}
                        />

                        {

                            order.status === "Cancelled" ? (

                                <button
                                    type="button"
                                    className="reorder-btn"
                                    onClick={() => onReorder(order)}
                                >

                                    Order Again

                                </button>

                            ) : order.status !== "Delivered" && (

                                <button
                                    type="button"
                                    className="cancel-user-order-btn"
                                    onClick={() => {

                                        if (

                                            window.confirm(

                                                "Are you sure you want to cancel this order?"

                                            )

                                        ) {

                                            onCancel(order._id);

                                        }

                                    }}
                                >

                                    Cancel Order

                                </button>

                            )

                        }

                        <Link
                            to={`/orders/${order._id}`}
                            className="view-order-btn"
                        >

                            View Order →

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default SingleOrderCard;