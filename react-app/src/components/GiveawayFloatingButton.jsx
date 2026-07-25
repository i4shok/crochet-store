import { Link } from "react-router-dom";
import "../styles/GiveawayFloatingButton.css";

function GiveawayFloatingButton() {
  return (
    <Link to="/giveaway" className="giveaway-float-btn" aria-label="Giveaway">
      <span className="giveaway-float-icon">🎰</span>
      <span className="giveaway-float-label">Giveaway</span>
    </Link>
  );
}

export default GiveawayFloatingButton;
