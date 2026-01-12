import "./Dashboard.css";

const DashboardOverview = ({ role }) => {
  const overview = role?.overview || [];

  return (
    <div className="stats-row">
      {overview.map((item, index) => (
        <div
          key={index}
          className={`stat-card ${item.color || "default"}`}
        >
          <div className="stat-header">
            <span className="stat-icon">{item.icon}</span>
            <span className="stat-title">{item.title}</span>
          </div>

          <div className="stat-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardOverview;
