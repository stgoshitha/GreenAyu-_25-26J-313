import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, CheckCircle2, Leaf, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import Container from "../components/layout/Container";
import { AuthContext } from "../App";
import Swal from "sweetalert2";

const perks = [
  { icon: <Zap size={15} />, title: "50 Free Credits", desc: "Start analyzing immediately" },
  { icon: <ShieldCheck size={15} />, title: "All 5 Modules", desc: "Full platform access" },
  { icon: <BarChart3 size={15} />, title: "Sensor Dashboard", desc: "Live telemetry & soil data" },
];

export default function Register() {
  const navigate = useNavigate();
  const auth = React.useContext(AuthContext);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!agreed) return Swal.fire({ title: "Agreement Required", text: "Please agree to the Terms of Service to continue.", icon: "warning", background: "#0d120d", color: "#fff", confirmButtonColor: "#22c55e" });
    setError("");
    setLoading(true);
    const res = await auth?.register?.(form.name, form.email, form.password);
    setLoading(false);
    if (res?.ok) {
      navigate("/features/identify-health");
    } else {
      setError(res?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", background: "#060a06", position: "relative" }}>
      {/* Background Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" }} />
      
      <Container style={{ position: "relative", zIndex: 1 }}>
        <div className="auth-split-grid" style={{ display: "grid", background: "#060a06", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>

          {/* ── Left Panel: Dark with leaf decor ── */}
          <div className="auth-left-panel" style={{ position: "relative", background: "linear-gradient(160deg, #0a1a0a 0%, #060a06 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", overflow: "hidden" }}>
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

        {/* Floating leaves */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [-10, 10, -10], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "10%", right: "15%", opacity: 0.15 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="leafGradReg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#166534" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Pointed Teardrop Leaf */}
            <path d="M50 2 C50 2 15 45 15 70 C15 90 30 98 50 98 C70 98 85 90 85 70 C85 45 50 2 50 2 Z" fill="url(#leafGradReg1)" />
          </svg>
        </motion.div>
        <motion.div animate={{ y: [0, 15, 0], rotate: [20, 45, 20] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ position: "absolute", bottom: "15%", right: "10%", opacity: 0.1 }}>
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <path d="M5 50 C5 50 45 15 70 15 C90 15 98 30 98 50 C98 70 90 85 70 85 C45 85 5 50 5 50 Z" fill="#4ade80" opacity="0.6" />
          </svg>
        </motion.div>
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", top: "40%", left: "5%", width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(34,197,94,0.08)" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", overflow: "hidden", display: "grid", placeItems: "center", boxShadow: "0 0 20px rgba(34,197,94,0.15)" }}>
              <img src="/greenayu.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 900, color: "white" }}>Green<span style={{ color: "#22c55e" }}>Ayu</span></span>
          </Link>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "16px" }}>
            Start Your Free<br />
            <span style={{ color: "#22c55e" }}>Farm AI Journey</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: "340px", marginBottom: "36px" }}>
            Create your account in 30 seconds and unlock the full power of agricultural AI.
          </p>

          {/* Perks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {perks.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(34,197,94,0.12)", color: "#22c55e", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "white" }}>{p.title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>{p.desc}</div>
                </div>
                <CheckCircle2 size={16} color="#22c55e" style={{ marginLeft: "auto" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>No credit card required · Cancel anytime</span>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="auth-right-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", background: "#0d120d" }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 900, color: "white", margin: "0 0 8px", letterSpacing: "-1px" }}>Create your account</h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Join thousands of Sri Lankan farmers using GreenAyu</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#f87171", fontSize: "14px", fontWeight: 600, marginBottom: "20px" }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Full Name", icon: <User size={16} />, type: "text", placeholder: "Kasun Fernando", field: "name" },
              { label: "Email Address", icon: <Mail size={16} />, type: "email", placeholder: "you@example.com", field: "email" },
              { label: "Password", icon: <Lock size={16} />, type: "password", placeholder: "Minimum 6 characters", field: "password" },
            ].map(({ label, icon, type, placeholder, field }) => (
              <div key={field} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{label}</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <div style={{ position: "absolute", left: "14px", color: "rgba(255,255,255,0.25)" }}>{icon}</div>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                    style={{ width: "100%", padding: "14px 16px 14px 42px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "15px", color: "white", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(34,197,94,0.4)"; e.target.style.background = "rgba(34,197,94,0.04)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                  />
                </div>
              </div>
            ))}

            {/* Terms */}
            <div onClick={() => setAgreed(!agreed)} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "4px 0" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "6px", border: agreed ? "none" : "1.5px solid rgba(255,255,255,0.15)", background: agreed ? "#22c55e" : "transparent", display: "grid", placeItems: "center", transition: "all 0.2s", flexShrink: 0 }}>
                {agreed && <CheckCircle2 size={13} color="#060a06" />}
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>
                I agree to the <Link to="/terms" style={{ color: "#22c55e", textDecoration: "none", fontWeight: 700 }}>Terms of Service</Link> and <Link to="/terms" style={{ color: "#22c55e", textDecoration: "none", fontWeight: 700 }}>Privacy Policy</Link>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: "4px", padding: "16px", background: loading ? "rgba(34,197,94,0.5)" : "#22c55e", color: "#060a06", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 0 30px rgba(34,197,94,0.25)" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#16a34a"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#22c55e"; }}
            >
              {loading ? "Creating Account..." : <><UserPlus size={18} /> Create Free Account</>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "24px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#22c55e", fontWeight: 800, textDecoration: "none" }}>Sign in here</Link>
          </p>
        </motion.div>
      </div>

        </div>
      </Container>

      <style>{`
        .auth-split-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .auth-split-grid { grid-template-columns: 1fr !important; }
          .auth-left-panel { display: none !important; }
          .auth-right-panel { padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}