import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Github, Twitter, Linkedin, Zap, ShieldCheck, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../layout/Container";

export default function Footer() {
  // Matching the CTA background precisely
  const BG_COLOR = '#064e3b'; 
  const ACCENT = '#34d399'; // Bright mint green from CTA span

  return (
    <footer style={{ 
      background: BG_COLOR, 
      paddingTop: '80px', 
      position: 'relative',
      overflow: 'hidden',
      color: '#d1fae5' // Light minty text for readability
    }}>
      {/* Decorative Bio-mesh Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30-30-30z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        pointerEvents: 'none'
      }} />

      <Container>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '40px', 
          position: 'relative',
          zIndex: 1
        }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ 
                padding: '8px', 
                background: ACCENT, 
                borderRadius: '10px',
              }}>
                <Leaf size={22} color={BG_COLOR} fill={BG_COLOR} />
              </div>
              <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                Agricultor<span style={{ color: ACCENT }}>Portal</span>
              </h2>
            </div>
            <p style={{ lineHeight: 1.6, fontSize: '15px', marginBottom: '28px', color: '#a7f3d0' }}>
              Advanced botanical intelligence for medicinal plant growers. Standardizing quality through AI diagnostics.
            </p>
            
            {/* Live Status */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '8px 14px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <motion.div 
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ width: '6px', height: '6px', background: ACCENT, borderRadius: '50%' }} 
              />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'white', letterSpacing: '1px' }}>
                Core Engine Active
              </span>
            </div>
          </div>

          {/* Intelligence Links */}
          <FooterSection title="Analysis Hub">
            <FancyLink to="/features/identify-health" label="Species ID" icon={<Zap size={14} />} accent={ACCENT} />
            <FancyLink to="/features/parts-quality" label="Quality Grading" icon={<ShieldCheck size={14} />} accent={ACCENT} />
            <FancyLink to="/features/shelf-life" label="Shelf-Life Predictor" icon={<HeartPulse size={14} />} accent={ACCENT} />
          </FooterSection>

          {/* Ground Control */}
          <FooterSection title="Contact">
            <ContactItem icon={<Mail size={18} />} label="Email" val="support@agricultor.lk" accent={ACCENT} />
            <ContactItem icon={<MapPin size={18} />} label="Location" val="Negombo, Sri Lanka" accent={ACCENT} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
               <SocialCircle icon={<Twitter size={18} />} accent={ACCENT} />
               <SocialCircle icon={<Linkedin size={18} />} accent={ACCENT} />
            </div>
          </FooterSection>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          marginTop: '60px',
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ fontSize: '13px', color: '#a7f3d0' }}>
            © {new Date().getFullYear()} AgricultorPortal. Professional Botanical Systems.
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
            <Link to="/terms" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Usage Rights</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// Sub-components
function FooterSection({ title, children }) {
  return (
    <div>
      <h4 style={{ color: 'white', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>
        {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
    </div>
  );
}

function FancyLink({ to, label, icon, accent }) {
  return (
    <Link to={to} style={{ 
      color: '#d1fae5', 
      textDecoration: 'none', 
      fontSize: '14px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      transition: 'transform 0.2s ease'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = accent; e.currentTarget.style.transform = 'translateX(5px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = '#d1fae5'; e.currentTarget.style.transform = 'translateX(0)'; }}
    >
      <span style={{ color: accent }}>{icon}</span> {label}
    </Link>
  );
}

function ContactItem({ icon, label, val, accent }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: accent, textTransform: 'uppercase', marginBottom: '2px' }}>
        {icon} {label}
      </div>
      <div style={{ color: 'white', fontSize: '14px' }}>{val}</div>
    </div>
  );
}

function SocialCircle({ icon, accent }) {
  return (
    <a href="#" style={{ 
      width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', 
      border: '1px solid rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center',
      color: 'white', transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#064e3b'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; }}
    >
      {icon}
    </a>
  );
}