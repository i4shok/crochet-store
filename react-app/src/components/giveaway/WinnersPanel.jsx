import { useEffect, useState } from "react";

function WinnersPanel({ variant = "compact" }) {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/giveaway/winners`)
      .then((res) => res.json())
      .then((data) => {
        setWinners(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={`giveaway-winners-panel ${variant}`}>
      <h2>🏆 Previous Winners</h2>

      <div className="giveaway-winners-list">
        {loading ? (
          <p className="giveaway-winners-empty">Loading winners...</p>
        ) : winners.length === 0 ? (
          <p className="giveaway-winners-empty">
            No winners announced yet — could be you!
          </p>
        ) : (
          winners.map((winner) => (
            <div key={winner._id} className="giveaway-winner-card">
              <div className="giveaway-winner-top">
                <div className="giveaway-winner-avatar">
                  {winner.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="giveaway-winner-name">{winner.name}</div>
                  <div className="giveaway-winner-date">
                    {new Date(winner.announcedAt).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                    {winner.productName ? ` · won ${winner.productName}` : ""}
                  </div>
                </div>
              </div>

              {winner.comment && (
                <p className="giveaway-winner-comment">
                  "{winner.comment}"
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WinnersPanel;
