import React from "react";
import { motion } from "framer-motion";
import Container from "../layout/Container";

const Icons = {
  Speed: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Mobile: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
  Modules: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v19"/><path d="M5 8h14"/><path d="M15 15h6"/><path d="M3 15h6"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

export default function StatsStrip() {
  const stats = [
    { label: "Efficiency boost", value: "2x faster", icon: <Icons.Speed />, color: "#22c55e" },
    { label: "Uptime guarantee", value: "100%", icon: <Icons.Mobile />, color: "#38bdf8" },
    { label: "Core modules", value: "5 smart", icon: <Icons.Modules />, color: "#16a34a" },
    { label: "User focused", value: "Farmers", icon: <Icons.Users />, color: "#10b981" },
  ];

  return (
    <section style={{ padding: '60px 0', position: 'relative' }}>
      <Container>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px' 
        }}>
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{
                position: 'relative',
                padding: '30px',
                borderRadius: '30px',
                background: 'var(--card2)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'var(--shadow)',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              {/* Decorative Background Blob */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${s.color}15 0%, transparent 70%)`,
                zIndex: 0
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '16px', 
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.color,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
                  marginBottom: '20px',
                  border: '1px solid rgba(0,0,0,0.03)'
                }}>
                  {s.icon}
                </div>

                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '800', 
                  color: 'var(--text)',
                  letterSpacing: '-0.5px',
                  marginBottom: '4px'
                }}>
                  {s.value}
                </div>

                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {s.label}
                </div>
              </div>

              {/* Progress Indicator Accent */}
              <div style={{
                marginTop: '20px',
                height: '4px',
                width: '40px',
                background: s.color,
                borderRadius: '10px',
                opacity: 0.6
              }} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}