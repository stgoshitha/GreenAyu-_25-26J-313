import React from "react";
import { motion } from "framer-motion";
import { LogIn, MousePointer2, UploadCloud, BarChart3 } from "lucide-react";
import Container from "../layout/Container";

const steps = [
  { 
    n: "01", 
    title: "Secure Access", 
    desc: "Login with your credentials. Demo mode available for instant testing.",
    icon: <LogIn size={20} />,
    color: "#22c55e"
  },
  { 
    n: "02", 
    title: "Select Module", 
    desc: "Choose between Health ID, Yield, or Quality analysis tools.",
    icon: <MousePointer2 size={20} />,
    color: "#38bdf8"
  },
  { 
    n: "03", 
    title: "Data Input", 
    desc: "Upload images or enter environmental data for the AI to process.",
    icon: <UploadCloud size={20} />,
    color: "#a855f7"
  },
  { 
    n: "04", 
    title: "AI Insights", 
    desc: "Receive deep diagnostics and actionable farming recommendations.",
    icon: <BarChart3 size={20} />,
    color: "#f59e0b"
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '100px 0', background: '#fafafa', overflow: 'hidden' }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>The Workflow</h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
            From the field to the dashboard in four simple steps. Optimized for high-speed analysis.
          </p>
        </div>

        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Vertical Line (Centered on Desktop, Left on Mobile) */}
          <div style={{ 
            position: 'absolute', 
            left: '50%', 
            top: 0, 
            bottom: 0, 
            width: '2px', 
            background: 'linear-gradient(to bottom, transparent, #e2e8f0 15%, #e2e8f0 85%, transparent)',
            transform: 'translateX(-50%)',
            display: 'var(--display-line, block)' // Can be hidden via CSS if needed
          }} className="hide-mobile-line" />

          {steps.map((s, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                style={{
                  display: 'flex',
                  justifyContent: isEven ? 'flex-start' : 'flex-end',
                  marginBottom: '60px',
                  position: 'relative',
                  width: '100%'
                }}
              >
                {/* Desktop Center Connector Dot */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '24px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'white',
                  border: `3px solid ${s.color}`,
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  boxShadow: `0 0 15px ${s.color}40`
                }} className="hide-mobile-dot" />

                {/* Step Card */}
                <div style={{ 
                  width: 'clamp(300px, 45%, 420px)',
                  background: 'white',
                  padding: '30px',
                  borderRadius: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: '1px solid #f1f5f9',
                  textAlign: 'left'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: `${s.color}15`, 
                    color: s.color,
                    display: 'grid',
                    placeItems: 'center',
                    marginBottom: '20px'
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>STEP {s.n}</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '8px 0 12px 0' }}>{s.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>

      {/* Basic Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile-line { left: 20px !important; transform: none !important; }
          .hide-mobile-dot { left: 20px !important; transform: none !important; }
          div[style*="justifyContent"] { justifyContent: flex-start !important; padding-left: 40px !important; }
          div[style*="width: clamp"] { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}