import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import Page from "./_shared/Page";
import Container from "../components/layout/Container";
import { AuthContext } from "../App";

export default function Login() {
  const auth = React.useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("demo@agricultor.lk");
  const [password, setPassword] = useState("Demo@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = auth?.login?.(email, password);
      setLoading(false);
      if (res?.ok) {
        navigate("/features/identify-health");
      } else {
        setError(res?.message || "Invalid credentials. Please try again.");
      }
    }, 800);
  }

  return (
    <Page title="" subtitle="">
      <Container>
        <div style={authWrapper}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={loginCard}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <img src="/greenayu.jpeg" alt="Logo" style={loginLogo} />
              <h2 style={welcomeTitle}>Welcome Back</h2>
              <p style={welcomeSub}>Access your GreenAyu diagnostic dashboard</p>
            </div>

            <div style={hintBox}>
              <ShieldCheck size={16} color="#059669" />
              <span>Demo: <b>demo@agricultor.lk</b> / <b>Demo@123</b></span>
            </div>

            {error && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={alertStyle}>
                {error}
              </motion.div>
            )}

            <form onSubmit={onSubmit} style={formStyle}>
              <div style={inputGroup}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapper}>
                  <Mail size={18} style={inputIcon} />
                  <input 
                    style={inputStyle} 
                    type="email" 
                    placeholder="name@company.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
              </div>

              <div style={inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={labelStyle}>Password</label>
                  <Link to="/forgot" style={forgotLink}>Forgot?</Link>
                </div>
                <div style={inputWrapper}>
                  <Lock size={18} style={inputIcon} />
                  <input 
                    style={inputStyle} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeBtn}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                type="submit" 
                disabled={loading}
                style={submitBtn}
              >
                {loading ? "Authenticating..." : "Sign In"}
                {!loading && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
              </button>

              <div style={footerText}>
                Don't have an account? <Link to="/register" style={regLink}>Create account</Link>
              </div>
            </form>
          </motion.div>
        </div>
      </Container>
    </Page>
  );
}


const authWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh",
  padding: "40px 0"
};

const loginCard = {
  width: "100%",
  maxWidth: "440px",
  background: "#ffffff",
  padding: "48px",
  borderRadius: "32px",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)",
  border: "1px solid #f1f5f9"
};

const loginLogo = {
  width: "64px",
  height: "64px",
  borderRadius: "16px",
  marginBottom: "16px",
  boxShadow: "0 8px 16px rgba(5, 150, 105, 0.15)"
};

const welcomeTitle = { fontSize: "28px", fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const welcomeSub = { fontSize: "15px", color: "#64748b", margin: 0 };

const hintBox = {
  background: "#f0fdf4",
  padding: "12px 16px",
  borderRadius: "12px",
  fontSize: "13px",
  color: "#166534",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "24px",
  border: "1px solid #dcfce7"
};

const alertStyle = {
  padding: "12px",
  background: "#fef2f2",
  color: "#b91c1c",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "20px",
  textAlign: "center"
};

const formStyle = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "13px", fontWeight: 700, color: "#475569", marginLeft: "4px" };

const inputWrapper = { position: "relative", display: "flex", alignItems: "center" };
const inputIcon = { position: "absolute", left: "16px", color: "#94a3b8" };
const inputStyle = {
  width: "100%",
  padding: "14px 16px 14px 48px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s",
  background: "#f8fafc"
};

const eyeBtn = {
  position: "absolute",
  right: "12px",
  background: "none",
  border: "none",
  color: "#94a3b8",
  cursor: "pointer",
  display: "flex",
  alignItems: "center"
};

const forgotLink = { fontSize: "12px", fontWeight: 700, color: "#22c55e", textDecoration: "none" };

const submitBtn = {
  height: "54px",
  borderRadius: "14px",
  fontSize: "16px",
  fontWeight: 800,
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0f172a",
  color: "white"
};

const footerText = { textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "12px" };
const regLink = { color: "#22c55e", fontWeight: 800, textDecoration: "none" };