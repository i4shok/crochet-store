import { toast } from "react-toastify";

// Draws a 1080x1920 "story" style card (like a Spotify/YT Music share card):
// product image on top, GIVEAWAY wordmark, and a "Take part" link underneath.
// Uses the Web Share API when available (mobile), otherwise downloads a PNG.
async function generateShareCard(product) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");

  // background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1b1730");
  gradient.addColorStop(1, "#0d0b17");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // product image, center-cropped square with rounded corners
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = product.image;
  }).catch(() => null);

  const boxSize = 760;
  const boxX = (canvas.width - boxSize) / 2;
  const boxY = 260;
  const radius = 40;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(boxX + radius, boxY);
  ctx.arcTo(boxX + boxSize, boxY, boxX + boxSize, boxY + boxSize, radius);
  ctx.arcTo(boxX + boxSize, boxY + boxSize, boxX, boxY + boxSize, radius);
  ctx.arcTo(boxX, boxY + boxSize, boxX, boxY, radius);
  ctx.arcTo(boxX, boxY, boxX + boxSize, boxY, radius);
  ctx.closePath();
  ctx.clip();

  if (img.complete && img.naturalWidth > 0) {
    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;
    ctx.drawImage(img, sx, sy, side, side, boxX, boxY, boxSize, boxSize);
  } else {
    ctx.fillStyle = "#2a2540";
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
  }

  ctx.restore();

  // "GIVEAWAY" wordmark
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 96px Poppins, Arial, sans-serif";
  ctx.fillText("GIVEAWAY", canvas.width / 2, boxY + boxSize + 150);

  ctx.fillStyle = "#9b82ff";
  ctx.font = "700 34px Poppins, Arial, sans-serif";
  ctx.fillText(product.name || "", canvas.width / 2, boxY + boxSize + 210);

  // "Take part" link
  ctx.fillStyle = "#c9bdff";
  ctx.font = "600 40px Nunito, Arial, sans-serif";
  ctx.fillText("Take part →", canvas.width / 2, boxY + boxSize + 320);

  ctx.fillStyle = "#8f88a8";
  ctx.font = "400 28px Nunito, Arial, sans-serif";
  ctx.fillText(
    `${window.location.origin}/giveaway`,
    canvas.width / 2,
    boxY + boxSize + 370
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

async function shareGiveaway(product) {
  try {
    const blob = await generateShareCard(product);

    if (!blob) {
      toast.error("Couldn't generate the share card.");
      return;
    }

    const file = new File([blob], "giveaway.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "GIVEAWAY",
        text: `Take part in this week's giveaway — ${product.name}!`,
        url: `${window.location.origin}/giveaway`,
      });
      return;
    }

    // fallback: download the image so it can be shared manually
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "giveaway.png";
    link.click();
    URL.revokeObjectURL(url);

    toast.info("Card downloaded — share it to your story!");

  } catch {

    toast.error("Couldn't share right now, please try again.");

  }
}

function GiveawayShareCard({ product }) {
  return (
    <button
      type="button"
      className="giveaway-share-btn"
      onClick={() => shareGiveaway(product)}
    >
      📤 Share Giveaway
    </button>
  );
}

export default GiveawayShareCard;
