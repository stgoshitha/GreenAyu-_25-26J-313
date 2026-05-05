import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Home, Search, LifeBuoy } from "lucide-react";
import Page from "./_shared/Page";
import Container from "../components/layout/Container";

export default function NotFound() {
  return (
    <Page title="404 Error" subtitle="The specimen you are looking for cannot be located.">
      <Container>
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 0 120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          {/* Animated 404 Visual */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ 
                fontSize: 'clamp(120px, 15vw, 200px)', 
                fontWeight: 900, 
                margin: 0, 
                lineHeight: 1,
                background: 'linear-gradient(180deg, #f1f5f9 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                userSelect: 'none'
              }}
            >
              404
            </motion.h1>
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                color: '#22c55e',
                opacity: 0.8
              }}
            >
              <Compass size={80} strokeWidth={1} />
            </motion.div>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Looks like you've wandered off the trail.
          </h2>
          
          <p style={{ color: '#64748b', maxWidth: '480px', lineHeight: 1.6, marginBottom: '48px', fontSize: '16px' }}>
            The page you are looking for might have been moved, renamed, or is temporarily unavailable in this sector of the portal.
          </p>

          {/* Action Grid */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '16px' 
          }}>
            <Link to="/" style={{ 
              background: '#22c55e', 
              color: 'white', 
              padding: '16px 32px', 
              borderRadius: '12px', 
              textDecoration: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)'
            }}>
              <Home size={18} /> Return Home
            </Link>

            <Link to="/contact" style={{ 
              background: 'white', 
              color: '#0f172a', 
              padding: '16px 32px', 
              borderRadius: '12px', 
              textDecoration: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <LifeBuoy size={18} /> Get Support
            </Link>
          </div>

          {/* Quick Search Suggestion */}
          <div style={{ marginTop: '80px', color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={14} /> 
            <span>Try searching for: <b>Identification</b>, <b>Fertilizer</b>, or <b>Quality Reports</b></span>
          </div>

        </div>
      </Container>
    </Page>
  );
}