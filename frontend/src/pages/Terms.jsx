import React from "react";
import { Scale, ShieldAlert, Database, FileText, Info } from "lucide-react";
import Page from "./_shared/Page";
import Container from "../components/layout/Container";

export default function Terms() {
  const sections = [
    {
      icon: <Scale size={20} color="#22c55e" />,
      title: "Botanical Accuracy & Usage",
      content: "This portal provides AI-driven estimates and recommendations for medicinal plant species. While our models are trained on high-quality botanical datasets, all automated identifications and health assessments should be validated by a certified herbalist or laboratory before commercial distribution."
    },
    {
      icon: <Database size={20} color="#22c55e" />,
      title: "Data Integrity & Security",
      content: "Once the backend API is connected, all plant imagery and diagnostic history are handled according to industry-standard encryption. Users are responsible for maintaining the confidentiality of their credentials and ensuring uploaded data follows local agricultural compliance regulations."
    },
    {
      icon: <ShieldAlert size={20} color="#22c55e" />,
      title: "Professional Disclaimer",
      content: "Predictions (including quality grades, yield estimates, and shelf-life forecasts) are variable. Factors such as camera lens quality, lighting conditions, and environmental variables can impact AI accuracy. AgricultorPortal is not liable for crop loss or quality deviations."
    }
  ];

  return (
    <Page 
      title="Terms of Service" 
      subtitle="Ensuring safety, transparency, and data integrity in botanical intelligence."
    >
      <Container>
        <div style={{ maxWidth: '900px', margin: '40px auto 100px auto' }}>
          
          {/* Important Notice Box */}
          <div style={{ 
            background: '#f0fdf4', 
            border: '1px solid #bbf7d0', 
            padding: '24px', 
            borderRadius: '16px', 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '48px' 
          }}>
            <Info color="#16a34a" size={24} style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, color: '#166534', fontSize: '14px', lineHeight: 1.5 }}>
              <b>Notice for Field Operators:</b> By using this portal, you acknowledge that AI diagnostics are supporting tools, not a replacement for official pharmaceutical quality testing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {sections.map((section, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                gap: '24px',
                paddingBottom: '40px',
                borderBottom: idx !== sections.length - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  background: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  display: 'grid', 
                  placeItems: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  {section.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                    {section.title}
                  </h3>
                  <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '15px', margin: 0 }}>
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer of the panel */}
          <div style={{ 
            marginTop: '60px', 
            textAlign: 'center', 
            padding: '40px', 
            background: '#f8fafc', 
            borderRadius: '24px' 
          }}>
            <FileText size={32} color="#94a3b8" style={{ marginBottom: '16px' }} />
            <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>Questions regarding our terms?</h4>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Please contact our legal and compliance team at <b>legal@agricultor.lk</b>
            </p>
          </div>

        </div>
      </Container>
    </Page>
  );
}