import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScanSearch, Sprout, LineChart, Timer, Puzzle, ArrowUpRight } from "lucide-react";
import Container from "../layout/Container";
import { Link } from "react-router-dom";

const items = [
  { icon: <ScanSearch size={24} />, title: "Identify Plant + Health", desc: "Our core AI engine. Detect species and health status instantly.", to: "/features/identify-health", size: "large", color: "#16a34a" },
  { icon: <Sprout size={20} />, title: "Fertilizer Advice", desc: "Suggest plan based on condition.", to: "/features/fertilizer", color: "#22c55e" },
  { icon: <LineChart size={20} />, title: "Yield Prediction", desc: "ML harvest estimation.", to: "/features/yield", color: "#38bdf8" },
  { icon: <Timer size={20} />, title: "Shelf-life", desc: "Predict duration and decay.", to: "/features/shelf-life", color: "#fb7185" },
  { icon: <Puzzle size={20} />, title: "Parts + Quality", desc: "Leaf/Root grade check.", to: "/features/parts-quality", color: "#f59e0b" },
];

// Duplicate items for a seamless infinite loop on mobile
const infiniteItems = [...items, ...items];

export default function FeatureGrid() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="section" style={{ background: 'white', overflow: 'hidden' }}>
      <Container>
        <div className="section-head" style={{ maxWidth: '600px', marginBottom: '48px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
            The Ecosystem
          </div>
          <h2 className="h2" style={{ fontSize: '36px', fontWeight: 900 }}>Powerfully Modular.</h2>
          <p className="p" style={{ fontSize: '17px' }}>
            Built as independent intelligence units. Ready to be wired to your custom ML backends.
          </p>
        </div>

        {isMobile ? (
          /* MOBILE: INFINITE HORIZONTAL SLIDER */
          <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
            {/* Edge Gradients for "Fade" effect */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', background: 'linear-gradient(to right, white, transparent)', zIndex: 10 }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40px', background: 'linear-gradient(to left, white, transparent)', zIndex: 10 }} />

            <motion.div 
              style={{ display: 'flex', gap: '20px', width: 'max-content', padding: '0 20px' }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25, // Adjust speed here
                  ease: "linear"
                }
              }}
            >
              {infiniteItems.map((it, idx) => (
                <div key={idx} style={{ width: '280px' }}>
                  <Card it={it} isMobile={true} />
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* DESKTOP: BENTO GRID */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            gridAutoFlow: 'dense'
          }}>
            {items.map((it, idx) => (
              <Card key={it.title} it={it} idx={idx} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function Card({ it, idx, isMobile }) {
  return (
    <motion.div
      initial={isMobile ? {} : { opacity: 0, scale: 0.95 }}
      whileInView={isMobile ? {} : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(2,6,23,0.12)' }}
      style={{
        gridColumn: it.size === 'large' && !isMobile ? 'span 2' : 'span 1',
        position: 'relative',
        background: 'var(--card2)',
        border: '1px solid var(--border)',
        borderRadius: '32px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: it.size === 'large' && !isMobile ? '300px' : '260px',
        cursor: 'pointer',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '150px',
        height: '150px',
        background: `${it.color}10`,
        filter: 'blur(40px)',
        borderRadius: '50%'
      }} />

      <div>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '18px',
          background: 'white',
          border: '1px solid var(--border)',
          display: 'grid',
          placeItems: 'center',
          color: it.color,
          boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          marginBottom: '24px'
        }}>
          {it.icon}
        </div>
        
        <h3 style={{ 
          fontSize: it.size === 'large' && !isMobile ? '28px' : '20px', 
          fontWeight: 800, 
          margin: '0 0 12px 0',
          color: 'var(--text)'
        }}>
          {it.title}
        </h3>
        
        <p style={{ 
          color: 'var(--muted)', 
          fontSize: '15px', 
          lineHeight: 1.6,
          maxWidth: it.size === 'large' && !isMobile ? '350px' : '100%' 
        }}>
          {it.desc}
        </p>
      </div>

      <Link 
        to={it.to} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontWeight: 700, 
          color: 'var(--text)', 
          fontSize: '14px',
          marginTop: '20px'
        }}
      >
        Launch Module <ArrowUpRight size={16} />
      </Link>
    </motion.div>
  );
}