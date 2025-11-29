import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, UserCircle2, LogOut, Sparkles, 
  ChevronDown, Activity, Zap, BarChart3, 
  Clock, Microscope 
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
  { to: "/features/identify-health", label: "Identify & Health", icon: <Activity size={16} />, desc: "Disease & species check" },
  { to: "/features/fertilizer", label: "Fertilizer Mix", icon: <Zap size={16} />, desc: "Growth optimization" },
  { to: "/features/yield", label: "Yield Forecast", icon: <BarChart3 size={16} />, desc: "Harvest projections" },
  { to: "/features/shelf-life", label: "Stability Analysis", icon: <Clock size={16} />, desc: "Potency retention" },
  { to: "/features/parts-quality", label: "Quality Grade", icon: <Microscope size={16} />, desc: "Specimen grading" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const userLabel = useMemo(() => auth?.user?.name || auth?.user?.email || "Account", [auth]);

  function onLogout() {
    auth?.logout?.();
    navigate("/");
    setOpen(false);
  }

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .auth-desktop { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 1025px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>

      <header style={headerWrapper}>
        <Container>
          <div style={headerInner}>
            
            <Link to="/" className="brand" onClick={() => setOpen(false)} style={brandContainer}>
              <div style={logoWrapper}>
                <img 
                  src="/greenayu.jpeg" 
                  alt="GreenAyu Logo" 
                  style={logoImage} 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/40?text=GA"; }}
                />
              </div>
              <div style={brandTextGroup}>
                <span style={brandMain}>Green<span style={{ color: "#22c55e" }}>Ayu</span></span>
                <span style={brandSub}>
                  <Sparkles size={10} style={{ marginRight: 4 }} /> Medicinal Quality
                </span>
              </div>
            </Link>

            <nav className="nav-desktop" style={desktopNav}>
              {nav.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  style={({ isActive }) => ({ ...navLink, color: isActive ? "#22c55e" : "#64748b" })}
                >
                  {item.label}
                </NavLink>
              ))}

              <div 
                style={dropdownTriggerArea}
                onMouseEnter={() => setShowFeatures(true)}
                onMouseLeave={() => setShowFeatures(false)}
              >
                <div style={{ ...navLink, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', height: '100%' }}>
                  AI Features 
                  <ChevronDown size={14} style={{ transform: showFeatures ? 'rotate(180deg)' : 'none', transition: '0.3s ease' }} />
                </div>

                <AnimatePresence>
                  {showFeatures && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      style={dropdownContainer}
                    >
                      <div style={dropdownHeader}>Agricultural AI Suite</div>
                      <div style={dropdownGrid}>
                        {features.map((f) => (
                          <Link key={f.to} to={f.to} style={dropdownItem} onClick={() => setShowFeatures(false)}>
                            <div style={itemIcon}>{f.icon}</div>
                            <div>
                              <div style={itemLabel}>{f.label}</div>
                              <div style={itemDesc}>{f.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div style={actionGroup}>
              <div className="auth-desktop">
                {auth?.isAuthed ? (
                  <div style={userChip}>
                    <UserCircle2 size={20} color="#064e3b" />
                    <span style={userName}>{userLabel}</span>
                    <button onClick={onLogout} style={logoutBtn}><LogOut size={16} /></button>
                  </div>
                ) : (
                  <div style={authButtonsStyle}>
                    <Link to="/login" style={loginBtn}>Login</Link>
                    <Link to="/register" style={registerBtn}>Get Started</Link>
                  </div>
                )}
              </div>

              <button className="mobile-toggle" style={mobileMenuToggle} onClick={() => setOpen(!open)}>
                {open ? <X size={28} color="#0f172a" /> : <Menu size={28} color="#0f172a" />}
              </button>
            </div>
          </div>
        </Container>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "calc(100vh - 80px)", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={mobileNavPanel}
            >
              <Container>
                <div style={{ padding: '20px 0 100px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {nav.map((item) => (
                    <NavLink 
                      key={item.to} 
                      to={item.to} 
                      style={({ isActive }) => ({ ...mobileNavLink, color: isActive ? "#22c55e" : "#1e293b" })}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  
                  <div style={mobileDivider} />
                  
                  <div style={{...dropdownHeader, padding: '10px 0'}}>AI Features</div>
                  <div style={mobileFeaturesGrid}>
                    {features.map((f) => (
                      <Link key={f.to} to={f.to} style={mobileFeatureItem} onClick={() => setOpen(false)}>
                        <div style={itemIcon}>{f.icon}</div>
                        <span style={{fontWeight: 600}}>{f.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div style={mobileDivider} />

                  <div style={{ marginTop: '20px' }}>
                    {auth?.isAuthed ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{...userChip, justifyContent: 'center'}}>
                           <UserCircle2 size={20} /> <span style={userName}>{userLabel}</span>
                        </div>
                        <button onClick={onLogout} style={{...registerBtn, background: '#ef4444'}}>Logout</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/register" style={{...registerBtn, textAlign: 'center'}} onClick={() => setOpen(false)}>Create Free Account</Link>
                        <Link to="/login" style={{...loginBtn, textAlign: 'center', padding: '12px'}} onClick={() => setOpen(false)}>Already have an account? Login</Link>
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

// --- Styles ---

const headerWrapper = {
  position: "sticky", top: 0, zIndex: 1000,
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid #f1f5f9",
};

const headerInner = { height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between" };

const brandContainer = { display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" };
const logoWrapper = { width: "42px", height: "42px", borderRadius: "10px", overflow: "hidden", border: "1px solid #f1f5f9" };
const logoImage = { width: "100%", height: "100%", objectFit: "cover" };
const brandMain = { fontSize: "20px", fontWeight: 900, color: "#0f172a" };
const brandSub = { fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" };
const brandTextGroup = { display: "flex", flexDirection: "column" };

const desktopNav = { display: "flex", alignItems: "center", gap: "28px" };
const navLink = { textDecoration: "none", fontSize: "15px", fontWeight: 700, transition: "0.2s" };

const dropdownTriggerArea = { position: 'relative', height: '80px', display: 'flex', alignItems: 'center' };
const dropdownContainer = {
  position: "absolute", top: "80px", left: "-50px", width: "300px",
  background: "white", padding: "16px", borderRadius: "16px",
  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9",
};

const dropdownGrid = { display: 'flex', flexDirection: 'column', gap: '4px' };
const dropdownHeader = { fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" };
const dropdownItem = { display: "flex", gap: "12px", padding: "10px", borderRadius: "12px", textDecoration: "none", alignItems: 'center' };
const itemIcon = { width: "32px", height: "32px", background: "#f0fdf4", color: "#22c55e", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" };
const itemLabel = { fontSize: "14px", fontWeight: 800, color: "#1e293b" };
const itemDesc = { fontSize: "12px", color: "#94a3b8" };

const actionGroup = { display: "flex", alignItems: "center", gap: "15px" };
const authButtonsStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
const userChip = { display: "flex", alignItems: "center", gap: "10px", padding: "6px 12px", background: "#f0fdf4", borderRadius: "100px", border: "1px solid #dcfce7" };
const userName = { fontSize: "14px", fontWeight: 800, color: "#064e3b" };
const logoutBtn = { border: "none", background: "none", cursor: "pointer", color: "#ef4444" };

const loginBtn = { textDecoration: "none", color: "#64748b", fontWeight: 800, fontSize: "14px" };
const registerBtn = { textDecoration: "none", background: "#0f172a", color: "white", padding: "10px 20px", borderRadius: "10px", fontWeight: 800, fontSize: "14px" };

const mobileMenuToggle = { background: "none", border: "none", cursor: "pointer", padding: "5px" };
const mobileNavPanel = { 
  position: "fixed", top: "80px", left: 0, right: 0, bottom: 0, 
  background: "white", zIndex: 999, overflowY: "auto" 
};
const mobileNavLink = { display: "block", padding: "15px 0", textDecoration: "none", fontWeight: 800, fontSize: "20px", borderBottom: '1px solid #f8fafc' };
const mobileDivider = { height: "1px", background: "#f1f5f9", margin: "20px 0" };
const mobileFeaturesGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' };
const mobileFeatureItem = { 
  display: 'flex', flexDirection: 'column', gap: '8px', padding: '15px', 
  background: '#f8fafc', borderRadius: '12px', textDecoration: 'none', color: '#1e293b' 
};