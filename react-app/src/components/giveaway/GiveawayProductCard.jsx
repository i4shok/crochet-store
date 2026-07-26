import GiveawayShareCard from "./GiveawayShareCard";

function GiveawayProductCard({ product, mode = "participate", onParticipate }) {
  return (
    <div className="giveaway-product-merged">
      <div className="giveaway-merged-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="giveaway-merged-details">
        <span className="giveaway-merged-tag">🎁 This Week's Prize</span>

        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <div className="giveaway-merged-actions">
          <GiveawayShareCard product={product} />

          {mode === "participate" && (
            <button
              className="giveaway-participate-btn"
              onClick={onParticipate}
            >
              Participate Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GiveawayProductCard;
