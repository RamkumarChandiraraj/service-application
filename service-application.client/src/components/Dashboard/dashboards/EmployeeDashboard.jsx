const EmployeeDashboard = ({ user }) => (
  <>
    <h2>Employee Dashboard</h2>

    <div className="stats-row">
      <div className="stat-card blue">
        <h4>Tasks Assigned</h4>
        <h1>12</h1>
      </div>
      <div className="stat-card green">
        <h4>Completed</h4>
        <h1>8</h1>
      </div>
      <div className="stat-card purple">
        <h4>Performance</h4>
        <h1>82%</h1>
      </div>
    </div>
  </>
);

export default EmployeeDashboard;
