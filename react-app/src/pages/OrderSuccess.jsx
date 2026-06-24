import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="success-page">

      <h1>
        🎉 Order Placed Successfully!
      </h1>

      <p>
        Thank you for supporting
        our crochet business.
      </p>

      <Link
        to="/shop"
        className="success-btn"
      >
        Continue Shopping
      </Link>

    </div>
  );
}

export default OrderSuccess;