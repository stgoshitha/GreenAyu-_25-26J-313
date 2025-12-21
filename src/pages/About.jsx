import React from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Microscope, Sprout, ShieldCheck, Zap } from "lucide-react";
import Page from "./_shared/Page";
import Container from "../components/layout/Container";

export default function About() {
  const values = [
    { 
      icon: <Microscope size={24} />, 
      title: "Scientific Precision", 
      desc: "Moving beyond guesswork with AI models trained on verified botanical datasets." 
    },
    { 
      icon: <Sprout size={24} />, 
      title: "Farmer Centric", 
      desc: "Designed for high-glare field usage and one-handed mobile navigation." 
    },
    { 
      icon: <ShieldCheck size={24} />, 
      title: "Quality First", 
      desc: "Standardizing the grading process to ensure pharmaceutical-grade supply chains." 
    }
  ];

  return (
    <Page title="About the Portal" subtitle="The bridge between traditional botanical knowledge and modern AI.">
      <Container>
        {/* Mission Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '60px', 
          alignItems: 'center',
          padding: '60px 0'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', marginBottom: '16px' }}>
              <Target size={20} />
              <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>Our Mission</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#0f172a', marginBottom: '24px', lineHeight: 1.1 }}>
              Standardizing the <span style={{ color: '#22c55e' }}>Medicinal Plant</span> Industry.
            </h2>
            <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
              For too long, medicinal plant identification and quality checking relied on subjective visual cues. AgricultorPortal digitizes this expertise.
            </p>
            <p style={{ color: '#64748b', lineHeight: 1.7 }}>
              Our portal provides farmers and storage operators with a simple, robust interface to identify species, monitor crop health, and assess part-specific quality (leaves, roots, bark) before they hit the market.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ 
              background: '#f1f5f9', 
              borderRadius: '32px', 
              padding: '40px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
             <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>What makes us different?</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AboutFeature text="Clean UI optimized for field usage" />
                  <AboutFeature text="Separate modules for modular API integration" />
                  <AboutFeature text="Instant reporting and quality grading cards" />
                  <AboutFeature text="Mobile-first responsive architecture" />
                </ul>
             </div>
             <LeafBackgroundIcon />
          </motion.div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          padding: '80px 0' 
        }}>
          {values.map((v, idx) => (
            <div key={idx} style={{ 
              padding: '32px', 
              background: 'white', 
              borderRadius: '24px', 
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ color: '#22c55e', marginBottom: '16px' }}>{v.icon}</div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>{v.title}</h4>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Page>
  );
}

function AboutFeature({ text }) {
  return (
    <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#475569', fontSize: '15px' }}>
      <CheckCircle2 size={18} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
      {text}
    </li>
  );
}

function LeafBackgroundIcon() {
  return (
    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.05, transform: 'rotate(-15deg)' }}>
      <Sprout size={200} />
    </div>
  );
}