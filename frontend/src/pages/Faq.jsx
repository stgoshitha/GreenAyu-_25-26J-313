import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, MessageSquare, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Platform & AI Models",
      items: [
        { q: "How accurate is the botanical diagnostic AI?", a: "Our models have been trained on verified datasets specific to South Asian botanical species, achieving an average accuracy of 94% on 5 critical disease types." },
        { q: "Can the AI identify diseases before they are visible?", a: "While the primary computer vision model relies on visual symptoms, our Yield and Telemetry integration can alert you to soil/environmental conditions that historically predict fungal outbreaks before they occur." },
        { q: "Do I need an internet connection in the field?", a: "Yes and no. The web application requires internet to process images. However, you can cache sensor data offline and it will automatically sync when you regain cellular or Wi-Fi coverage." }
      ]
    },
    {
      category: "Credits & Billing",
      items: [
        { q: "How do AI credits work?", a: "One credit equals one distinct AI operation (e.g., checking one leaf image for disease, or grading one batch of bark). Credits never expire and remain in your account indefinitely." },
        { q: "Can I upgrade my farm package later?", a: "Absolutely. You can request a package upgrade right from your dashboard. Once approved by our team, your account limits and credit balances are instantly updated." },
        { q: "Do you offer refunds for unused credits?", a: "We do not offer cash refunds for unused credits, but credits are fully transferable to another registered farmer within the GreenAyu network." }
      ]
    },
    {
      category: "Hardware & Sensors",
      items: [
        { q: "Which soil sensors are compatible?", a: "GreenAyu's telemetry engine accepts data from any standard MQTT-enabled agricultural sensor array. We provide Arduino/ESP32 driver code for custom integrations upon request." },
        { q: "How often is the telemetry data updated?", a: "Data is streamed in real-time. The dashboard refreshes every 20 seconds, ensuring you have up-to-the-minute atmospheric and soil-level intelligence." }
      ]
    }
  ];

  // Flatten for search
  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

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
              <MessageSquare size={12} color="#22c55e" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px" }}>Support Center</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "24px", color: "white", lineHeight: 1.1 }}>
              Frequently Asked <span style={{ color: "#22c55e" }}>Questions</span>
            </h1>
            
            {/* Search Bar */}
            <div style={{ maxWidth: "500px", margin: "0 auto", position: "relative" }}>
              <Search size={20} color="rgba(255,255,255,0.4)" style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: "100%", padding: "18px 20px 18px 56px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", 
                  border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: "16px", outline: "none", transition: "0.2s" 
                }}
                onFocus={(e) => e.target.style.borderColor = "#22c55e"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── FAQ ACCORDION (WHITE SECTION) ── */}
      <section style={{ padding: "80px 0 120px", background: "#f8fafc", color: "#0a0e0a", borderRadius: "40px 40px 0 0", minHeight: "500px", zIndex: 2, position: "relative" }}>
        <Container>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
            {filteredFaqs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,0.4)" }}>
                <Terminal size={48} color="rgba(0,0,0,0.2)" style={{ margin: "0 auto 20px" }} />
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>No results found</h3>
                <p>We couldn't find any questions matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredFaqs.map((category, catIndex) => (
                <div key={catIndex} style={{ marginBottom: "48px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 900, marginBottom: "20px", color: "#060a06", paddingBottom: "12px", borderBottom: "2px solid rgba(22,163,74,0.2)" }}>
                    {category.category}
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {category.items.map((faq, faqIndex) => {
                      const globalIndex = catIndex + "-" + faqIndex;
                      const isOpen = activeFaq === globalIndex;
                      
                      return (
                        <div key={faqIndex} style={{ background: "#ffffff", border: isOpen ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(0,0,0,0.05)", borderRadius: "16px", overflow: "hidden", transition: "0.3s", boxShadow: isOpen ? "0 10px 30px rgba(34,197,94,0.1)" : "none" }}>
                          <div 
                            onClick={() => setActiveFaq(isOpen ? null : globalIndex)}
                            style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                          >
                            <h4 style={{ fontSize: "16px", fontWeight: 700, color: isOpen ? "#16a34a" : "#060a06", paddingRight: "24px", lineHeight: 1.5 }}>
                              {faq.q}
                            </h4>
                            <div style={{ color: isOpen ? "#16a34a" : "rgba(0,0,0,0.3)", flexShrink: 0, width: "32px", height: "32px", background: isOpen ? "rgba(34,197,94,0.1)" : "#f8fafc", borderRadius: "8px", display: "grid", placeItems: "center" }}>
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
                                <div style={{ padding: "0 24px 24px", color: "rgba(0,0,0,0.6)", fontSize: "15px", lineHeight: 1.7 }}>
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

          </div>
        </Container>
      </section>

      {/* ── CTA BANNER (DARK) ── */}
      <section style={{ padding: "80px 0", background: "#060a06", textAlign: "center" }}>
        <Container>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "white", marginBottom: "16px" }}>Still have questions?</h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>Our support agronomists are here to help you get the most out of GreenAyu.</p>
          <Link to="/contact" style={{ display: "inline-block", padding: "14px 28px", background: "#22c55e", color: "#0a0e0a", borderRadius: "12px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
            Contact Support
          </Link>
        </Container>
      </section>
      
    </div>
  );
}
