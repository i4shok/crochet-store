import {
  useEffect,
  useState,
} from "react";

import OrderCard from "../components/OrderCard";

import StatusBadge from "../components/StatusBadge";

import { Link } from "react-router-dom";

import "../styles/MyOrders.css";

import EmptyState from "../components/EmptyState";

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

            <EmptyState

              icon="📦"

              title="No Orders Yet"

              description="When you place your first handmade order, it will appear here."

              buttonText="Start Shopping"

              buttonLink="/shop"

            />

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