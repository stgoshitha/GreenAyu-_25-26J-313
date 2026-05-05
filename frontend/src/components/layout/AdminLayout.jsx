import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Search
} from "lucide-react";
import { AuthContext } from "../../App";

export default function AdminLayout({ children }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Manage Packages", path: "/admin/packages", icon: <Box size={20} /> },
    { name: "Package Requests", path: "/admin/requests", icon: <Users size={20} /> },
  ];

  return (
    <div style={layoutContainer}>
      {/* Sidebar */}
      <aside style={{ ...sidebarStyle, width: isExpanded ? "260px" : "80px" }}>
        <div style={logoSection}>
          <img src="/greenayu.png" alt="Logo" style={logoStyle} />
          {isExpanded && <span style={brandName}>GreenAyu Admin</span>}
        </div>

        <nav style={navStyle}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...navItem,
                backgroundColor: location.pathname === item.path ? "#f1f5f9" : "transparent",
                color: location.pathname === item.path ? "#0f172a" : "#64748b",
              }}
            >
              <div style={iconWrapper}>{item.icon}</div>
              {isExpanded && <span style={navText}>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div style={sidebarFooter}>
          <button onClick={handleLogout} style={logoutBtn}>
            <div style={iconWrapper}><LogOut size={20} /></div>
            {isExpanded && <span style={navText}>Logout</span>}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={toggleBtn}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={mainContent}>
        {/* Top Navbar */}
        <header style={topHeader}>
          <div style={headerLeft}>
            <h1 style={pageTitle}>
              {menuItems.find(m => m.path === location.pathname)?.name || "Admin"}
            </h1>
          </div>
          <div style={headerRight}>
            <div style={searchBar}>
              <Search size={18} color="#94a3b8" />
              <input type="text" placeholder="Search..." style={searchInput} />
            </div>
            <button style={actionIcon}><Bell size={20} /></button>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div style={userProfile}>
                <div style={avatar}>{auth.user?.name?.[0] || "A"}</div>
                <div style={userInfo}>
                  <span style={userName}>{auth.user?.name}</span>
                  <span style={userRole}>Administrator</span>
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Content */}
        <div style={contentBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

const layoutContainer = { display: "flex", height: "100vh", background: "#f8fafc", overflow: "hidden" };

const sidebarStyle = {
  background: "white",
  borderRight: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  transition: "width 0.3s ease",
  zIndex: 100
};

const logoSection = {
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  borderBottom: "1px solid #f1f5f9"
};

const logoStyle = { width: "32px", height: "32px", borderRadius: "8px" };
const brandName = { fontSize: "18px", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap" };

const navStyle = { flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px" };

const navItem = {
  display: "flex",
  alignItems: "center",
  padding: "12px",
  borderRadius: "12px",
  textDecoration: "none",
  transition: "all 0.2s"
};

const iconWrapper = { width: "40px", display: "flex", justifyContent: "center" };
const navText = { fontSize: "14px", fontWeight: 600 };

const sidebarFooter = { padding: "12px", borderTop: "1px solid #f1f5f9", position: "relative" };

const logoutBtn = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "none",
  color: "#ef4444",
  cursor: "pointer",
  transition: "all 0.2s"
};

const toggleBtn = {
  position: "absolute",
  top: "-20px",
  right: "-12px",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  background: "white",
  border: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};

const mainContent = { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" };

const topHeader = {
  height: "80px",
  background: "white",
  borderBottom: "1px solid #e2e8f0",
  padding: "0 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const headerLeft = { display: "flex", alignItems: "center", gap: "20px" };
const pageTitle = { fontSize: "20px", fontWeight: 800, color: "#0f172a" };

const headerRight = { display: "flex", alignItems: "center", gap: "24px" };

const searchBar = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#f1f5f9",
  padding: "8px 16px",
  borderRadius: "100px",
  width: "260px"
};

const searchInput = {
  border: "none",
  background: "none",
  outline: "none",
  fontSize: "14px",
  width: "100%"
};

const actionIcon = {
  background: "none",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "10px"
};

const userProfile = { display: "flex", alignItems: "center", gap: "12px" };
const avatar = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "#22c55e",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: 700
};

const userInfo = { display: "flex", flexDirection: "column" };
const userName = { fontSize: "14px", fontWeight: 700, color: "#0f172a" };
const userRole = { fontSize: "12px", color: "#64748b" };

const contentBody = { flex: 1, overflowY: "auto", padding: "32px" };
