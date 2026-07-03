import {
  useEffect,
  useState,
} from "react";

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

            orders.map(order => (

              <div
                key={order._id}
                className="order-card"
              >

                <div className="order-top">

                  <div>

                    <h3>

                      Order #

                      {order._id.slice(-6).toUpperCase()}

                    </h3>

                    <span>

                      {new Date(order.createdAt).toLocaleDateString()}

                    </span>

                  </div>

                  <div
                    className={`status ${order.status.toLowerCase()}`}
                  >

                    {

                      order.status === "Pending"

                      ? "🟡 Pending"

                      :

                      order.status === "Shipped"

                      ? "🚚 Shipped"

                      :

                      "✅ Delivered"

                    }

                  </div>

                </div>

                <div className="order-items">

                  {

                    order.items.map((item,index)=>(

                      <div
                        key={index}
                        className="order-item"
                      >

                        <div>

                          <strong>

                            {item.product?.name}

                          </strong>

                          <p>

                            Qty × {item.quantity}

                          </p>

                        </div>

                        <span>

                          ₹

                          {(item.product?.price || 0) * item.quantity}

                        </span>

                      </div>

                    ))

                  }

                </div>

                <div className="order-footer">

                  <strong>

                    Total

                  </strong>

                  <strong>

                    ₹{order.total}

                  </strong>

                </div>

              </div>

            ))

          }

        </div>

      )

    }

  </div>

);
}

export default MyOrders;