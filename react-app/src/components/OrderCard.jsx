import SingleOrderCard from "./SingleOrderCard";
import MultiOrderCard from "./MultiOrderCard";

function OrderCard({ order }) {

  if (order.items.length === 1) {

    return (

      <SingleOrderCard
        order={order}
      />

    );

  }

  return (

    <MultiOrderCard
      order={order}
    />

  );

}

export default OrderCard;