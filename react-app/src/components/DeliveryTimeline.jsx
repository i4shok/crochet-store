function DeliveryTimeline({ status }) {

    const steps = [

        "Pending",

        "Processing",

        "Packed",

        "Shipped",

        "Delivered",

    ];

    const activeStep =
        steps.indexOf(status);

    return (

        <div className="timeline">

            {

                steps.map((step, index) => (

                    <div
                        key={step}
                        className="timeline-item"
                    >

                        <div className="timeline-node">

                            <div
                                className={`timeline-circle ${index <= activeStep
                                        ? "active"
                                        : ""
                                    }`}
                            >

                                {

                                    index <= activeStep

                                        ? "✓"

                                        : ""

                                }

                            </div>

                            {

                                index !== steps.length - 1 && (

                                    <div
                                        className={`timeline-line ${index < activeStep
                                                ? "active"
                                                : ""
                                            }`}
                                    />

                                )

                            }

                        </div>

                        <span>

                            {step}

                        </span>

                    </div>

                ))

            }

        </div>

    );

}

export default DeliveryTimeline;