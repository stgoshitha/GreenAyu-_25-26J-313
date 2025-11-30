import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, CheckCircle2, ArrowRight } from "lucide-react";
import Page from "./_shared/Page";
import Container from "../components/layout/Container";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    if (!agreed) return alert("Please agree to the Terms of Service");
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  }

  return (
    <Page title="" subtitle="">
      <Container>
        <div style={authWrapper}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={registerCard}
          >
            {/* Header Area */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <img src="/greenayu.jpeg" alt="GreenAyu Logo" style={logoStyle} />
              <h2 style={titleStyle}>Join GreenAyu</h2>
              <p style={subTitleStyle}>Start your medicinal plant optimization journey</p>
            </div>

            <form onSubmit={onSubmit} style={formContainer}>
              {/* Full Name */}
              <div style={inputGroup}>
                <label style={labelStyle}>Full Name</label>
                <div style={inputWrapper}>
                  <User size={18} style={iconStyle} />
                  <input 
                    style={inputStyle}
                    placeholder="John Doe"
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div style={inputGroup}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWrapper}>
                  <Mail size={18} style={iconStyle} />
                  <input 
                    style={inputStyle}
                    type="email" 
                    placeholder="john@example.com"
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={inputGroup}>
                <label style={labelStyle}>Password</label>
                <div style={inputWrapper}>
                  <Lock size={18} style={iconStyle} />
                  <input 
                    style={inputStyle}
                    type="password" 
                    placeholder="Min. 8 characters"
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div style={termsWrapper} onClick={() => setAgreed(!agreed)}>
                <div style={checkboxStyle(agreed)}>
                  {agreed && <CheckCircle2 size={14} color="white" />}
                </div>
                <span style={termsText}>
                  I agree to the <Link to="/terms" style={linkHighlight}>Terms of Service</Link> and <Link to="/terms" style={linkHighlight}>Privacy Policy</Link>
                </span>
              </div>

              <button 
                className="btn btn-primary" 
                type="submit" 
                disabled={loading}
                style={submitBtnStyle}
              >
                {loading ? "Creating Account..." : "Create Free Account"}
                {!loading && <UserPlus size={18} style={{ marginLeft: '10px' }} />}
              </button>

              <div style={footerText}>
                Already a member? <Link to="/login" style={linkHighlight}>Sign In here</Link>
              </div>
            </form>
          </motion.div>
        </div>
      </Container>
    </Page>
  );
}

// --- Internal Styles ---

const authWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "85vh",
  padding: "40px 0"
};

const registerCard = {
  width: "100%",
  maxWidth: "480px",
  background: "#ffffff",
  padding: "48px",
  borderRadius: "32px",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)",
  border: "1px solid #f1f5f9"
};

const logoStyle = {
  width: "70px",
  height: "70px",
  borderRadius: "18px",
  marginBottom: "20px",
  boxShadow: "0 10px 20px rgba(5, 150, 105, 0.15)"
};

const titleStyle = { fontSize: "30px", fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const subTitleStyle = { fontSize: "15px", color: "#64748b", margin: 0 };

const formContainer = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "13px", fontWeight: 700, color: "#475569", marginLeft: "4px" };

const inputWrapper = { position: "relative", display: "flex", alignItems: "center" };
const iconStyle = { position: "absolute", left: "16px", color: "#94a3b8" };

const inputStyle = {
  width: "100%",
  padding: "14px 16px 14px 48px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  fontSize: "15px",
  outline: "none",
  transition: "all 0.2s",
  background: "#f8fafc"
};

const termsWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  padding: "4px"
};

const checkboxStyle = (active) => ({
  width: "20px",
  height: "20px",
  borderRadius: "6px",
  border: active ? "none" : "2px solid #e2e8f0",
  background: active ? "#22c55e" : "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s"
});

const termsText = { fontSize: "13px", color: "#64748b", lineHeight: "1.4" };

const submitBtnStyle = {
  height: "56px",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 800,
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#22c55e",
  color: "white",
  boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)"
};

const footerText = { textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "12px" };
const linkHighlight = { color: "#22c55e", fontWeight: 800, textDecoration: "none" };