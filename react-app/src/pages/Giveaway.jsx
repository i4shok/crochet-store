import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import GiveawayForm from "../components/giveaway/GiveawayForm";
import GiveawayCountdown from "../components/giveaway/GiveawayCountdown";
import WinnersPanel from "../components/giveaway/WinnersPanel";
import GiveawayProductCard from "../components/giveaway/GiveawayProductCard";
import "../styles/Giveaway.css";

function Giveaway() {
  const { token } = useContext(AuthContext);

  const [giveaway, setGiveaway] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [lastWinner, setLastWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadStatus = () => {
    const guestEmail = localStorage.getItem("giveawayGuestEmail");

    const query = !token && guestEmail ? `?email=${guestEmail}` : "";

    fetch(`${import.meta.env.VITE_API_URL}/giveaway/my-status${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setGiveaway(data.giveaway);
        setHasEntered(data.hasEntered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/giveaway/winners`)
      .then((res) => res.json())
      .then((data) => setLastWinner(data[0] || null))
      .catch(() => {});
  }, [hasEntered]);

  const handleEntrySuccess = (email) => {
    if (!token) {
      localStorage.setItem("giveawayGuestEmail", email);
    }

    setShowForm(false);
    setHasEntered(true);
  };

  if (loading) {
    return <h2 className="page">Loading...</h2>;
  }

  if (!giveaway) {
    return (
      <div className="giveaway-page">
        <div className="giveaway-header">
          <span>🎰 Weekly Giveaway</span>
          <h1>No Giveaway Running Right Now</h1>
          <p>Check back soon — a new giveaway drops every week.</p>
        </div>

        <WinnersPanel variant="wide" />
      </div>
    );
  }

  return (
    <div className="giveaway-page">
      <div className="giveaway-header">
        <span>🎰 Weekly Giveaway</span>
        <h1>Win This Week's Handmade Pick</h1>
        <p>
          Open to everyone — no purchase necessary. One entry per person,
          winner announced every Sunday.
        </p>
      </div>

      {hasEntered ? (
        <>
          {/* Timer now sits above everything else on both desktop and mobile */}
          <div className="giveaway-timer-card">
            <div className="giveaway-info-icon">✅</div>
            <h2>Your Participation Has Been Submitted</h2>
            <p>Sit tight — the draw happens every Sunday at midnight.</p>

            <GiveawayCountdown targetDate={giveaway.weekEnd} />

            <p className="giveaway-countdown-caption">
              Days · Hrs · Mins · Secs left until the draw
            </p>
          </div>

          <div className="giveaway-after-layout">
            <div className="giveaway-info-stack">
              {/* Product card now shows here, share-only since entry is locked in */}
              <GiveawayProductCard product={giveaway.product} mode="share" />

              {lastWinner && (
                <div className="giveaway-lastweek-card">
                  <img src={lastWinner.productImage} alt={lastWinner.name} />
                  <div>
                    <h3>🏆 Last Week's Winner: {lastWinner.name}</h3>
                    <p>
                      Won {lastWinner.productName} ·{" "}
                      {new Date(lastWinner.announcedAt).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <WinnersPanel variant="wide" />
          </div>
        </>
      ) : (
        <div className="giveaway-layout">
          <GiveawayProductCard
            product={giveaway.product}
            mode="participate"
            onParticipate={() => setShowForm(true)}
          />

          <WinnersPanel variant="compact" />
        </div>
      )}

      {showForm && (
        <GiveawayForm
          onClose={() => setShowForm(false)}
          onSuccess={handleEntrySuccess}
        />
      )}
    </div>
  );
}

export default Giveaway;
