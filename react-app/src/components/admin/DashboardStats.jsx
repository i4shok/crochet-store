function DashboardStats({ stats }) {

  return (

    <section className="dashboard-stats">

      <h2>

        Dashboard Overview

      </h2>

      <div className="stats-grid">

        <div className="stat-card">

          <h3>

            Products

          </h3>

          <span>

            {stats.totalProducts}

          </span>

        </div>

        <div className="stat-card">

          <h3>

            Orders

          </h3>

          <span>

            {stats.totalOrders}

          </span>

        </div>

        <div className="stat-card">

          <h3>

            Revenue

          </h3>

          <span>

            ₹{stats.totalRevenue}

          </span>

        </div>

        <div className="stat-card">

          <h3>

            Users

          </h3>

          <span>

            {stats.totalUsers}

          </span>

        </div>

      </div>

    </section>

  );

}

export default DashboardStats;