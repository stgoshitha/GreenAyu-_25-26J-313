import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import API from "../services/api";
import { motion } from "framer-motion";
import Container from "../components/layout/Container";
import { User, Mail, Shield, CreditCard, History, Zap, Settings as SettingsIcon, LogOut } from "lucide-react";

export default function Profile() {
  const auth = React.useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/transactions/history');
        setHistory(res.data.data);
      } catch (err) {
        console.error("Error fetching history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    auth.refreshUser();
  }, []);

  return (
    <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>
      
      {/* ── HEADER ── */}
      <section style={{ position: "relative", padding: "100px 0 60px", background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "8px", color: "white" }}>
              Welcome back, <span style={{ color: "#22c55e" }}>{auth.user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>
              Manage your agricultural intelligence portal.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ display: "flex", gap: "12px" }}>
            <Link to="/settings" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 20px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", color: "white", fontSize: "14px", fontWeight: 700, textDecoration: "none", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
              <SettingsIcon size={16} /> Settings
            </Link>
            <button onClick={() => auth.logout()} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 20px", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "#ef4444"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}>
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        </Container>
      </section>

      {/* ── MAIN DASHBOARD CONTENT ── */}
      <section style={{ padding: "0 0 100px", position: "relative", zIndex: 2 }}>
        <Container>
          <div className="profile-grid" style={{ display: "grid", gap: "30px", alignItems: "start" }}>
            
            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              
              {/* Profile Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: "#0d170d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", justifyContent: "center", alignItems: "center", color: "#22c55e" }}>
                    <User size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "24px", fontWeight: 900, color: "white", marginBottom: "4px" }}>{auth.user?.name}</h3>
                    <div style={{ display: "inline-block", padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {auth.user?.role} Account
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ color: "rgba(255,255,255,0.3)" }}><Mail size={20} /></div>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>Email Address</div>
                      <div style={{ fontSize: "15px", color: "white", fontWeight: 600 }}>{auth.user?.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ color: "rgba(255,255,255,0.3)" }}><Shield size={20} /></div>
                    <div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>Account Status</div>
                      <div style={{ fontSize: "15px", color: "#22c55e", fontWeight: 800 }}>Verified</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Credits Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: "linear-gradient(145deg, #102410 0%, #060a06 100%)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "24px", padding: "32px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05, transform: "rotate(15deg)" }}>
                  <Zap size={150} color="#22c55e" />
                </div>
                
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>AI Balance</h3>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Available diagnostic credits</p>
                    </div>
                    <CreditCard size={28} color="#22c55e" />
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "32px" }}>
                    <span style={{ fontSize: "56px", fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>{auth.user?.tokens}</span>
                    <span style={{ fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>CR</span>
                  </div>

                  <Link to="/packages" style={{ display: "block", textAlign: "center", width: "100%", padding: "16px 0", background: "#22c55e", color: "#0a0e0a", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#16a34a"} onMouseLeave={(e) => e.currentTarget.style.background = "#22c55e"}>
                    Top Up Credits
                  </Link>
                </div>
              </motion.div>

            </div>

            {/* ── RIGHT COLUMN (HISTORY) ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: "#0d120d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", minHeight: "600px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <History size={24} color="#22c55e" />
                <h3 style={{ fontSize: "20px", fontWeight: 900, color: "white" }}>Transaction Ledger</h3>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>Syncing blockchain ledger...</div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
                  <CreditCard size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
                  <p>No transaction history found.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {history.map((tx) => {
                    const isSuccess = tx.status === "approved" || tx.status === "completed";
                    const isPending = tx.status === "pending";
                    return (
                      <div key={tx._id} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(34,197,94,0.1)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Zap size={18} color="#22c55e" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "white", marginBottom: "4px" }}>{tx.package?.name || "Custom Top-up"}</div>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{new Date(tx.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "16px", fontWeight: 900, color: "#22c55e", marginBottom: "4px" }}>+{tx.tokensAdded} CR</div>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>LKR {tx.amountPaid}</div>
                        </div>
                        <div style={{ 
                          padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px",
                          background: isSuccess ? "rgba(34,197,94,0.1)" : isPending ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)",
                          color: isSuccess ? "#22c55e" : isPending ? "#eab308" : "#ef4444"
                        }}>
                          {tx.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
            
          </div>
        </Container>
      </section>

      {/* Responsive Styles */}
      <style>{`
        .profile-grid { grid-template-columns: 1fr 2fr; }
        @media (max-width: 980px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
