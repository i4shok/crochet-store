const STEPS = ["pending", "processing", "packed", "shipped", "delivered"];

const LABELS = {
    pending: "Pending",
    processing: "Processing",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
};

function DeliveryTimeline({ status, reason }) {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "cancelled") {
        return (
            <div className="timeline-cancelled-wrapper">
                <div className="timeline timeline-cancelled-journey">
                    <div className="timeline-item">
                        <div className="timeline-node">
                            <div className="timeline-circle cancelled-circle">
                                ✕
                            </div>
                        </div>
                        <span className="cancelled-label">Order Cancelled</span>
                    </div>
                </div>
                {reason && (
                    <p className="cancelled-reason-text">{reason}</p>
                )}
            </div>
        );
    }

    const currentIndex = STEPS.indexOf(normalizedStatus);
    const isDelivered = normalizedStatus === "delivered";

    return (
        <div className="timeline">
            {STEPS.map((step, index) => {
                const isCompleted = index < currentIndex || (isDelivered && index === currentIndex);
                const isCurrent = index === currentIndex && !isDelivered;

                return (
                    <div
                        key={step}
                        className={`timeline-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${!isCompleted && !isCurrent ? "faded" : ""}`}
                    >
                        <div className="timeline-node">
                            <div className={`timeline-circle ${isCompleted ? "completed" : ""} ${isCurrent ? "active" : ""}`}>
                                {isCompleted ? "✓" : index + 1}
                            </div>

                            {index !== STEPS.length - 1 && (
                                <div className={`timeline-line ${isCompleted ? "filled" : ""}`} />
                            )}
                        </div>

                        <span>{LABELS[step]}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default DeliveryTimeline;