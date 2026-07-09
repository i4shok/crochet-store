import {
  useEffect,
  useState,
} from "react";

import StatusBadge from "../components/StatusBadge";

import { Link } from "react-router-dom";

import "../styles/MyOrders.css";

function MyOrders() {

  const [orders,
    setOrders] =
    useState([]);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    fetch(
      `${import.meta.env.VITE_API_URL}/my-orders`,
      {
        headers: {
          Authorization:
            token,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setOrders(data)
      );

  }, []);

  return (

    <div className="orders-page">

      <div className="orders-header">

        <h1>

          My Orders

        </h1>

        <p>

          Track all your handmade purchases in one place.

        </p>

      </div>

      {

        orders.length === 0 ?

          (

            <div className="empty-orders">

              <h2>

                No Orders Yet

              </h2>

              <p>

                Looks like you haven't placed an order yet.

              </p>

            </div>

          )

          :

          (

            <div className="orders-list">

              {

                orders.map((order) => {

                  const isSingleProduct =
                    order.items.length === 1;

                  const previewProducts =
                    order.items.slice(0, 4);

                  return (

                    <div
                      key={order._id}
                      className="order-card"
                    >

                      {
                        isSingleProduct ? (

                          <div className="single-order-card">

                            <img
                              src={order.items[0].product?.image}
                              alt={order.items[0].product?.name}
                              className="order-product-image"
                            />

                            <div className="order-info">

                              <h2>

                                {order.items[0].product?.name}

                              </h2>

                              <p className="order-date">

                                Ordered on{" "}

                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString()}

                              </p>

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

                        ) : (

                          <div className="multi-order-placeholder">

                            Multi Product Card
                            <br />
                            (Coming in Sprint 1 - Step 4)

                          </div>

                        )
                      }

                    </div>

                  );

                })

              }

            </div>

          )

      }

    </div>

  );
}

export default MyOrders;