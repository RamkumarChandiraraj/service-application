import { useState } from "react";
import { useAuth } from "../../Auth/AuthProvider";
import { ROLE_CONFIG } from "./roleConfig";
import "./Dashboard.css";

const DashboardSidebar = () => {
  const { auth } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!auth) return null;

  const roleConfig = ROLE_CONFIG[auth.role];

  return (
    <>
      {/* MOBILE TOGGLE */}
      <div
        className="dashboard-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </div>

      <aside className={`dashboard-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* PROFILE */}
        <div className="sidebar-profile">
          <img
            src="/placeholder-user.png"
            alt="User"
            className="sidebar-avatar"
          />
          <h3>{auth.unique_name}</h3>
          <p>{auth.role}</p>
        </div>

        {/* MENU */}
        <ul className="sidebar-menu">
          {roleConfig.menu.map((item, index) => (
            <li
              key={index}
              className={`sidebar-item ${
                openIndex === index ? "open" : ""
              }`}
            >
              <span onClick={() => setOpenIndex(index)}>
                {item.label}
              </span>

              {item.children && (
                <ul className="sidebar-submenu">
                  {item.children.map((child, i) => (
                    <li key={i}>{child}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default DashboardSidebar;
