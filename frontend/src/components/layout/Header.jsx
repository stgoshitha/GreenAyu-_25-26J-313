import React, { useMemo, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, UserCircle2, LogOut, Sparkles,
  ChevronDown, Activity, Zap, BarChart3,
  Clock, Microscope, Gauge, MapPin, Settings, Leaf
} from "lucide-react";
import Container from "./Container";
import { AuthContext } from "../../App";

const nav = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const features = [
  { to: "/features/telemetry", label: "Telemetry Intelligence", icon: <Gauge size={16} />, desc: "Live sensor & weather hub" },
  { to: "/features/identify-health", label: "Botanical Diagnostic", icon: <Activity size={16} />, desc: "Plant ID & Health scan" },
  { to: "/features/parts-quality", label: "Product Identification & Grading", icon: <Microscope size={16} />, desc: "Gradient grading engine" },
  { to: "/features/dry-storage", label: "Smart Dry & Store", icon: <Clock size={16} />, desc: "Preservation AI lifecycle" },
  { to: "/features/yield-optimization", label: "Fertilizer Recommendation", icon: <BarChart3 size={16} />, desc: "NPK & weather forecast" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const userLabel = useMemo(() => auth?.user?.name || auth?.user?.email || "Account", [auth]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onLogout() {
    auth?.logout?.();
    navigate("/");
    setOpen(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .auth-desktop { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .mobile-toggle { display: none !important; }
        }
        .nav-link-hover:hover { color: #22c55e !important; }
        .dropdown-item-hover:hover { background: rgba(34,197,94,0.08) !important; }
        .feat-item-hover:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      <header style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(10, 14, 10, 0.97)" : "#0a0e0a",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)'}`,
        transition: "all 0.3s ease",
      }}>
        <Container>
          <div style={{ height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Brand */}
            <Link to="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", overflow: "hidden", display: "grid", placeItems: "center", boxShadow: "0 0 20px rgba(34,197,94,0.15)" }}>
                <img src="/greenayu.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontSize: "18px", fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>
                  Green<span style={{ color: "#22c55e" }}>Ayu</span>
                </span>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(34,197,94,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "2px" }}>
                  Agriculture
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className="nav-link-hover"
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isActive ? "#22c55e" : "rgba(255,255,255,0.65)",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: isActive ? "rgba(34,197,94,0.08)" : "transparent",
                    transition: "all 0.2s ease",
                  })}
                >
                  {item.label}
                </NavLink>
              ))}

              {/* AI Features Dropdown */}
              <div
                style={{ position: "relative", height: "72px", display: "flex", alignItems: "center" }}
                onMouseEnter={() => setShowFeatures(true)}
                onMouseLeave={() => setShowFeatures(false)}
              >
                <div className="nav-link-hover" style={{
                  display: "flex", alignItems: "center", gap: "4px", cursor: "pointer",
                  fontSize: "14px", fontWeight: 600, color: showFeatures ? "#22c55e" : "rgba(255,255,255,0.65)",
                  padding: "8px 14px", borderRadius: "8px",
                  background: showFeatures ? "rgba(34,197,94,0.08)" : "transparent",
                  transition: "all 0.2s ease",
                }}>
                  AI Features
                  <ChevronDown size={14} style={{ transform: showFeatures ? "rotate(180deg)" : "none", transition: "0.3s ease" }} />
                </div>

                <AnimatePresence>
                  {showFeatures && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute", top: "72px", left: "-20px", width: "280px",
                        background: "#111811", padding: "12px", borderRadius: "16px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.15)",
                      }}
                    >
                      <div style={{ fontSize: "10px", fontWeight: 800, color: "rgba(34,197,94,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", padding: "8px 12px 12px" }}>
                        AI Tools Suite
                      </div>
                      {features.map((f) => (
                        <Link
                          key={f.to}
                          to={f.to}
                          className="feat-item-hover"
                          onClick={() => setShowFeatures(false)}
                          style={{
                            display: "flex", gap: "12px", padding: "10px 12px",
                            borderRadius: "10px", textDecoration: "none", alignItems: "center",
                            transition: "background 0.2s",
                          }}
                        >
                          <div style={{ width: "32px", height: "32px", background: "rgba(34,197,94,0.1)", color: "#22c55e", borderRadius: "8px", display: "grid", placeItems: "center", flexShrink: 0 }}>
                            {f.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "2px" }}>{f.label}</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{f.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Auth Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="auth-desktop">
                {auth?.isAuthed ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Tokens */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "rgba(34,197,94,0.1)", borderRadius: "20px", border: "1px solid rgba(34,197,94,0.2)" }}>
                      <Zap size={13} color="#22c55e" fill="#22c55e" />
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#22c55e" }}>{auth.user?.tokens || 0}</span>
                    </div>
                    {/* Location */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <MapPin size={12} color="rgba(255,255,255,0.4)" />
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{auth.user?.location?.city || "Colombo"}</span>
                    </div>
                    {/* User */}
                    <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <UserCircle2 size={18} color="#22c55e" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "white" }}>{userLabel}</span>
                    </Link>
                    <Link to="/settings" style={{ width: "36px", height: "36px", display: "grid", placeItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                      <Settings size={16} />
                    </Link>
                    <button onClick={onLogout} style={{ width: "36px", height: "36px", display: "grid", placeItems: "center", background: "rgba(239,68,68,0.1)", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer" }}>
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Link to="/login" style={{ textDecoration: "none", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: "14px", padding: "8px 14px" }}>
                      Login
                    </Link>
                    <Link to="/register" style={{ textDecoration: "none", background: "#22c55e", color: "#0a0e0a", padding: "10px 20px", borderRadius: "10px", fontWeight: 800, fontSize: "14px", boxShadow: "0 0 20px rgba(34,197,94,0.3)" }}>
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              <button className="mobile-toggle" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "white", display: "none", alignItems: "center" }} onClick={() => setOpen(!open)}>
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Nav */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", background: "#0d120d", borderTop: "1px solid rgba(34,197,94,0.1)" }}
            >
              <Container>
                <div style={{ padding: "24px 0 40px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {nav.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      style={({ isActive }) => ({
                        textDecoration: "none", fontSize: "18px", fontWeight: 700,
                        color: isActive ? "#22c55e" : "rgba(255,255,255,0.7)",
                        padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                      })}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}

                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: "rgba(34,197,94,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px" }}>AI Features</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {features.map((f) => (
                        <Link key={f.to} to={f.to}
                          style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.06)" }}
                          onClick={() => setOpen(false)}>
                          <div style={{ color: "#22c55e" }}>{f.icon}</div>
                          <span style={{ fontWeight: 600, fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>{f.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: "24px" }}>
                    {auth?.isAuthed ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", background: "rgba(34,197,94,0.08)", borderRadius: "12px", textDecoration: "none", border: "1px solid rgba(34,197,94,0.15)" }} onClick={() => setOpen(false)}>
                          <UserCircle2 size={20} color="#22c55e" />
                          <span style={{ fontWeight: 700, color: "white" }}>{userLabel}</span>
                        </Link>
                        <button onClick={onLogout} style={{ padding: "14px", background: "rgba(239,68,68,0.08)", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Link to="/register" style={{ textAlign: "center", padding: "14px", background: "#22c55e", borderRadius: "12px", textDecoration: "none", color: "#0a0e0a", fontWeight: 800, fontSize: "15px" }} onClick={() => setOpen(false)}>Create Free Account</Link>
                        <Link to="/login" style={{ textAlign: "center", padding: "14px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", textDecoration: "none", color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: "15px", border: "1px solid rgba(255,255,255,0.08)" }} onClick={() => setOpen(false)}>Login</Link>
                      </div>
                    )}
                  </div>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}