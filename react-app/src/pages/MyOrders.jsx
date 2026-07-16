import {
  useEffect,
  useState,
} from "react";

import OrderCard from "../components/OrderCard";

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
          Authorization: `Bearer ${token}`,
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

                orders.map((order) => (

                  <OrderCard

                    key={order._id}

                    order={order}

                  />

                ))

              }

            </div>

          )

      }

    </div>

  );
}

export default MyOrders;