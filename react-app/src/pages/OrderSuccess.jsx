import { Link } from "react-router-dom";
import "../styles/OrderSuccess.css";
function OrderSuccess() {
  return (

  <div className="success-page">

    <div className="success-card">

      <div className="success-icon">

        ✅

      </div>

      <h1>

        Order Confirmed!

      </h1>

      <p className="success-message">

        Thank you for supporting handmade creations ❤️

      </p>

      <div className="order-info">

        <div>

          <span>Order Status</span>

          <strong>Confirmed</strong>

        </div>

        <div>

          <span>Estimated Delivery</span>

          <strong>3–5 Business Days</strong>

        </div>

      </div>

      <div className="success-actions">

        <Link
          to="/my-orders"
          className="secondary-btn"
        >

          View My Orders

        </Link>

        <Link
          to="/shop"
          className="success-btn"
        >

          Continue Shopping →

        </Link>

      </div>

    </div>

  </div>

);
}

export default OrderSuccess;