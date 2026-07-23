function ContactRequestsManager({

    requests,

    categoryFilter,
    setCategoryFilter,

    statusFilter,
    setStatusFilter,

    requestSearch,
    setRequestSearch,

    updateRequestStatus,

}) {

    const filteredRequests = requests.filter(request => {

        const matchesSearch =

            request.name.toLowerCase().includes(requestSearch.toLowerCase()) ||

            request.email.toLowerCase().includes(requestSearch.toLowerCase());

        const matchesCategory =

            categoryFilter === "All" ||

            request.category === categoryFilter;

        const matchesStatus =

            statusFilter === "All" ||

            request.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;

    });

    return (

        <section className="contact-requests-manager">

            <h2>

                Contact Requests

            </h2>

            <div className="product-toolbar">

                <input

                    type="text"

                    placeholder="Search by name or email..."

                    value={requestSearch}

                    onChange={(e) =>

                        setRequestSearch(e.target.value)

                    }

                />

                <select

                    value={categoryFilter}

                    onChange={(e) =>

                        setCategoryFilter(e.target.value)

                    }

                >

                    <option>All</option>

                    <option>Custom Order</option>

                    <option>Shipping</option>

                    <option>Return</option>

                    <option>General Inquiry</option>

                    <option>Other</option>

                </select>

                <select

                    value={statusFilter}

                    onChange={(e) =>

                        setStatusFilter(e.target.value)

                    }

                >

                    <option>All</option>

                    <option>New</option>

                    <option>Reviewed</option>

                    <option>Flagged</option>

                </select>

            </div>

            <div className="contact-requests-list">

                {

                    filteredRequests.length === 0

                        ?

                        <p className="no-requests-text">

                            No requests match this filter.

                        </p>

                        :

                        filteredRequests.map(request => (

                            <div

                                key={request._id}

                                className={`contact-request-card ${request.status.toLowerCase()}`}

                            >

                                <div className="contact-request-top">

                                    <div>

                                        <span className="contact-request-category">

                                            {request.category}

                                        </span>

                                        <h3>

                                            {request.name}

                                        </h3>

                                        <p className="contact-request-email">

                                            {request.email}

                                        </p>

                                    </div>

                                    <span className={`contact-request-status ${request.status.toLowerCase()}`}>

                                        {request.status}

                                    </span>

                                </div>

                                <p className="contact-request-message">

                                    {request.message}

                                </p>

                                <div className="contact-request-footer">

                                    <span>

                                        {

                                            new Date(request.createdAt).toLocaleDateString(

                                                "en-GB",

                                                {

                                                    day: "numeric",

                                                    month: "short",

                                                    year: "numeric",

                                                }

                                            )

                                        }

                                    </span>

                                    <div className="contact-request-actions">

                                        {

                                            request.status !== "Reviewed" && (

                                                <button

                                                    className="mark-reviewed-btn"

                                                    onClick={() =>

                                                        updateRequestStatus(request._id, "Reviewed")

                                                    }

                                                >

                                                    ✓ Mark Reviewed

                                                </button>

                                            )

                                        }

                                        {

                                            request.status !== "Flagged" && (

                                                <button

                                                    className="flag-request-btn"

                                                    onClick={() =>

                                                        updateRequestStatus(request._id, "Flagged")

                                                    }

                                                >

                                                    🚩 Flag

                                                </button>

                                            )

                                        }

                                        {

                                            request.status !== "New" && (

                                                <button

                                                    className="reset-status-btn"

                                                    onClick={() =>

                                                        updateRequestStatus(request._id, "New")

                                                    }

                                                >

                                                    Reset

                                                </button>

                                            )

                                        }

                                    </div>

                                </div>

                            </div>

                        ))

                }

            </div>

        </section>

    );

}

export default ContactRequestsManager;