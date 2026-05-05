import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import API from "../services/api";
import Swal from "sweetalert2";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: "How fast do you respond to technical issues?", a: "Our support team operates 24/7 during standard Sri Lankan harvest seasons. We guarantee a response time of under 4 hours for technical platform issues." },
    { q: "Can I request a custom API integration for my farm's ERP?", a: "Absolutely. We offer dedicated enterprise solutions where our engineers will work directly with your IT systems to pipe diagnostic data straight into your ERP." },
    { q: "Do you offer on-site training for our agronomists?", a: "Yes. For Enterprise accounts, we provide comprehensive 2-day on-site training sessions to ensure your staff fully masters the field-app and telemetry dashboard." },
    { q: "What if my farm is in an area with no internet?", a: "Our mobile application features an 'offline-first' mode. You can capture photos and sensor readings in the field, and the app will automatically sync and run the AI diagnostics once you reach a Wi-Fi or cellular zone." }
  ];

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/contact", form);
      if (res.data.success) {
        Swal.fire({
          title: "Message Sent!",
          text: "Thank you for reaching out. We have received your request and our agronomist team will review it shortly.",
          icon: "success",
          confirmButtonColor: "#22c55e",
          background: "#0d120d",
          color: "#fff",
        });
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error("Contact form error:", err);
      Swal.fire({
        title: "Submission Failed",
        text: err.response?.data?.message || "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#0d120d",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.1)',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: '#ffffff',
    color: '#060a06',
    fontFamily: "inherit"
  };

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
            <h1 style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "24px", color: "white", lineHeight: 1.1 }}>
              Let's build your <br />
              <span style={{ color: "#22c55e" }}>smart farm.</span>
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              Whether you're an independent grower or an Ayurvedic corporation, our engineers are ready to optimize your yield.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── FORM SECTION (WHITE) ── */}
      <section style={{ padding: "100px 0", background: "#f8fafc", color: "#0a0e0a", borderRadius: "40px 40px 0 0", position: "relative", zIndex: 2 }}>
        <Container>
          <div className="contact-split-grid" style={{ display: "grid", background: "#ffffff", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.05)" }}>
            
            {/* Left Panel: Info */}
            <div style={{ position: "relative", background: "linear-gradient(160deg, #0a1a0a 0%, #060a06 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", overflow: "hidden", color: "white" }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: "48px", height: "48px", background: "rgba(34,197,94,0.1)", borderRadius: "14px", display: "grid", placeItems: "center", marginBottom: "32px" }}>
                  <MessageSquare size={24} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "16px", letterSpacing: "-1px" }}>Contact Details</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "48px", fontSize: "15px" }}>
                  Have questions about our AI models or require a custom volume demonstration? Reach out today.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <ContactItem icon={<Mail size={20} />} title="Email" detail="greenayu.agricultor@gmail.com" />
                  <ContactItem icon={<Phone size={20} />} title="Phone" detail="+94 77 123 4567" />
                  <ContactItem icon={<MapPin size={20} />} title="HQ Location" detail="Colombo Innovation Center, SL" />
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 1, marginTop: "60px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldCheck size={18} color="#22c55e" />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Enterprise SLA guaranteed response under 24hrs</span>
              </div>
            </div>

            {/* Right Panel: Form */}
            <div style={{ padding: "48px", background: "#ffffff" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 900, color: "#060a06", marginBottom: "8px", letterSpacing: "-0.5px" }}>Send us a message</h3>
              <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.5)", marginBottom: "32px" }}>Fill out the form below and we'll route it to the right department.</p>
              
              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="form-row-grid" style={{ display: "grid", gap: "24px", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#060a06" }}>Full Name</label>
                    <input 
                      style={inputStyle} 
                      placeholder="e.g. Nimal Perera"
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      required
                      onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#060a06" }}>Email Address</label>
                    <input 
                      type="email" 
                      style={inputStyle} 
                      placeholder="e.g. nimal@farm.lk"
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      required
                      onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                      onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 700, color: "#060a06" }}>How can we help?</label>
                  <textarea 
                    rows={5} 
                    style={{ ...inputStyle, resize: "none" }} 
                    placeholder="Tell us about your cultivation scale and requirements..."
                    value={form.message} 
                    onChange={(e) => setForm({ ...form, message: e.target.value })} 
                    required
                    onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    background: loading ? "rgba(34,197,94,0.5)" : "#22c55e", 
                    color: "#0a0e0a", 
                    padding: "18px", 
                    borderRadius: "14px", 
                    border: "none", 
                    fontWeight: 800, 
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginTop: "12px",
                    boxShadow: "0 10px 20px rgba(34, 197, 94, 0.2)"
                  }}
                >
                  {loading ? 'Sending Transmission...' : 'Send Message'} <Send size={18} />
                </button>
              </form>
            </div>
            
          </div>
        </Container>
      </section>

      {/* ── FAQ (DARK) ── */}
      <section style={{ padding: "120px 0", background: "#060a06" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1px", color: "white", marginBottom: "16px" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto" }}>
              Quick answers about deploying GreenAyu on your farm.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} style={{ background: "#0d170d", border: isOpen ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden", transition: "0.3s" }}>
                  <div 
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  >
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: isOpen ? "#22c55e" : "white", paddingRight: "24px" }}>{faq.q}</h4>
                    <div style={{ color: isOpen ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
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
                        <div style={{ padding: "0 32px 32px", color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.6 }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── CTA BANNER (DARK/GREEN) ── */}
      <section style={{ padding: "100px 0", background: "linear-gradient(180deg, #0d1a0d 0%, #060a06 100%)", borderTop: "1px solid rgba(34,197,94,0.1)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: "24px", color: "white" }}>
            Ready to upgrade your farm?
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px" }}>
            Experience the future of botanical precision with absolutely no risk. Sign up in 30 seconds.
          </p>
          <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 32px", background: "#22c55e", color: "#0a0e0a", borderRadius: "12px", fontWeight: 800, fontSize: "16px", textDecoration: "none", boxShadow: "0 0 30px rgba(34,197,94,0.3)", transition: "0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#16a34a"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#22c55e"}
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
        </Container>
      </section>

      {/* Responsive Styles */}
      <style>{`
        .contact-split-grid { grid-template-columns: 1fr 1.2fr; }
        @media (max-width: 900px) {
          .contact-split-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .form-row-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          section { padding: 60px 0 !important; }
        }
      `}</style>
    </div>
  );
}

function ContactItem({ icon, title, detail }) {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <div style={{ color: "#22c55e" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "2px", letterSpacing: "1px" }}>{title}</div>
        <div style={{ fontSize: "16px", fontWeight: 600, color: "white" }}>{detail}</div>
      </div>
    </div>
  );
}