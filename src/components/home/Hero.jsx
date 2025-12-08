import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  Zap, 
  Target, 
  ChevronRight
} from "lucide-react";
import Container from "../layout/Container";

const BG_IMAGE = "https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?auto=format&fit=crop&w=2000&q=80";

export default function Hero() {
  return (
    <section style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      background: '#f8fafc',
      paddingTop: 'clamp(60px, 10vh, 100px)',
      paddingBottom: 'clamp(60px, 10vh, 80px)'
    }}>
      {/* Decorative Blur Backgrounds */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '60%', background: 'rgba(34,197,94,0.08)', filter: 'blur(120px)', borderRadius: '100%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '0', right: '0', width: '30%', height: '50%', background: 'rgba(56,189,248,0.05)', filter: 'blur(100px)', borderRadius: '100%', zIndex: 0 }} />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'grid', 
          // Responsive Grid: 1 column on mobile, 2 columns on desktop
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'clamp(40px, 8vw, 80px)', 
          alignItems: 'center' 
        }}>
          
          {/* LEFT: TEXT & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }} />
              <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>
                Agricultural Intelligence
              </span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(40px, 8vw, 72px)', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: '-2px', 
              marginBottom: '24px' 
            }}>
              Smart Care for <br />
              <span style={{ color: 'var(--muted2)', fontWeight: 400, fontStyle: 'italic' }}>Medicinal</span> Plants.
            </h1>

            <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '500px', marginBottom: '40px' }}>
              The all-in-one ecosystem for plant identification, disease detection, and yield optimization. Built for the modern grower.
            </p>

            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', // Wrap buttons on tiny screens
              alignItems: 'center', 
              gap: '20px' 
            }}>
              <Link to="/register" style={{ 
                background: 'var(--text)', color: 'white', padding: '16px 32px', borderRadius: '100px', fontWeight: 600, 
                display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                fontSize: '15px'
              }}>
                Get Started <Plus size={18} />
              </Link>
              <Link to="/features" style={{ fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px' }}>
                Explore Modules <ChevronRight size={18} />
              </Link>
            </div>

            {/* Trusted/Stats Footnote */}
            <div style={{ marginTop: 'clamp(40px, 6vw, 60px)', display: 'flex', gap: '40px' }}>
              <StatItem value="98%" label="AI Accuracy" />
              <StatItem value="12k+" label="Plants Scanned" />
            </div>
          </motion.div>

          {/* RIGHT: THE "ACTION STACK" */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '520px', 
            margin: '0 auto', // Center on mobile
            marginTop: '20px' 
          }}>
            {/* Main Featured Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                borderRadius: 'clamp(24px, 5vw, 40px)',
                overflow: 'hidden',
                aspectRatio: '4/5', // Ensures height scales with width
                position: 'relative',
                boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
                border: 'clamp(4px, 1vw, 8px) solid white'
              }}
            >
              <img src={BG_IMAGE} alt="Nature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
              
              <div style={{ position: 'absolute', bottom: 'clamp(20px, 5vw, 30px)', left: 'clamp(20px, 5vw, 30px)', color: 'white', paddingRight: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', display: 'inline-block', marginBottom: '8px', fontWeight: 600 }}>
                  Featured Module
                </div>
                <h3 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, margin: 0 }}>Precision Analysis</h3>
              </div>
            </motion.div>

            {/* Overlapping Floating UI Cards - Adjusted for Mobile */}
            <OverlayCard 
              position={{ top: '-5%', right: '-5%' }} 
              icon={<Zap size={18} fill="currentColor"/>} 
              title="Yield Engine" 
              sub="v2.4 Active" 
              color="#22c55e"
            />
            
            <OverlayCard 
              position={{ bottom: '15%', left: '-8%' }} 
              icon={<Target size={18} />} 
              title="Health Scan" 
              sub="Identifying..." 
              color="#38bdf8"
              delay={0.4}
            />

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '-5%',
                padding: '12px 16px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 11
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fb7185', boxShadow: '0 0 10px #fb7185' }} />
              <span style={{ fontWeight: 700, fontSize: '12px', whiteSpace: 'nowrap' }}>Live Diagnostics</span>
            </motion.div>
          </div>

        </div>
      </Container>
    </section>
  );
}

// Sub-components to keep code clean
function StatItem({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800 }}>{value}</span>
      <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

function OverlayCard({ position, icon, title, sub, color, delay = 0.3 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      style={{
        position: 'absolute',
        ...position,
        background: 'white',
        padding: 'clamp(12px, 3vw, 18px)',
        borderRadius: 'clamp(16px, 4vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        zIndex: 12,
        maxWidth: '180px'
      }}
    >
      <div style={{ 
        width: '36px', 
        height: '36px', 
        borderRadius: '10px', 
        background: `${color}15`, 
        color: color, 
        display: 'grid', 
        placeItems: 'center',
        flexShrink: 0 
      }}>
        {icon}
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ fontWeight: 800, fontSize: '13px', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>{sub}</div>
      </div>
    </motion.div>
  );
}