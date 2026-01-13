export const ROLE_CONFIG = {
  /* ==================================================
     ADMIN
  ================================================== */
  Admin: {
    menu: [
      { label: "🏠 Dashboard", path: "/dashboard" },
      { label: "🏢 Company", children: ["Add Company", "Edit Company"] },
      { label: "👨‍💼 Employee", children: ["Add Employee", "Edit Employee"] },
      { label: "👥 Users", children: ["Add User", "Edit User"] },
      {
        label: "⚙ Settings",
        children: [
          "Edit Profile",
          "Privacy Policy",
          "Delete My Account",
          "Inbox",
        ],
      },
    ],

    overview: [
      {
        title: "Total Companies",
        value: "128",
        icon: "🏢",
        color: "blue",
      },
      {
        title: "Total Employees",
        value: "842",
        icon: "👨‍💼",
        color: "green",
      },
      {
        title: "Total Users",
        value: "2,431",
        icon: "👥",
        color: "purple",
      },
      {
        title: "Active Vendors",
        value: "312",
        icon: "⚡",
        color: "teal",
      },
      {
        title: "Pending Requests",
        value: "19",
        icon: "⏳",
        color: "red",
      },
      {
        title: "Reports Generated",
        value: "76",
        icon: "📊",
        color: "gold",
      },
    ],
  },

  /* ==================================================
     VENDOR
  ================================================== */
  Vendor: {
    menu: [
      { label: "🏠 Dashboard", path: "/dashboard" },
      { label: "🏢 Company", children: ["Add Company", "Edit Company"] },
      {
        label: "👨‍💼 Employee",
        children: ["Add Employee", "Edit Employee", "Assign Task"],
      },
      {
        label: "⚙ Settings",
        children: [
          "Edit Profile",
          "Privacy Policy",
          "Delete My Account",
          "Inbox",
        ],
      },
    ],

    overview: [
      {
        title: "My Companies",
        value: "4",
        icon: "🏢",
        color: "blue",
      },
      {
        title: "Employees",
        value: "28",
        icon: "👨‍💼",
        color: "green",
      },
      {
        title: "Assigned Tasks",
        value: "56",
        icon: "📝",
        color: "purple",
      },
      {
        title: "Completed Tasks",
        value: "41",
        icon: "✅",
        color: "teal",
      },
      {
        title: "Pending Tasks",
        value: "15",
        icon: "⏳",
        color: "red",
      },
      {
        title: "Inbox Messages",
        value: "6",
        icon: "📩",
        color: "gold",
      },
    ],
  },

  /* ==================================================
     EMPLOYEE
  ================================================== */
  Employee: {
    menu: [
      { label: "🏠 Dashboard", path: "/dashboard" },
      {
        label: "🏢 Company",
        children: ["Assigned Tasks", "Update Status"],
      },
      {
        label: "⚙ Settings",
        children: [
          "Edit Profile",
          "Privacy Policy",
          "Delete My Account",
          "Inbox",
        ],
      },
    ],

    overview: [
      {
        title: "Assigned Tasks",
        value: "12",
        icon: "📝",
        color: "blue",
      },
      {
        title: "Completed Tasks",
        value: "8",
        icon: "✅",
        color: "green",
      },
      {
        title: "Pending Tasks",
        value: "4",
        icon: "⏳",
        color: "red",
      },
      {
        title: "Performance",
        value: "82%",
        icon: "📈",
        color: "purple",
      },
      {
        title: "Company",
        value: "TechCorp",
        icon: "🏢",
        color: "teal",
      },
      {
        title: "Inbox Messages",
        value: "3",
        icon: "📩",
        color: "gold",
      },
    ],
  },

  /* ==================================================
     CUSTOMER
  ================================================== */
  Customer: {
    menu: [
      { label: "🏠 Dashboard", path: "/dashboard" },
      {
        label: "⚙ Settings",
        children: ["Edit Profile", "Privacy Policy", "Delete My Account"],
      },
      { label: "📩 Inbox", path: "/inbox" },
    ],

    overview: [
      {
        title: "My Orders",
        value: "5",
        icon: "📦",
        color: "green",
      },
      {
        title: "Active Services",
        value: "2",
        icon: "⚡",
        color: "blue",
      },
      {
        title: "Wallet Balance",
        value: "₹1,200",
        icon: "💰",
        color: "gold",
      },
      {
        title: "Membership",
        value: "Gold",
        icon: "👑",
        color: "purple",
      },
      {
        title: "Support Tickets",
        value: "1",
        icon: "🎧",
        color: "teal",
      },
      {
        title: "Last Login",
        value: "Today",
        icon: "🕒",
        color: "red",
      },
    ],
  },
};
