import React from "react";
import "./Dashboard.css"

const DashboardLayout = ({ user, children }) => {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <img src={user.image} className="sidebar-avatar" alt="User" />
        <h3>{user.name}</h3>
        <p>{user.role}</p>

        <ul className="sidebar-menu">
          <li>🏠 Dashboard</li>
          {user.role === "Admin" && <li>👥 Users</li>}
          {user.role !== "Customer" && <li>📊 Reports</li>}
          <li>⚙ Settings</li>
        </ul>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
};

export default DashboardLayout;
