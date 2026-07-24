import { Link } from "react-router-dom";

import ImageCollage from "./ImageCollage";
import StatusBadge from "./StatusBadge";

function MultiOrderCard({ order, onCancel, onReorder }) {

    const names =
        order.items.map(
            (item) => item.product?.name
        );

    const previewNames =
        names.slice(0, 3);

    const remaining =
        names.length - 3;

    return (

        <div className="order-card">

            <div className="multi-order-card">

                <ImageCollage
                    items={order.items}
                />

                <div className="order-info">

                    <h3 className="order-heading">

                        🧶 {order.items.length} Handmade Item

                        {order.items.length > 1 ? "s" : ""}

                    </h3>

                    <div className="product-list">

                        {

                            previewNames.map((name, index) => (

                                <p key={index}>

                                    • {name}

                                </p>

                            ))

                        }

                        {

                            remaining > 0 && (

                                <p className="more-items">

                                    +{remaining} more item

                                    {remaining > 1 ? "s" : ""}

                                </p>

                            )

                        }

                    </div>

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

export default MultiOrderCard;