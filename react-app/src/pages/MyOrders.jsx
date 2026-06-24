import {
  useEffect,
  useState,
} from "react";

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
    <div className="page">

      <h1>
        My Orders
      </h1>

      {orders.length === 0 && (
        <p>
          No Orders Yet
        </p>
      )}

      {orders.map(
        (order) => (

          <div
            key={order._id}
            className="order-card"
          >

            <h3>
              Order
            </h3>

            <p>
              Status:
              {order.status}
            </p>

            <p>

              {
                order.status ===
                  "Pending"

                  ? "🟡 Pending"

                  : order.status ===
                    "Shipped"

                    ? "🚚 Shipped"

                    : "✅ Delivered"

              }

            </p>

            <p>
              Total:
              ₹{order.total}
            </p>

            <p>
              Items:
              {order.items.length}
            </p>

            {order.items.map(
              (item, index) => (

                <div
                  key={index}
                >

                  <p>
                    Product:
                    {
                      item.product
                        ?.name
                    }
                  </p>

                  <p>
                    Qty:
                    {
                      item.quantity
                    }
                  </p>

                </div>

              )
            )}

          </div>
        )
      )}

    </div>
  );
}

export default MyOrders;