import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shovel, ShieldCheck, Microscope } from "lucide-react";
import Container from "../layout/Container";

export default function CTASection() {
  return (
    <section style={{ 
      padding: 'clamp(60px, 10vw, 120px) 0', 
      background: '#064e3b', // Deep emerald forest green
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Bio-luminescent Glow Effects */}
      <div style={{ 
        position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', 
        background: 'rgba(52, 211, 153, 0.2)', filter: 'blur(100px)', borderRadius: '50%' 
      }} />
      <div style={{ 
        position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', 
        background: 'rgba(16, 185, 129, 0.15)', filter: 'blur(80px)', borderRadius: '50%' 
      }} />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'clamp(24px, 4vw, 40px)',
            padding: 'clamp(40px, 6vw, 80px)',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {/* Quality Badge */}
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(255, 255, 255, 0.1)', padding: '8px 20px', 
            borderRadius: '100px', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <ShieldCheck size={16} color="#34d399" />
            <span style={{ color: '#ecfdf5', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
              Standardized Botanical Analysis
            </span>
          </div>

          <h2 style={{ 
            color: 'white', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, 
            lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.02em' 
          }}>
            Guarantee the Purity of <br />
            <span style={{ color: '#34d399' }}>Every Harvest.</span>
          </h2>

          <p style={{ 
            color: '#d1fae5', fontSize: 'clamp(16px, 1.5vw, 19px)', 
            maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6, opacity: 0.9
          }}>
            From instant species identification to deep quality grading, empower your cultivation with AI-driven botanical precision. Ensure safety, potency, and compliance in one tap.
          </p>

          <div style={{ 
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' 
          }}>
            <Link to="/identify-health" style={{ 
              background: '#34d399', color: '#064e3b', padding: '16px 36px', 
              borderRadius: '12px', fontWeight: 700, display: 'flex', 
              alignItems: 'center', gap: '10px', fontSize: '16px',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(52, 211, 153, 0.2)'
            }}>
              Start Identification <ArrowRight size={18} />
            </Link>
            
            <Link to="/parts-quality" style={{ 
              background: 'transparent', color: 'white', padding: '16px 36px', 
              borderRadius: '12px', fontWeight: 600, border: '2px solid rgba(255, 255, 255, 0.2)',
              fontSize: '16px', transition: 'all 0.3s ease'
            }}>
              Check Quality Grade
            </Link>
          </div>

          {/* Background Decorative Icons */}
          <div className="hide-on-mobile" style={{ pointerEvents: 'none' }}>
            <FloatingIcon icon={<Microscope size={28} />} top="15%" left="8%" delay={0} />
            <FloatingIcon icon={<Shovel size={28} />} bottom="20%" right="10%" delay={1} />
          </div>
        </motion.div>
      </Container>

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none; }
          div[style*="flexWrap: wrap"] { flex-direction: column; width: 100%; }
          a { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}

function FloatingIcon({ icon, top, bottom, left, right, delay }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -12, 0],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{
        position: 'absolute', top, bottom, left, right,
        color: '#34d399'
      }}
    >
      {icon}
    </motion.div>
  );
}