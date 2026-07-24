import SingleOrderCard from "./SingleOrderCard";
import MultiOrderCard from "./MultiOrderCard";

function OrderCard({ order, onCancel, onReorder }) {

  if (order.items.length === 1) {

    return (

      <SingleOrderCard
        order={order}
        onCancel={onCancel}
        onReorder={onReorder}
      />

    );

  }

  return (

    <MultiOrderCard
      order={order}
      onCancel={onCancel}
      onReorder={onReorder}
    />

  );

}

export default OrderCard;