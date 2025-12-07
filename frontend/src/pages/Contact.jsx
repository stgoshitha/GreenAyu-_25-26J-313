import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import Page from "./_shared/Page";
import Container from "../components/layout/Container";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onSubmit(e) {
    e.preventDefault();
    alert("Message Received! In the production version, this will trigger your Flask mailer.");
    setForm({ name: "", email: "", message: "" });
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: '#f8fafc'
  };

  return (
    <Page title="Get in Touch" subtitle="Whether you're a farmer or a developer, we're here to help.">
      <Container>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2px', // Thin gap for border effect
          background: '#e2e8f0',
          borderRadius: '32px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
          margin: '40px 0 100px'
        }}>
          
          {/* Info Sidebar */}
          <div style={{ 
            background: '#064e3b', 
            padding: '60px 48px', 
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ 
                width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px', display: 'grid', placeItems: 'center', marginBottom: '32px' 
              }}>
                <MessageSquare size={24} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>Contact Information</h3>
              <p style={{ color: '#a7f3d0', lineHeight: 1.6, marginBottom: '48px' }}>
                Have questions about AI plant identification or quality grading? Our team is ready to assist.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <ContactInfo icon={<Mail size={20} />} title="Email Us" detail="support@agricultor.lk" />
                <ContactInfo icon={<Phone size={20} />} title="Call Us" detail="+94 77 123 4567" />
                <ContactInfo icon={<MapPin size={20} />} title="Location" detail="Western Province, Sri Lanka" />
              </div>
            </div>

            <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: '14px', color: '#a7f3d0' }}>
                Expected response time: <b>Under 24 hours</b>
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div style={{ background: 'white', padding: '60px 48px' }}>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input 
                  style={inputStyle} 
                  placeholder="John Doe"
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input 
                  type="email" 
                  style={inputStyle} 
                  placeholder="john@example.com"
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Your Message</label>
                <textarea 
                  rows={5} 
                  style={{ ...inputStyle, resize: 'none' }} 
                  placeholder="How can we help your botanical operation?"
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  required
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                style={{ 
                  background: '#22c55e', 
                  color: 'white', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontWeight: 700, 
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  marginTop: '12px',
                  boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)'
                }}
              >
                Send Message <Send size={18} />
              </motion.button>
            </form>
          </div>
        </div>
      </Container>
    </Page>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: '8px',
  marginLeft: '4px'
};

function ContactInfo({ icon, title, detail }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ color: '#34d399' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>{title}</div>
        <div style={{ fontSize: '16px', fontWeight: 500 }}>{detail}</div>
      </div>
    </div>
  );
}