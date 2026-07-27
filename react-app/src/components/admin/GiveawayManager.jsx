import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function GiveawayManager() {
  const [products, setProducts] = useState([]);
  const [giveaway, setGiveaway] = useState(null);
  const [entries, setEntries] = useState([]);
  const [winners, setWinners] = useState([]);

  const [useExisting, setUseExisting] = useState(true);
  const [existingProductId, setExistingProductId] = useState("");

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [winnerEntryId, setWinnerEntryId] = useState("");
  const [winnerComment, setWinnerComment] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchAll = () => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then(setProducts);

    fetch(`${import.meta.env.VITE_API_URL}/admin/giveaway/entries`, {
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        setGiveaway(data.giveaway);
        setEntries(data.entries);
      });

    fetch(`${import.meta.env.VITE_API_URL}/giveaway/winners`)
      .then((res) => res.json())
      .then(setWinners);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageFileSelected = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to upload image.");
        return;
      }

      setNewImage(data.imageUrl);
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const downloadEntriesCsv = () => {
    if (!entries.length) {
      toast.info("There are no entries to download yet.");
      return;
    }

    const header = ["Name", "Email", "Phone", "Address", "Account Type"];

    const rows = entries.map((entry) => [
      entry.name,
      entry.email,
      entry.phone,
      entry.address,
      entry.user ? "Registered" : "Guest",
    ]);

    const escapeCell = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");

    // Prefix with a UTF-8 BOM so Excel opens accented characters correctly.
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `giveaway-entries-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startNewGiveaway = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const body = useExisting
        ? { existingProductId }
        : { name: newName, description: newDescription, image: newImage };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/giveaway`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("This week's giveaway is live!");

      setNewName("");
      setNewDescription("");
      setNewImage("");
      setExistingProductId("");

      fetchAll();

    } catch {

      toast.error("Failed to start giveaway.");

    } finally {

      setIsSaving(false);

    }
  };

  const announceWinner = async (e) => {
    e.preventDefault();
    setIsAnnouncing(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/giveaway/announce-winner`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            entryId: winnerEntryId,
            comment: winnerComment,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(
        "Winner announced! Registered winners got the prize in My Orders, guests got an email. Set up next week's giveaway below."
      );

      setWinnerEntryId("");
      setWinnerComment("");

      fetchAll();

    } catch {

      toast.error("Failed to announce winner.");

    } finally {

      setIsAnnouncing(false);

    }
  };

  return (
    <section className="giveaway-manager">
      <h2>Weekly Giveaway</h2>

      <div className="giveaway-admin-grid">

        <div className="giveaway-admin-card">
          <h3>{giveaway ? "Current Giveaway" : "Start This Week's Giveaway"}</h3>

          {giveaway ? (
            <div className="giveaway-admin-current">
              <img src={giveaway.product.image} alt={giveaway.product.name} />
              <div>
                <strong>{giveaway.product.name}</strong>
                <p>
                  Draw on{" "}
                  {new Date(giveaway.weekEnd).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>{entries.length} entries so far</p>
              </div>
            </div>
          ) : (
            <form onSubmit={startNewGiveaway} className="giveaway-admin-form">

              <div className="giveaway-admin-toggle">
                <button
                  type="button"
                  className={useExisting ? "active" : ""}
                  onClick={() => setUseExisting(true)}
                >
                  Existing Product
                </button>
                <button
                  type="button"
                  className={!useExisting ? "active" : ""}
                  onClick={() => setUseExisting(false)}
                >
                  New Product
                </button>
              </div>

              {useExisting ? (
                <select
                  value={existingProductId}
                  onChange={(e) => setExistingProductId(e.target.value)}
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Giveaway Product Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />

                  <label className="giveaway-image-upload">

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageFileSelected}
                    />

                    {newImage
                      ? "Change Image"
                      : isUploadingImage
                        ? "Uploading..."
                        : "📷 Choose Image"}

                  </label>

                  {newImage && (
                    <div className="giveaway-image-preview">
                      <img src={newImage} alt="Giveaway prize preview" />
                    </div>
                  )}

                  <textarea
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </>
              )}

              <button
                type="submit"
                disabled={isSaving || isUploadingImage || (!useExisting && !newImage)}
              >
                {isSaving ? "Starting..." : "Start Giveaway"}
              </button>
            </form>
          )}
        </div>

        {giveaway && (
          <div className="giveaway-admin-card">
            <h3>Announce Winner</h3>

            <form onSubmit={announceWinner} className="giveaway-admin-form">
              <select
                value={winnerEntryId}
                onChange={(e) => setWinnerEntryId(e.target.value)}
                required
              >
                <option value="">Select the winning entry...</option>
                {entries.map((entry) => (
                  <option key={entry._id} value={entry._id}>
                    {entry.name} — {entry.email}
                    {entry.user ? " (registered)" : " (guest)"}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Winner comment (optional)"
                value={winnerComment}
                onChange={(e) => setWinnerComment(e.target.value)}
              />

              <p className="giveaway-admin-hint">
                Registered entrants get the prize added to their My Orders
                automatically. Guest entrants get a congratulations email
                instead.
              </p>

              <button type="submit" disabled={isAnnouncing}>
                {isAnnouncing ? "Announcing..." : "Announce Winner"}
              </button>
            </form>
          </div>
        )}

      </div>

      {giveaway && (
        <div className="giveaway-admin-card">
          <div className="giveaway-admin-card-header">
            <h3>This Week's Entries ({entries.length})</h3>

            <button
              type="button"
              className="giveaway-download-btn"
              onClick={downloadEntriesCsv}
              disabled={entries.length === 0}
            >
              ⬇ Download Entries
            </button>
          </div>

          <div className="giveaway-entries-table">
            {entries.length === 0 ? (
              <p>No entries yet.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry._id} className="giveaway-entry-row">
                  <strong>
                    {entry.name}
                    {entry.user ? " 👤" : ""}
                  </strong>
                  <span>{entry.email}</span>
                  <span>{entry.phone}</span>
                  <span>{entry.address}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="giveaway-admin-card">
        <h3>Previous Winners</h3>

        <div className="giveaway-entries-table">
          {winners.length === 0 ? (
            <p>No winners announced yet.</p>
          ) : (
            winners.map((winner) => (
              <div key={winner._id} className="giveaway-entry-row">
                <strong>{winner.name}</strong>
                <span>{winner.productName}</span>
                <span>
                  {new Date(winner.announcedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </section>
  );
}

export default GiveawayManager;
