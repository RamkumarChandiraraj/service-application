import { useAuth } from "../../Auth/AuthProvider";
import { ROLE_CONFIG } from "./roleConfig";
import DashboardSidebar from "./DashboardSidebar";
import DashboardOverview from "./DashboardOverview";
import "./Dashboard.css";

const Dashboard = () => {
  const { auth } = useAuth();

  if (!auth) return null;

  const roleConfig = ROLE_CONFIG[auth.role];
  if (!roleConfig) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <DashboardSidebar />

        <main className="dashboard-main">
          <div className="dashboard-title">
            <h2>Welcome, {auth.unique_name || "User"}</h2>
            <p>Your dashboard overview</p>
          </div>

          {/* OVERVIEW CARDS */}
          <DashboardOverview role={roleConfig} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
