import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Leaf, Zap, Activity, Microscope, Clock, BarChart3,
  Gauge, ChevronRight, CheckCircle2, Star, Send, Mail, Phone, MapPin,
  Shield, TrendingUp, Cpu, Globe, Users, Award, MessageSquare, Play,
  Plus, Minus
} from "lucide-react";
import Container from "../components/layout/Container";
import API from "../services/api";
import Swal from "sweetalert2";

// ──── Data ────
const features = [
  { icon: <Activity size={24} />, title: "Identify & Health Matrix", desc: "AI-powered plant identification and real-time disease detection from a single photo.", to: "/features/identify-health", color: "#22c55e" },
  { icon: <Microscope size={24} />, title: "Product Identification & Grading", desc: "Grade medicinal plant parts across 4 quality tiers using computer vision.", to: "/features/parts-quality", color: "#3b82f6" },
  { icon: <Clock size={24} />, title: "Smart Dry & Store", desc: "AI-driven drying time and shelf-life prediction for maximum preservation.", to: "/features/dry-storage", color: "#f59e0b" },
  { icon: <BarChart3 size={24} />, title: "Fertilizer Recommendation", desc: "Synthesize NPK soil data, weather and crop type for production forecasts.", to: "/features/yield-optimization", color: "#a855f7" },
  { icon: <Gauge size={24} />, title: "Telemetry Intelligence", desc: "Real-time multi-sensor monitoring for soil nutrients, temperature and humidity.", to: "/features/telemetry", color: "#06b6d4" },
  { icon: <Cpu size={24} />, title: "AI Credit Engine", desc: "Secure pay-per-analysis credit system with transparent usage tracking.", to: "/packages", color: "#f43f5e" },
];

const stats = [
  { value: "98.2%", label: "Model Accuracy" },
  { value: "12K+", label: "Plants Analyzed" },
  { value: "5", label: "AI Modules" },
  { value: "24/7", label: "Sensor Uptime" },
];

const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up and get starter credits instantly. No credit card required to begin." },
  { num: "02", title: "Connect Your Sensors", desc: "Link MQTT soil sensors for live NPK and environmental data streaming." },
  { num: "03", title: "Run AI Analysis", desc: "Upload images or use sensor data to trigger precision AI diagnostics." },
  { num: "04", title: "Act on Insights", desc: "Receive actionable recommendations and optimize your cultivation operations." },
];


const testimonials = [
  { name: "Dr. S. Perera", role: "Medicinal Plant Researcher, UOP", text: "The Fertilizer Recommendation module has increased our output by 34% in just one season. Remarkable accuracy.", rating: 5 },
  { name: "Kasun Fernando", role: "Commercial Herb Grower, Kandy", text: "The disease detection AI identified a fungal infection 3 weeks before visible symptoms. Saved my entire crop.", rating: 5 },
  { name: "Priya Wickramasinghe", role: "Ayurvedic Supplier, Colombo", text: "Quality grading gives our buyers confidence. We've secured two new export contracts since adopting GreenAyu.", rating: 5 },
];

export default function Home() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await API.get('/packages');
        setPlans(res.data.data);
      } catch (err) {
        console.error("Error fetching packages in Home:", err);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      const res = await API.post("/contact", contactForm);
      if (res.data.success) {
        Swal.fire({ title: "Message Sent!", text: "We'll get back to you within 24 hours.", icon: "success", confirmButtonColor: "#22c55e", background: "#0d120d", color: "#fff" });
        setContactForm({ name: "", email: "", message: "" });
      }
    } catch {
      Swal.fire({ title: "Failed to Send", text: "Please try again later.", icon: "error", confirmButtonColor: "#22c55e", background: "#0d120d", color: "#fff" });
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "#060a06" }}>
        
        {/* Grid background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", zIndex: 0 }} />
        
        {/* Central green radial glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "900px", height: "700px", background: "radial-gradient(ellipse, rgba(34,197,94,0.09) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        {/* ── Floating Leaf SVGs ── */}
        {/* Large leaf — top left */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "12%", left: "6%", zIndex: 0, opacity: 0.18 }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" style={{ filter: "drop-shadow(0 0 20px rgba(34,197,94,0.15))" }}>
            <defs>
              <linearGradient id="leafGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#166534" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Pointed Leaf Path */}
            <path d="M50 2 C50 2 15 45 15 70 C15 90 30 98 50 98 C70 98 85 90 85 70 C85 45 50 2 50 2 Z" fill="url(#leafGradTop)" />
            <path d="M50 2 L50 98" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <path d="M50 30 L25 50 M50 50 L20 75 M50 70 L30 90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <path d="M50 30 L75 50 M50 50 L80 75 M50 70 L70 90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Medium leaf — top right */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [25, 40, 25], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", top: "10%", right: "12%", zIndex: 0, opacity: 0.12 }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            {/* Pointed Side Leaf */}
            <path d="M5 50 C5 50 45 15 70 15 C90 15 98 30 98 50 C98 70 90 85 70 85 C45 85 5 50 5 50 Z" fill="#22c55e" opacity="0.6" />
            <path d="M5 50 L98 50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Small leaf — bottom left */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [-20, -10, -20], x: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", bottom: "15%", left: "10%", zIndex: 0, opacity: 0.1 }}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            {/* Small Tapered Leaf */}
            <path d="M50 5 C50 5 20 40 20 65 C20 85 35 95 50 95 C65 95 80 85 80 65 C80 40 50 5 50 5 Z" fill="#4ade80" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Tiny leaf — bottom right */}
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [30, 45, 30] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ position: "absolute", bottom: "22%", right: "5%", zIndex: 0, opacity: 0.13 }}
        >
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
            <path d="M50 5 C20 5 5 30 5 55 C5 80 20 95 50 95 C50 95 50 50 50 5 Z" fill="#22c55e"/>
            <path d="M50 5 C80 5 95 30 95 55 C95 80 80 95 50 95 C50 95 50 50 50 5 Z" fill="#166534"/>
            <line x1="50" y1="5" x2="50" y2="95" stroke="#4ade80" strokeWidth="1.5" opacity="0.5"/>
          </svg>
        </motion.div>

        {/* Mid-right large leaf */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [-10, 0, -10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{ position: "absolute", top: "40%", right: "2%", zIndex: 0, opacity: 0.1 }}
        >
          <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
            <path d="M50 5 C20 5 5 30 5 55 C5 80 20 95 50 95 C50 95 50 50 50 5 Z" fill="#22c55e"/>
            <path d="M50 5 C80 5 95 30 95 55 C95 80 80 95 50 95 C50 95 50 50 50 5 Z" fill="#15803d"/>
            <line x1="50" y1="5" x2="50" y2="95" stroke="#4ade80" strokeWidth="1.5" opacity="0.4"/>
            <line x1="50" y1="35" x2="22" y2="58" stroke="#4ade80" strokeWidth="1" opacity="0.35"/>
            <line x1="50" y1="55" x2="78" y2="70" stroke="#4ade80" strokeWidth="1" opacity="0.35"/>
          </svg>
        </motion.div>

        {/* ── Floating geometric rings ── */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "15%", right: "18%", width: "180px", height: "180px", borderRadius: "50%", border: "1px solid rgba(34,197,94,0.08)", zIndex: 0 }}
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: "15%", right: "18%", width: "130px", height: "130px", borderRadius: "50%", border: "1px dashed rgba(34,197,94,0.12)", zIndex: 0, top: "calc(15% + 25px)", right: "calc(18% + 25px)" }}
        />

        {/* Bottom left ring */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", bottom: "10%", left: "15%", width: "140px", height: "140px", borderRadius: "50%", border: "1px solid rgba(34,197,94,0.07)", zIndex: 0 }}
        />

        {/* ── Floating dot particles ── */}
        {[
          { top: "25%", left: "18%", size: 4, delay: 0 },
          { top: "60%", left: "12%", size: 3, delay: 1.5 },
          { top: "35%", right: "22%", size: 5, delay: 0.8 },
          { top: "70%", right: "15%", size: 3, delay: 2 },
          { top: "45%", left: "30%", size: 2, delay: 3 },
          { top: "20%", right: "35%", size: 3, delay: 1 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
            style={{ position: "absolute", top: dot.top, left: dot.left, right: dot.right, width: `${dot.size}px`, height: `${dot.size}px`, borderRadius: "50%", background: "#22c55e", zIndex: 0, boxShadow: `0 0 ${dot.size * 3}px rgba(34,197,94,0.5)` }}
          />
        ))}

        <Container style={{ position: "relative", zIndex: 1, paddingTop: "80px", paddingBottom: "80px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "28px" }}>
                <Leaf size={14} color="#22c55e" />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e" }}>Sri Lanka's #1 Agricultural AI Platform</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: "clamp(48px, 8vw, 84px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", marginBottom: "28px" }}
            >
              AI Intelligence for{" "}
              <span style={{ color: "#22c55e", fontStyle: "italic" }}>Medicinal</span>
              <br />Plant Cultivation
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 48px" }}
            >
              Identify diseases, grade quality, optimize yields, and monitor your farm in real-time. The complete AI toolkit built specifically for Sri Lanka's traditional medicinal herb farmers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 32px", background: "#22c55e", color: "#0a0e0a", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none", boxShadow: "0 0 40px rgba(34,197,94,0.3)", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; }}>
                Start Free <ArrowRight size={18} />
              </Link>
              <Link to="/features/telemetry" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 32px", background: "rgba(255,255,255,0.05)", color: "white", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Play size={16} fill="currentColor" /> View Live Demo
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="home-stats-grid"
              style={{ display: "grid", gap: "1px", background: "rgba(255,255,255,0.06)", borderRadius: "20px", marginTop: "80px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}
            >
              {stats.map(({ value, label }) => (
                <div key={label} style={{ padding: "28px 20px", background: "#060a06", textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: "#22c55e", letterSpacing: "-1px" }}>{value}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "120px 0", background: "#0a120a", borderTop: "1px solid rgba(34,197,94,0.12)" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "20px" }}>
              <Zap size={12} color="#22c55e" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>5 Integrated Modules</span>
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px" }}>
              Every Tool Your Farm Needs
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto" }}>
              From seed to sale — AI intelligence covering every stage of your medicinal plant operation.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1px", background: "rgba(255,255,255,0.05)", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
            {features.map((f, i) => (
              <Link key={i} to={f.to} style={{ textDecoration: "none", background: "#060a06", padding: "40px 36px", display: "block", transition: "background 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0d120d"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#060a06"; }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${f.color}12`, color: f.color, display: "grid", placeItems: "center", marginBottom: "24px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "white", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "20px", color: f.color, fontSize: "13px", fontWeight: 700 }}>
                  Learn more <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "120px 0", background: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", marginBottom: "20px" }}>
              <Activity size={12} color="#16a34a" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>Simple Workflow</span>
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px", color: "#0f172a" }}>
              Up & Running in Minutes
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b", maxWidth: "480px", margin: "0 auto" }}>
              No complex setup. No engineering degree required. Just results.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ position: "relative", padding: "36px 32px", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}
              >
                <div style={{ fontSize: "48px", fontWeight: 900, color: "rgba(34,197,94,0.2)", letterSpacing: "-2px", marginBottom: "20px" }}>{step.num}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                <div style={{ position: "absolute", top: "36px", right: "32px", width: "32px", height: "32px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", display: "grid", placeItems: "center" }}>
                  <CheckCircle2 size={16} color="#22c55e" />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── PACKAGES ── */}
      <section style={{ padding: "120px 0", background: "#0d1a0d", borderTop: "1px solid rgba(34,197,94,0.12)" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "20px" }}>
              <Shield size={12} color="#22c55e" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>Transparent Pricing</span>
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px" }}>
              Start Free. Scale Smart.
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", maxWidth: "480px", margin: "0 auto" }}>
              Credits-based pricing means you only pay for analysis you actually use.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", maxWidth: "960px", margin: "0 auto" }}>
            {plansLoading ? (
              <div style={{ textAlign: "center", width: "100%", color: "#22c55e", padding: "40px" }}>Loading packages...</div>
            ) : plans.length === 0 ? (
              <div style={{ textAlign: "center", width: "100%", color: "rgba(255,255,255,0.4)", padding: "40px" }}>No packages available right now.</div>
            ) : (
              plans.map((pkg, i) => {
                const isPopular = i === 1; // Assuming the second plan loaded is the popular one
                return (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{ position: "relative", padding: "40px 32px", background: isPopular ? "#0d1a0d" : "#0d120d", borderRadius: "24px", border: `1px solid ${isPopular ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.07)"}`, boxShadow: isPopular ? "0 0 40px rgba(34,197,94,0.1)" : "none", display: "flex", flexDirection: "column" }}
                  >
                    {isPopular && (
                      <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", padding: "4px 16px", background: "#22c55e", borderRadius: "100px", fontSize: "11px", fontWeight: 800, color: "#0a0e0a", whiteSpace: "nowrap" }}>
                        Most Popular
                      </div>
                    )}
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>{pkg.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>LKR</span>
                      <span style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 900, color: "white" }}>{pkg.price}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "#22c55e", fontWeight: 700, marginBottom: "16px" }}>{pkg.tokenAmount} AI Credits included</div>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "28px", flexGrow: 1 }}>{pkg.description}</p>
                    
                    {/* Since DB doesn't store feature bullet points natively, adding a generic highlight list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>
                        <CheckCircle2 size={15} color="#22c55e" /> Perfect precision analysis
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>
                        <CheckCircle2 size={15} color="#22c55e" /> Priority farm support
                      </div>
                    </div>

                    <Link to="/packages" style={{ display: "block", textAlign: "center", padding: "14px 24px", background: isPopular ? "#22c55e" : "rgba(255,255,255,0.05)", color: isPopular ? "#0a0e0a" : "white", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none", border: isPopular ? "none" : "1px solid rgba(255,255,255,0.1)", transition: "0.2s" }}
                      onMouseEnter={(e) => { if(isPopular) e.currentTarget.style.background = "#16a34a"; else e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={(e) => { if(isPopular) e.currentTarget.style.background = "#22c55e"; else e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    >
                      View Packages
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </Container>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "120px 0", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", marginBottom: "20px" }}>
              <Users size={12} color="#16a34a" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>Farmer Stories</span>
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px", color: "#0f172a" }}>
              Trusted by Farmers Across Sri Lanka
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: "36px 32px", background: "white", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                  {Array(t.rating).fill(null).map((_, si) => (
                    <Star key={si} size={14} color="#f59e0b" fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "24px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{t.name}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      

      {/* ── CONTACT ── */}
      <section style={{ padding: "120px 0", background: "#060a06", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        {/* Subtle background glow */}
        <div style={{ position: "absolute", bottom: "0", right: "0", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div className="home-contact-grid" style={{ display: "grid", gap: "80px", alignItems: "center" }}>
            {/* Left */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
                <Mail size={12} color="#22c55e" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>Get in Touch</span>
              </div>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "20px", lineHeight: 1.1 }}>
                Let's Build Your Smarter Farm Together
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "40px" }}>
                Have questions about our AI modules or need a custom enterprise solution? Our team typically responds within 24 hours.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: <Mail size={18} />, title: "Email", val: "greenayu.agricultor@gmail.com" },
                  { icon: <MapPin size={18} />, title: "Location", val: "Negombo, Western Province, Sri Lanka" },
                  { icon: <Clock size={18} />, title: "Response Time", val: "Under 24 hours guaranteed" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "40px", height: "40px", background: "rgba(34,197,94,0.1)", borderRadius: "10px", display: "grid", placeItems: "center", color: "#22c55e", flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>{item.title}</div>
                      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "32px", padding: "48px 40px", backdropFilter: "blur(10px)" }}>
              <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "32px", color: "white" }}>Send Us a Message</h3>
              <form onSubmit={handleContact} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { placeholder: "Your full name", field: "name", type: "text" },
                  { placeholder: "Your email address", field: "email", type: "email" },
                ].map(({ placeholder, field, type }) => (
                  <div key={field} style={{ position: "relative" }}>
                    <input
                      type={type}
                      placeholder={placeholder}
                      required
                      value={contactForm[field]}
                      onChange={(e) => setContactForm({ ...contactForm, [field]: e.target.value })}
                      style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", fontSize: "15px", color: "white", outline: "none", fontFamily: "'Inter', sans-serif", transition: "0.2s" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(34,197,94,0.4)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
                    />
                  </div>
                ))}
                <textarea
                  rows={5}
                  placeholder="How can we help your cultivation operation?"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", fontSize: "15px", color: "white", outline: "none", resize: "none", fontFamily: "'Inter', sans-serif", transition: "0.2s" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(34,197,94,0.4)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
                />
                <button
                  type="submit"
                  disabled={contactLoading}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "18px 24px", background: contactLoading ? "rgba(34,197,94,0.4)" : "#22c55e", color: "#0a0e0a", borderRadius: "14px", border: "none", fontWeight: 800, fontSize: "16px", cursor: contactLoading ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.3s", boxShadow: contactLoading ? "none" : "0 10px 30px rgba(34,197,94,0.2)" }}
                  onMouseEnter={(e) => { if(!contactLoading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { if(!contactLoading) e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {contactLoading ? "Sending..." : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ SECTION ── */}
      <section style={{ padding: "120px 0", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", marginBottom: "20px" }}>
              <MessageSquare size={12} color="#16a34a" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>Common Queries</span>
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px", color: "#0f172a" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b", maxWidth: "480px", margin: "0 auto" }}>
              Quick answers to help you get the most out of our AI-powered agricultural intelligence.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { q: "How accurate is the Identify & Health Matrix AI?", a: "Our models have been trained on verified datasets specific to South Asian botanical species, achieving an average accuracy of 94% on critical medicinal species." },
              { q: "Do I need an internet connection in the field?", a: "The web application requires internet to process images. However, you can cache sensor data offline and it will automatically sync when you regain cellular coverage." },
              { q: "How do AI credits work?", a: "One credit equals one distinct AI operation. Credits never expire and remain in your account indefinitely, giving you full flexibility." },
              { q: "Which soil sensors are compatible?", a: "GreenAyu's telemetry engine accepts data from any standard MQTT-enabled agricultural sensor array (Arduino, ESP32, etc)." }
            ].map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} style={{ background: "#ffffff", border: isOpen ? "1px solid rgba(34,197,94,0.4)" : "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", transition: "0.3s", boxShadow: isOpen ? "0 10px 30px rgba(34,197,94,0.1)" : "none" }}>
                  <div 
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  >
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: isOpen ? "#16a34a" : "#0f172a", paddingRight: "24px", lineHeight: 1.5 }}>
                      {faq.q}
                    </h4>
                    <div style={{ color: isOpen ? "#16a34a" : "rgba(0,0,0,0.3)", flexShrink: 0, width: "32px", height: "32px", background: isOpen ? "rgba(34,197,94,0.1)" : "#f1f5f9", borderRadius: "8px", display: "grid", placeItems: "center" }}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 24px 24px", color: "#64748b", fontSize: "15px", lineHeight: 1.7 }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link to="/faq" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#16a34a", fontWeight: 700, fontSize: "15px", textDecoration: "none" }}>
              View all questions <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "120px 0", background: "linear-gradient(180deg, #0d1a0d 0%, #060a06 100%)", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Container style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
            <TrendingUp size={12} color="#22c55e" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e" }}>Join 12,000+ Farmers</span>
          </div>
          <h2 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "20px" }}>
            Your Farm Deserves<br />AI That Actually Works
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.45)", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>
            Start with 50 free AI credits. No credit card. Cancel anytime.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "18px 36px", background: "#22c55e", color: "#0a0e0a", borderRadius: "12px", fontWeight: 800, fontSize: "17px", textDecoration: "none", boxShadow: "0 0 40px rgba(34,197,94,0.35)", transition: "0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; }}>
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/packages" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "18px 36px", background: "transparent", color: "rgba(255,255,255,0.7)", borderRadius: "12px", fontWeight: 700, fontSize: "17px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", transition: "0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              View Packages
            </Link>
          </div>
        </Container>
      </section>

      {/* Responsive Styles */}
      <style>{`
        .home-stats-grid { grid-template-columns: repeat(4, 1fr); }
        .home-contact-grid { grid-template-columns: 1fr 1fr; }
        
        @media (max-width: 900px) {
          .home-contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 768px) {
          .home-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          section { padding: 80px 0 !important; }
        }
        @media (max-width: 480px) {
          .home-stats-grid { grid-template-columns: 1fr !important; }
          section { padding: 60px 0 !important; }
        }
      `}</style>
    </div>
  );
}
