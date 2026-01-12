const VendorDashboard = ({ user }) => (
  <>
    <h2>Vendor Dashboard</h2>

    <div className="stats-row">
      <div className="stat-card green">
        <h4>Total Orders</h4>
        <h1>89</h1>
      </div>
      <div className="stat-card blue">
        <h4>Earnings</h4>
        <h1>₹45,200</h1>
      </div>
      <div className="stat-card purple">
        <h4>Status</h4>
        <h1>{user.status}</h1>
      </div>
    </div>
  </>
);

export default VendorDashboard;
