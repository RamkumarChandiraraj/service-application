import React, { useEffect, useState } from "react";
import { getDecodedUser } from "../../utils/jwtUtils";
import { getUserById } from "../../api/userApi";
import AlertToast from "../Common/AlertToast";
import LoadingPage from "../Common/LoadingPage";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const decoded = getDecodedUser();
        if (!decoded) {
          throw new Error("User not authenticated");
        }

        const userId = Number(decoded.nameid);
        const res = await getUserById(userId);
        const apiUser = res.data || res;

        setUser({
          name: apiUser.userName,
          email: apiUser.email,
          contact: apiUser.mobileNumber,
          role: decoded.role,
          id: apiUser.id,
          image: "/placeholder-user.png",
          status: apiUser.isActive ? "Active" : "Inactive",
        });

        // ✅ success toast
        setToast({
          show: true,
          message: "Dashboard loaded successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Dashboard error:", error);

        // ❌ error toast
        setToast({
          show: true,
          message: "Failed to load dashboard data",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ GLOBAL LOADER
  if (loading) return <LoadingPage />;

  if (!user) return null;

  return (
    <>
      {/* 🔔 TOAST */}
      <AlertToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <img src={user.image} className="sidebar-avatar" alt="User" />
          <h3>{user.name}</h3>
          <p>{user.role}</p>

          <ul className="sidebar-menu">
            <li>🏠 Dashboard</li>
            <li>📊 Company</li>
            <li>⚙  Settings</li>
            <li>📩 Inbox</li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-main">
          {/* TOP STATS */}
          <div className="stats-row">
            <div className="stat-card green">
              <h4>Profile Completion</h4>
              <h1>75%</h1>
            </div>

            <div className="stat-card blue">
              <h4>User Status</h4>
              <h1>{user.status}</h1>
            </div>

            <div className="stat-card purple">
              <h4>User ID</h4>
              <h1>{user.id}</h1>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="details-row">
            <div className="info-card">
              <h4>Email</h4>
              <p>{user.email}</p>
            </div>

            <div className="info-card">
              <h4>Contact</h4>
              <p>{user.contact}</p>
            </div>

            <div className="info-card chart-placeholder">
              <h4>Activity</h4>
              <div className="fake-chart" />
            </div>

            <div className="info-card percent-card">
              <h4>Performance</h4>
              <h1>79%</h1>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
