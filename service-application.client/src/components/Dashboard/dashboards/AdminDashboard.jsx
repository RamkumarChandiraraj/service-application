const AdminDashboard = ({ user }) => (
  <>
    <h2>Admin Overview</h2>

    <div className="stats-row">
      <div className="stat-card purple">
        <h4>Total Users</h4>
        <h1>1,248</h1>
      </div>
      <div className="stat-card blue">
        <h4>Active Vendors</h4>
        <h1>312</h1>
      </div>
      <div className="stat-card green">
        <h4>System Status</h4>
        <h1>{user.status}</h1>
      </div>
    </div>
  </>
);

export default AdminDashboard;
