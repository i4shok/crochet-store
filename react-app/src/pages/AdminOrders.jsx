import {
  useEffect,
  useState,
} from "react";

function AdminOrders() {
  const [orders, setOrders] =
    useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch(
      "${import.meta.env.VITE_API_URL}/orders"
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setOrders(data)
      );
  };

  const updateStatus = (
    orderId
  ) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status: "Shipped",
        }),
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {
        console.log(
          "Updated:",
          data
        );

        fetchOrders();
      });
  };

  const deleteOrder = (
  orderId
) => {
  fetch(
    `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
    {
      method: "DELETE",
    }
  )
    .then((res) =>
      res.json()
    )
    .then(() => {
      fetchOrders();
    });
};

  return (
    <div className="page">
      <h1>Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="cart-item"
        >
          <h3>
            Order #{order.id}
          </h3>

          <p>
            Total: ₹{order.total}
          </p>

          <p>
            Status:
            {" "}
            {order.status}
          </p>

          <button
            onClick={() =>
              updateStatus(
                order._id
              )
            }
          >
            Mark Shipped
          </button>
          <button
  onClick={() =>
    deleteOrder(
      order._id
    )
  }
>
  Delete Order
</button>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;