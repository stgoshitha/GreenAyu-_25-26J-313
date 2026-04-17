import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Leaf, Zap, Activity, ShieldCheck } from "lucide-react";
import Container from "../components/layout/Container";
import { AuthContext } from "../App";
import Swal from "sweetalert2";

const features = [
  { icon: <Zap size={16} />, text: "5 AI-powered analysis modules" },
  { icon: <Activity size={16} />, text: "Real-time sensor telemetry" },
  { icon: <ShieldCheck size={16} />, text: "Secure credit-based system" },
];

export default function Login() {
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    const res = await auth?.login?.(email, password);
    setLoading(false);

    if (res?.ok) {
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.user.tokens === 0) {
        const result = await Swal.fire({
          title: "No Credits Remaining",
          text: "Your token count is 0. You can still login but won't be able to run new AI analyses.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#22c55e",
          confirmButtonText: "Continue to Dashboard",
          cancelButtonText: "Stay on Login",
          background: "#0d120d",
          color: "#fff",
        });
        if (result.isConfirmed) navigate("/features/identify-health");
      } else {
        navigate("/features/identify-health");
      }
    } else {
      setError(res?.message || "Invalid credentials. Please try again.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", background: "#060a06", position: "relative" }}>
      {/* Background Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px", pointerEvents: "none" }} />
      
      <Container style={{ position: "relative", zIndex: 1 }}>
        <div className="auth-split-grid" style={{ display: "grid", background: "#060a06", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>

          {/* ── Left Panel ── */}
          <div className="auth-left-panel" style={{ position: "relative", background: "linear-gradient(160deg, #0a1a0a 0%, #060a06 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", overflow: "hidden" }}>
          {/* Floating leaves */}
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "12%", right: "12%", opacity: 0.15 }}>
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="leafGradLog1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#166534" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path d="M50 2 C50 2 15 45 15 70 C15 90 30 98 50 98 C70 98 85 90 85 70 C85 45 50 2 50 2 Z" fill="url(#leafGradLog1)" />
            </svg>
          </motion.div>
        <motion.div animate={{ y: [0, 12, 0], rotate: [20, 32, 20] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: "absolute", bottom: "15%", left: "8%", opacity: 0.1 }}>
          <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
            {/* Pointed Side Leaf */}
            <path d="M5 50 C5 50 45 15 70 15 C90 15 98 30 98 50 C98 70 90 85 70 85 C45 85 5 50 5 50 Z" fill="#4ade80" opacity="0.6" />
          </svg>
        </motion.div>
        {/* Rotating ring */}
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", bottom: "30%", right: "15%", width: "160px", height: "160px", borderRadius: "50%", border: "1px solid rgba(34,197,94,0.1)" }} />

        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", overflow: "hidden", display: "grid", placeItems: "center", boxShadow: "0 0 20px rgba(34,197,94,0.15)" }}>
              <img src="/greenayu.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 900, color: "white" }}>Green<span style={{ color: "#22c55e" }}>Ayu</span></span>
          </Link>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
            <Leaf size={12} color="#22c55e" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>Agricultural AI Platform</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: "16px" }}>
            Grow Smarter.<br />
            <span style={{ color: "#22c55e" }}>Harvest Better.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "340px", marginBottom: "40px" }}>
            AI-powered tools for medicinal plant growers across Sri Lanka — from seed to harvest.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", color: "#22c55e", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ position: "relative", zIndex: 1, padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px" }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontStyle: "italic", margin: "0 0 12px" }}>
            "GreenAyu's disease detection saved my entire crop season. The accuracy is unbelievable."
          </p>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Kasun Fernando — Herb Grower, Kandy</div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="auth-right-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", background: "#0d120d" }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div style={{ marginBottom: "36px" }}>
            <h1 style={{ fontSize: "30px", fontWeight: 900, color: "white", margin: "0 0 8px", letterSpacing: "-1px" }}>Welcome back</h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Sign in to your GreenAyu account</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#f87171", fontSize: "14px", fontWeight: 600, marginBottom: "24px" }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={16} style={{ position: "absolute", left: "16px", color: "rgba(255,255,255,0.25)" }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "14px 16px 14px 44px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "15px", color: "white", outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(34,197,94,0.4)"; e.target.style.background = "rgba(34,197,94,0.04)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Lock size={16} style={{ position: "absolute", left: "16px", color: "rgba(255,255,255,0.25)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: "100%", padding: "14px 48px 14px 44px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "15px", color: "white", outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(34,197,94,0.4)"; e.target.style.background = "rgba(34,197,94,0.04)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: "8px", padding: "16px", background: loading ? "rgba(34,197,94,0.5)" : "#22c55e", color: "#060a06", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 0 30px rgba(34,197,94,0.25)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#16a34a"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#22c55e"; }}
            >
              {loading ? "Signing in..." : <><ArrowRight size={18} /> Sign In to Dashboard</>}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.35)", marginTop: "28px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#22c55e", fontWeight: 800, textDecoration: "none" }}>Create one free</Link>
          </p>
        </motion.div>
      </div>

        </div>
      </Container>
      
      {/* Responsive style */}
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