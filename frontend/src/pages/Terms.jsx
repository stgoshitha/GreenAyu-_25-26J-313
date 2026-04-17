import React from "react";
import { motion } from "framer-motion";
import { Scale, ShieldAlert, Database, FileText, Info } from "lucide-react";
import Container from "../components/layout/Container";

export default function Terms() {
  const sections = [
    {
      icon: <Scale size={24} color="#16a34a" />,
      title: "Botanical Accuracy & Usage",
      content: "This portal provides AI-driven estimates and recommendations for medicinal plant species. While our models are trained on high-quality botanical datasets, all automated identifications and health assessments should be validated by a certified herbalist or laboratory before commercial distribution."
    },
    {
      icon: <Database size={24} color="#16a34a" />,
      title: "Data Integrity & Security",
      content: "Once the backend API is connected, all plant imagery and diagnostic history are handled according to industry-standard encryption. Users are responsible for maintaining the confidentiality of their credentials and ensuring uploaded data follows local agricultural compliance regulations."
    },
    {
      icon: <ShieldAlert size={24} color="#16a34a" />,
      title: "Professional Disclaimer",
      content: "Predictions (including quality grades, yield estimates, and shelf-life forecasts) are variable. Factors such as camera lens quality, lighting conditions, and environmental variables can impact AI accuracy. GreenAyu is not liable for crop loss or quality deviations."
    }
  ];

  return (
    <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>
      
      {/* ── HEADER (DARK) ── */}
      <section style={{ position: "relative", padding: "120px 0 80px", background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        
        <Container style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
              <Scale size={12} color="#22c55e" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px" }}>Legal & Compliance</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "24px", color: "white", lineHeight: 1.1 }}>
              Terms of <span style={{ color: "#22c55e" }}>Service</span>
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 auto", maxWidth: "600px" }}>
              Ensuring safety, transparency, and data integrity across the botanical intelligence network.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── TERMS CONTENT (WHITE SECTION) ── */}
      <section style={{ padding: "80px 0 120px", background: "#f8fafc", color: "#0a0e0a", borderRadius: "40px 40px 0 0", minHeight: "500px", zIndex: 2, position: "relative" }}>
        <Container>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
            {/* Important Notice Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{ background: "#f0fdf4", border: "1px solid rgba(22,163,74,0.3)", padding: "24px 32px", borderRadius: "20px", display: "flex", gap: "20px", marginBottom: "60px", alignItems: "center", boxShadow: "0 10px 30px rgba(22,163,74,0.05)" }}
            >
              <div style={{ width: "48px", height: "48px", background: "white", borderRadius: "12px", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                <Info color="#16a34a" size={24} />
              </div>
              <p style={{ margin: 0, color: "#166534", fontSize: "15px", lineHeight: 1.6 }}>
                <b>Notice for Field Operators:</b> By using this portal, you acknowledge that AI diagnostics are supporting tools, not a replacement for official pharmaceutical quality testing.
              </p>
            </motion.div>

            {/* Sections List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
              {sections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ display: "flex", gap: "24px", paddingBottom: "48px", borderBottom: idx !== sections.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                >
                  <div style={{ width: "56px", height: "56px", background: "rgba(22,163,74,0.1)", borderRadius: "16px", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#060a06", marginBottom: "16px", letterSpacing: "-0.5px" }}>
                      {section.title}
                    </h3>
                    <p style={{ color: "rgba(0,0,0,0.6)", lineHeight: 1.8, fontSize: "16px", margin: 0 }}>
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Connect Box */}
            <div style={{ marginTop: "60px", textAlign: "center", padding: "48px", background: "white", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 20px 40px rgba(0,0,0,0.02)" }}>
              <FileText size={32} color="rgba(0,0,0,0.2)" style={{ margin: "0 auto 16px" }} />
              <h4 style={{ color: "#060a06", fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>Questions regarding our terms?</h4>
              <p style={{ color: "rgba(0,0,0,0.5)", fontSize: "15px" }}>
                Please contact our legal and compliance team at <b style={{ color: "#16a34a" }}>legal@greenayu.lk</b>
              </p>
            </div>

          </div>
        </Container>
      </section>

    </div>
  );
}