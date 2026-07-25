import { useEffect, useState } from "react";

function getTimeLeft(targetDate) {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function GiveawayCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="giveaway-countdown">
      <div className="giveaway-countdown-unit">
        <strong>{pad(timeLeft.days)}</strong>
        <span>Days</span>
      </div>
      <div className="giveaway-countdown-unit">
        <strong>{pad(timeLeft.hours)}</strong>
        <span>Hrs</span>
      </div>
      <div className="giveaway-countdown-unit">
        <strong>{pad(timeLeft.minutes)}</strong>
        <span>Mins</span>
      </div>
      <div className="giveaway-countdown-unit">
        <strong>{pad(timeLeft.seconds)}</strong>
        <span>Secs</span>
      </div>
    </div>
  );
}

export default GiveawayCountdown;
