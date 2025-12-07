import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown } from "lucide-react";
import Page from "./_shared/Page";
import Container from "../components/layout/Container";

const plans = [
  {
    name: "Starter",
    icon: <Zap size={20} />,
    price: "0",
    period: "/forever",
    desc: "Perfect for students and botanical researchers testing the UI.",
    features: ["Basic dashboard access", "Standard plant database", "Demo analysis flows", "Community support"],
    cta: "Use Demo",
    highlight: false,
  },
  {
    name: "Pro",
    icon: <Shield size={20} />,
    price: "4,990",
    period: "/month",
    desc: "For commercial farms needing real-time AI diagnostic power.",
    features: ["Unlimited API requests", "Quality grading history", "PDF health reports", "Priority botanical support", "Early access to new models"],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Enterprise",
    icon: <Crown size={20} />,
    price: "Custom",
    period: "",
    desc: "Full-scale integration for pharmaceutical supply chains.",
    features: ["Dedicated Flask server", "Multi-user permissions", "White-label reports", "On-site deployment help", "24/7 Phone support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Packages() {
  return (
    <Page title="Scale Your Growth" subtitle="Choose the precision level your botanical operation requires.">
      <Container>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '32px', 
          padding: '40px 0 100px' 
        }}>
          {plans.map((p, idx) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                position: 'relative',
                background: p.highlight ? '#ffffff' : 'transparent',
                border: p.highlight ? '2px solid #22c55e' : '1px solid #e2e8f0',
                borderRadius: '32px',
                padding: '48px 32px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: p.highlight ? '0 20px 40px rgba(34, 197, 94, 0.1)' : 'none',
                height: '100%'
              }}
            >
              {p.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#22c55e',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: '32px' }}>
                <div style={{ 
                  color: p.highlight ? '#22c55e' : '#64748b',
                  marginBottom: '16px'
                }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.5 }}>
                  {p.desc}
                </p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>LKR</span>
                  <span style={{ fontSize: '48px', fontWeight: 900, color: '#0f172a' }}>{p.price}</span>
                  <span style={{ fontSize: '16px', color: '#64748b' }}>{p.period}</span>
                </div>
              </div>

              <div style={{ flexGrow: 1, marginBottom: '40px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#475569' }}>
                      <div style={{ 
                        width: '20px', height: '20px', borderRadius: '50%', 
                        background: p.highlight ? '#dcfce7' : '#f1f5f9', 
                        display: 'grid', placeItems: 'center', flexShrink: 0 
                      }}>
                        <Check size={12} color={p.highlight ? '#22c55e' : '#94a3b8'} strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: p.highlight ? '#22c55e' : '#f1f5f9',
                color: p.highlight ? 'white' : '#0f172a',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </Container>
    </Page>
  );
}