const STEPS = ["pending", "processing", "packed", "shipped", "delivered"];

const LABELS = {
    pending: "Pending",
    processing: "Processing",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
};

function DeliveryTimeline({ status }) {

    if (status === "cancelled") {

        return (

            <div className="timeline timeline-cancelled">

                <span>This order was cancelled</span>

            </div>

        );

    }

    const currentIndex = STEPS.indexOf(status);

    return (

        <div className="timeline">

            {

                STEPS.map((step, index) => (

                    <div
                        key={step}
                        className={`timeline-item ${index === currentIndex ? "current" : "faded"}`}
                    >

                        <div className="timeline-node">

                            <div className={`timeline-circle ${index === currentIndex ? "active" : ""}`}>

                                {index < currentIndex ? "✓" : index + 1}

                            </div>

                            {

                                index !== STEPS.length - 1 && (

                                    <div className="timeline-line" />

                                )

                            }

                        </div>

                        <span>{LABELS[step]}</span>

                    </div>

                ))

            }

        </div>

    );

}

export default DeliveryTimeline;