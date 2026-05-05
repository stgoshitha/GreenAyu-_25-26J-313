import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Shield, Zap, Activity } from "lucide-react";
import Container from "../components/layout/Container";
import API from "../services/api";
import { AuthContext } from "../App";
import Swal from "sweetalert2";

export default function Packages() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await API.get('/packages');
        setPlans(res.data.data);
      } catch (err) {
        console.error("Error fetching packages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handlePurchase = async (pkgId) => {
    if (!auth.isAuthed) {
      navigate("/login");
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Send Package Request?',
      text: "A request will be sent to the Admin for approval. You will receive credits after confirmation.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      confirmButtonText: 'Yes, Send Request',
      cancelButtonText: 'Cancel',
      background: "#0d120d",
      color: "#fff",
    });

    if (isConfirmed) {
      try {
        const res = await API.post(`/transactions/purchase/${pkgId}`);
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Request Sent',
            text: 'Your package request has been sent to the Admin. Please wait for confirmation.',
            confirmButtonColor: '#22c55e',
            background: "#0d120d",
            color: "#fff"
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: err.response?.data?.message || 'Could not process request',
          confirmButtonColor: '#ef4444',
          background: "#0d120d",
          color: "#fff"
        });
      }
    }
  };

  return (
    <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>
      
      {/* ── HEADER ── */}
      <section style={{ position: "relative", padding: "100px 0 60px", background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
            <Activity size={14} color="#22c55e" />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e" }}>Transparent Pricing</span>
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 60px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "20px", color: "white" }}>
            Invest in Your Farm's Future
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.6 }}>
            Pay-as-you-go AI intelligence. Choose a token package that matches your cultivation volume.
          </p>
        </Container>
      </section>

      {/* ── PACKAGES GRID ── */}
      <section style={{ padding: "60px 0 120px" }}>
        <Container>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{ color: "#22c55e", fontWeight: 700 }}>Loading packages...</div>
            </div>
          ) : plans.length === 0 ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "40px" }}>No packages available right now.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", maxWidth: "1000px", margin: "0 auto" }}>
              {plans.map((pkg, i) => {
                const isPopular = i === 1; // Highlight the second package as popular usually
                
                return (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ position: "relative", padding: "48px 36px", background: isPopular ? "#0d1a0d" : "#0d120d", borderRadius: "24px", border: isPopular ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.07)", boxShadow: isPopular ? "0 0 40px rgba(34,197,94,0.15)" : "none", display: "flex", flexDirection: "column" }}
                  >
                    {isPopular && (
                      <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", padding: "6px 20px", background: "#22c55e", borderRadius: "100px", fontSize: "12px", fontWeight: 800, color: "#0a0e0a", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
                        Most Popular
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      {isPopular ? <Zap size={20} color="#22c55e" /> : <Shield size={20} color="rgba(255,255,255,0.3)" />}
                      <div style={{ fontSize: "14px", fontWeight: 800, color: isPopular ? "#22c55e" : "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px" }}>
                        {pkg.name}
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>LKR</span>
                      <span style={{ fontSize: "clamp(36px, 5vw, 48px)", fontWeight: 900, color: "white" }}>{pkg.price}</span>
                    </div>
                    
                    <div style={{ fontSize: "14px", color: isPopular ? "#22c55e" : "white", fontWeight: 800, background: isPopular ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: "8px", display: "inline-block", alignSelf: "flex-start", marginBottom: "24px" }}>
                      {pkg.tokenAmount} AI Credits Included
                    </div>

                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "36px", flexGrow: 1 }}>
                      {pkg.description}
                    </p>

                    <button 
                      onClick={() => handlePurchase(pkg._id)}
                      style={{ display: "block", width: "100%", padding: "16px 0", background: isPopular ? "#22c55e" : "rgba(255,255,255,0.05)", color: isPopular ? "#0a0e0a" : "white", borderRadius: "14px", fontWeight: 800, fontSize: "16px", textDecoration: "none", border: isPopular ? "none" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { if(isPopular) e.currentTarget.style.background = "#16a34a"; else e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={(e) => { if(isPopular) e.currentTarget.style.background = "#22c55e"; else e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    >
                      Request Package
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* ── HOW CREDITS WORK (WHITE SECTION) ── */}
      <section style={{ padding: "100px 0", background: "#ffffff", color: "#0a0e0a", borderRadius: "40px 40px 0 0", position: "relative", zIndex: 2 }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "16px", color: "#060a06" }}>
              How do <span style={{ color: "#16a34a" }}>AI Credits</span> work?
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(6,10,6,0.6)", maxWidth: "600px", margin: "0 auto" }}>
              Our credit-based system ensures you only pay for exactly what you analyze. No unused recurring subscriptions.
            </p>
          </div>

          <div className="packages-info-grid" style={{ display: "grid", gap: "32px", maxWidth: "1000px", margin: "0 auto" }}>
            {[
              { icon: <Zap size={24} />, title: "20 Credit = 1 Analysis", desc: "Whether you're identifying a plant or diagnosing a leaf disease, each distinct AI operation costs exactly one credit." },
              { icon: <Activity size={24} />, title: "Never Expire", desc: "Purchase credits in bulk during harvest season and save them indefinitely. They stay in your account forever." },
              { icon: <Shield size={24} />, title: "Secure Blockchain Audit", desc: "Every deduction is logged transparently so large farms can audit their agronomists' usage." }
            ].map((item, idx) => (
              <div key={idx} style={{ background: "#f8fafc", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(22,163,74,0.1)", color: "#16a34a", borderRadius: "12px", display: "grid", placeItems: "center", marginBottom: "20px" }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#060a06", marginBottom: "12px" }}>{item.title}</h4>
                <p style={{ color: "rgba(6,10,6,0.6)", fontSize: "15px", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA BANNER (DARK/GREEN) ── */}
      <section style={{ padding: "100px 0", background: "linear-gradient(180deg, #0d1a0d 0%, #060a06 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "24px", color: "white" }}>
            Need a custom enterprise plan?
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>
            For massive commercial cultivators, we offer high-volume custom pricing and direct API integrations.
          </p>
          <Link to="/contact" style={{ display: "inline-block", padding: "16px 36px", background: "white", color: "#0a0e0a", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none", transition: "0.2s" }}>
            Contact Sales Team
          </Link>
        </Container>
      </section>

      <style>{`
        .packages-info-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          .packages-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}