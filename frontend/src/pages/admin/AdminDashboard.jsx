import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Users, Box, CreditCard, Activity } from "lucide-react";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalRevenue: 0,
    totalAnalyses: 0,
    chartData: Array(7).fill({ date: '', count: 0 })
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      }
    };
    fetchStats();
  }, []);

  // Determine max for normalization
  const maxVal = stats.chartData ? Math.max(...stats.chartData.map(d => d.count), 5) : 10;

  const statCards = [
    { title: "Total Users", value: stats.totalUsers || 0, icon: <Users size={24} />, color: "#3b82f6" },
    { title: "Active Packages", value: stats.totalPackages || 0, icon: <Box size={24} />, color: "#10b981" },
    { title: "Total Revenue", value: `LKR ${(stats.totalRevenue || 0).toLocaleString()}`, icon: <CreditCard size={24} />, color: "#f59e0b" },
    { title: "AI Analyses", value: (stats.totalAnalyses || 0).toLocaleString(), icon: <Activity size={24} />, color: "#8b5cf6" },
  ];

  return (
    <AdminLayout>
      <div style={dashboardGrid}>
        {statCards.map((card) => (
          <div key={card.title} style={statCard}>
            <div style={{ ...iconBox, background: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div style={cardInfo}>
              <span style={cardTitle}>{card.title}</span>
              <span style={cardValue}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={chartSection}>
        <div style={recentActivity}>
          <h3 style={sectionTitle}>System Overview</h3>
          <p style={sectionSubtitle}>Real-time analysis of botanical diagnostics and credit usage.</p>
          <div style={placeholderChart}>
              <div style={barContainer}>
                {stats.chartData.map((day, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '12px', height: '100%' }}>
                    <div style={{ ...bar, height: `${(day.count / maxVal) * 100}%`, minHeight: day.count > 0 ? '4px' : '0', width: '100%' }}></div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {day.date ? day.date.split('-').slice(1).join('/') : ''}
                    </span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "24px",
  marginBottom: "32px"
};

const statCard = {
  background: "white",
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  gap: "20px"
};

const iconBox = {
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const cardInfo = { display: "flex", flexDirection: "column" };
const cardTitle = { fontSize: "14px", color: "#64748b", fontWeight: 600 };
const cardValue = { fontSize: "24px", fontWeight: 800, color: "#0f172a" };

const chartSection = { display: "grid", gap: "24px" };
const recentActivity = {
  background: "white",
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
};

const sectionTitle = { fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" };
const sectionSubtitle = { fontSize: "14px", color: "#64748b", marginBottom: "32px" };

const placeholderChart = {
  height: "300px",
  background: "#f8fafc",
  borderRadius: "16px",
  display: "flex",
  alignItems: "flex-end",
  padding: "40px",
  justifyContent: "center"
};

const barContainer = { display: "flex", alignItems: "flex-end", gap: "20px", width: "100%", height: "100%" };
const bar = { background: "#22c55e", borderRadius: "8px 8px 0 0", transition: "height 0.3s ease" };
