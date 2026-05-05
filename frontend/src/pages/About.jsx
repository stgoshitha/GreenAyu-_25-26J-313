import React from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Microscope, Sprout, ShieldCheck, ArrowRight, Zap, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";

export default function About() {
  const values = [
    { 
      icon: <Microscope size={24} />, 
      title: "Scientific Precision", 
      desc: "Moving beyond guesswork with AI models trained on verified botanical datasets collected across Sri Lanka." 
    },
    { 
      icon: <Sprout size={24} />, 
      title: "Farmer Centric", 
      desc: "Designed for high-glare field usage, offline-first capabilities, and one-handed mobile navigation." 
    },
    { 
      icon: <ShieldCheck size={24} />, 
      title: "Quality First", 
      desc: "Standardizing the grading process to ensure pharmaceutical-grade supply chains and transparent pricing." 
    },
    { 
      icon: <Globe size={24} />, 
      title: "Sustainable Yields", 
      desc: "Equipping growers with the data they need to maximize output while preserving soil health." 
    }
  ];

  const milestones = [
    { year: "2023", title: "Project Inception", desc: "Started as a university research project focusing on Ayurvedic leaf classification." },
    { year: "2024", title: "Model Deployment", desc: "Achieved 94% accuracy on 5 critical disease models using Convolutional Neural Networks." },
    { year: "2025", title: "Hardware Integration", desc: "Launched hardware telemetry integration for real-time commercial farm monitoring." },
    { year: "2026", title: "National Scale", desc: "Opened the platform to over 12,000 commercial cultivators and Ayurvedic suppliers." },
  ];

  return (
    <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>

      {/* ── HEADER (DARK) ── */}
      <section style={{ position: "relative", padding: "120px 0 80px", background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        
        {/* Decorative Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
              <Sprout size={12} color="#22c55e" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px" }}>Our Story</span>
            </div>
            <h1 style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "24px", color: "white", lineHeight: 1.1 }}>
              Bridging Tradition<br />
              <span style={{ color: "#22c55e" }}>with Technology.</span>
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              We are on a mission to completely digitize and standardize the cultivation and quality assessment of medicinal plants across South Asia.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── MISSION (WHITE PAGE) ── */}
      <section style={{ padding: "100px 0", background: "#ffffff", color: "#0a0e0a", borderRadius: "40px 40px 0 0", position: "relative", zIndex: 2 }}>
        <Container>
          <div className="about-split-grid" style={{ display: "grid", gap: "60px", alignItems: "center" }}>
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "24px", color: "#060a06", lineHeight: 1.1 }}>
                The gap between <span style={{ color: "#16a34a" }}>intuition</span> and <span style={{ color: "#16a34a" }}>data.</span>
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(6,10,6,0.6)", lineHeight: 1.7, marginBottom: "24px" }}>
                For too long, medicinal plant identification and quality grading relied entirely on subjective visual cues passed down through generations.
              </p>
              <p style={{ fontSize: "16px", color: "rgba(6,10,6,0.5)", lineHeight: 1.7, marginBottom: "32px" }}>
                GreenAyu digitizes this expertise. Our portal provides commercial farmers and Ayurvedic pharmacies with a robust interface to identify species, monitor crop health, predict yields, and assess part-specific quality before products hit the market.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  "Clean UI optimized for bright field environments",
                  "Modular AI architecture for distinct analyses",
                  "Instant cryptographically secure grading reports"
                ].map((text, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", fontWeight: 600, color: "#060a06" }}>
                    <CheckCircle2 size={20} color="#16a34a" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Image/Graphic Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "32px", padding: "40px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "32px", color: "#060a06" }}>Our Roadmap</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "32px", borderLeft: "2px solid rgba(22,163,74,0.2)", paddingLeft: "24px", marginLeft: "12px" }}>
                  {milestones.map((m, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      {/* Timeline dot */}
                      <div style={{ position: "absolute", left: "-32px", top: "0", width: "14px", height: "14px", borderRadius: "50%", background: "#16a34a", outline: "4px solid #f8fafc" }} />
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{m.year}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#0a0e0a", marginBottom: "6px" }}>{m.title}</div>
                      <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)", lineHeight: 1.5 }}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── VALUES GRID (DARK) ── */}
      <section style={{ padding: "120px 0", background: "#0a120a" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1px", color: "white", marginBottom: "16px" }}>
              Core Principles
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto" }}>
              Everything we build is designed to empower the cultivator and protect the integrity of botanical medicine.
            </p>
          </div>

          <div className="about-values-grid" style={{ display: "grid", gap: "24px" }}>
            {values.map((v, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ background: "#0d170d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "40px 32px", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(34,197,94,0.1)", color: "#22c55e", display: "grid", placeItems: "center", marginBottom: "24px" }}>
                  {v.icon}
                </div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "white", marginBottom: "12px" }}>{v.title}</h4>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", lineHeight: 1.6 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA BANNER (DARK/GREEN) ── */}
      <section style={{ padding: "100px 0", background: "linear-gradient(180deg, #0d1a0d 0%, #060a06 100%)", borderTop: "1px solid rgba(34,197,94,0.1)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
            <Users size={12} color="#22c55e" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>Join the Network</span>
          </div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "24px", color: "white" }}>
            Ready to upgrade your farm?
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>
            Experience the future of botanical precision with absolutely no risk.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 32px", background: "#22c55e", color: "#0a0e0a", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none", boxShadow: "0 0 30px rgba(34,197,94,0.3)", transition: "0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#16a34a"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#22c55e"}
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 32px", background: "transparent", color: "white", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", transition: "0.2s" }}
               onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
               onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              Contact Sales
            </Link>
          </div>
        </Container>
      </section>

      {/* Responsive Defaults */}
      <style>{`
        .about-split-grid { grid-template-columns: 1fr 1fr; }
        .about-values-grid { grid-template-columns: repeat(4, 1fr); }
        
        @media (max-width: 980px) {
          .about-split-grid { grid-template-columns: 1fr !important; }
          .about-values-grid { grid-template-columns: repeat(2, 1fr) !important; }
          section { padding: 80px 0 !important; }
        }
        @media (max-width: 600px) {
          .about-values-grid { grid-template-columns: 1fr !important; }
          section { padding: 60px 0 !important; }
        }
      `}</style>

    </div>
  );
}