import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Mail, Phone, MapPin, Twitter, Linkedin, Github, ArrowRight, Zap, ShieldCheck, Activity, BarChart3, Clock } from "lucide-react";
import Container from "../layout/Container";

const footerLinks = {
  Platform: [
    { label: "Home", to: "/" },
    { label: "Packages & Pricing", to: "/packages" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQ", to: "/faq" }
  ],
  "AI Features": [
    { label: "Identify & Health Matrix", to: "/features/identify-health" },
    { label: "Product Identification & Grading", to: "/features/parts-quality" },
    { label: "Smart Dry & Store", to: "/features/dry-storage" },
    { label: "Fertilizer Recommendation", to: "/features/yield-optimization" },
    { label: "Telemetry Dashboard", to: "/features/telemetry" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Cookie Policy", to: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#060a06", borderTop: "1px solid rgba(34,197,94,0.1)", position: "relative", overflow: "hidden" }}>
      {/* Glow effect */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "200px", background: "radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <Container>
        {/* Top Grid */}
        <div className="footer-grid" style={{ paddingTop: "80px", paddingBottom: "60px", display: "grid", gap: "60px", position: "relative", zIndex: 1 }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ width: "45px", height: "45px", borderRadius: "10px", overflow: "hidden", display: "grid", placeItems: "center", boxShadow: "0 0 15px rgba(34,197,94,0.15)" }}>
                <img src="/greenayu.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>
                  Green<span style={{ color: "#22c55e" }}>Ayu</span>
                </div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(34,197,94,0.5)", textTransform: "uppercase", letterSpacing: "2px" }}>Agriculture</div>
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "32px", maxWidth: "280px" }}>
              Advanced AI-powered botanical intelligence for medicinal plant growers across Sri Lanka and beyond.
            </p>

            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                <MapPin size={14} color="#22c55e" />
                <span>Negombo, Sri Lanka</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                <Mail size={14} color="#22c55e" />
                <span>greenayu.agricultor@gmail.com</span>
              </div>
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: "8px" }}>
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; e.currentTarget.style.color = "#22c55e"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Live status */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "24px", padding: "8px 14px", background: "rgba(34,197,94,0.05)", borderRadius: "20px", border: "1px solid rgba(34,197,94,0.12)" }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%" }}
              />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px" }}>
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
                {title}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    style={{ textDecoration: "none", fontSize: "14px", color: "rgba(255,255,255,0.5)", fontWeight: 500, transition: "color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#22c55e"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} GreenAyu Agriculture. All rights reserved.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
            <span>Built for Sri Lanka's medicinal farming ecosystem</span>
          </div>
        </div>
      </Container>
      
      {/* Responsive Styles */}
      <style>{`
        .footer-grid { grid-template-columns: 1.8fr repeat(3, 1fr); }
        @media (max-width: 980px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}