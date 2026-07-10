import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";

function SingleOrderCard({ order }) {

    const item =
        order.items[0];

    return (

        <div className="order-card">

            <div className="single-order-card">

                <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="order-product-image"
                />

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