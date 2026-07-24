import {
  useEffect,
  useState,
} from "react";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

import OrderCard from "../components/OrderCard";
import OrderStatusFilter from "../components/OrderStatusFilter";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import checkedListLottie from "../assets/checked-list-up-light.lottie";

import "../styles/MyOrders.css";

import EmptyState from "../components/EmptyState";

function MyOrders() {

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [filterStatus,
    setFilterStatus] =
    useState("all");

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
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

  }, []);

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const cancelOrder = async (orderId) => {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`,
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

      setOrders(

        orders.map((o) =>
          o._id === orderId
            ? { ...o, status: data.status, cancelReason: data.cancelReason }
            : o
        )

      );

      toast.success("Order cancelled.");

    } catch (err) {

      toast.error("Failed to cancel order");

    }

  };

  const reorder = async (order) => {

    for (const item of order.items) {

      if (!item.product) continue;

      await addToCart(item.product, item.quantity);

    }

    toast.success("Order items added to cart!");

    navigate("/checkout");

  };

  return (

    <div className="orders-page">

      <div className="orders-header">

        <h1>

          My Orders

        </h1>

        <p>

          {

            !loading && orders.length > 0

              ? `Track all your handmade purchases in one place — ${orders.length} order${orders.length > 1 ? "s" : ""} so far.`

              : "Track all your handmade purchases in one place."

          }

        </p>

      </div>

      {

        loading ? (

          <div className="orders-loading">

            <DotLottieReact
              src={checkedListLottie}
              loop
              autoplay
              className="orders-loading-lottie"
            />

            <p>Fetching your orders...</p>

          </div>

        ) : orders.length === 0 ? (

          <EmptyState

            icon="📦"

            title="No Orders Yet"

            description="When you place your first handmade order, it will appear here."

            buttonText="Start Shopping"

            buttonLink="/shop"

          />

        ) : (

          <>

            <OrderStatusFilter
              activeStatus={filterStatus}
              onChange={setFilterStatus}
              orders={orders}
            />

            {

              filteredOrders.length === 0 ? (

                <EmptyState

                  icon="🔍"

                  title="No Orders Here"

                  description="Nothing matches this filter yet, try another status."

                  buttonText="View All Orders"

                  buttonLink="#"

                />

              ) : (

                <div className="orders-list">

                  {

                    filteredOrders.map((order) => (

                      <OrderCard

                        key={order._id}

                        order={order}

                        onCancel={cancelOrder}

                        onReorder={reorder}

                      />

                    ))

                  }

                </div>

              )

            }

          </>

        )

      }

    </div>

  );
}

export default MyOrders;