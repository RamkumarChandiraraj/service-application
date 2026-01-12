const CustomerDashboard = ({ user }) => (
  <>
    <h2>Welcome back, {user.name}</h2>

    <div className="stats-row">
      <div className="stat-card green">
        <h4>Total Orders</h4>
        <h1>5</h1>
      </div>
      <div className="stat-card blue">
        <h4>Wallet Balance</h4>
        <h1>₹1,200</h1>
      </div>
      <div className="stat-card purple">
        <h4>Membership</h4>
        <h1>Gold</h1>
      </div>
    </div>
  </>
);

export default CustomerDashboard;
