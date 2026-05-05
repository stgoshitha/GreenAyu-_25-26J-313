import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Check, X, User, Clock, AlertCircle } from "lucide-react";
import API from "../../services/api";
import Swal from "sweetalert2";

export default function PackageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/transactions/admin/all');
      setRequests(res.data.data);
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not fetch package requests'
      });
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    const result = await Swal.fire({
      title: 'Confirm Request?',
      text: "This will add tokens directly to the user's account.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Confirm it!'
    });

    if (result.isConfirmed) {
      try {
        await API.put(`/transactions/admin/confirm/${id}`);
        Swal.fire('Confirmed!', 'Tokens have been added to the user.', 'success');
        fetchRequests();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Confirmation failed', 'error');
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Request?',
      text: "This request will be marked as failed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Reject it!'
    });

    if (result.isConfirmed) {
      try {
        await API.put(`/transactions/admin/reject/${id}`);
        Swal.fire('Rejected', 'The request has been canceled.', 'info');
        fetchRequests();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Rejection failed', 'error');
      }
    }
  };

  return (
    <AdminLayout>
      <div style={headerAction}>
        <h2 style={sectionTitle}>User Package Requests</h2>
        <p style={sectionSubtitle}>Review and approve pending credit purchases.</p>
      </div>

      <div style={tableContainer}>
        {loading ? (
          <p style={{ padding: '40px', textAlign: 'center' }}>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No requests found.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={thGroup}>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Package</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={userInfo}>
                      <span style={userName}>{req.user?.name}</span>
                      <span style={userEmail}>{req.user?.email}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={userInfo}>
                      <span style={pkgName}>{req.package?.name}</span>
                      <span style={pkgPrice}>LKR {req.amountPaid}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={rowIconText}>
                      <Clock size={14} color="#94a3b8" />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBadge(req.status)}>{req.status.toUpperCase()}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {req.status === 'pending' ? (
                      <div style={actionGroup}>
                        <button onClick={() => handleConfirm(req._id)} style={confirmBtn} title="Confirm"><Check size={18} /></button>
                        <button onClick={() => handleReject(req._id)} style={rejectBtn} title="Reject"><X size={18} /></button>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

const headerAction = { marginBottom: "32px" };
const sectionTitle = { fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" };
const sectionSubtitle = { fontSize: "14px", color: "#64748b" };

const tableContainer = { background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thGroup = { borderBottom: "1px solid #f1f5f9", background: "#f8fafc" };
const thStyle = { padding: "20px 24px", textAlign: "left", color: "#64748b", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" };
const trStyle = { borderBottom: "1px solid #f8fafc" };
const tdStyle = { padding: "20px 24px", color: "#0f172a", fontSize: "14px", fontWeight: 500 };

const userInfo = { display: "flex", flexDirection: "column" };
const userName = { fontWeight: 700, color: "#0f172a" };
const userEmail = { fontSize: "12px", color: "#64748b" };

const pkgName = { fontWeight: 700, color: "#22c55e" };
const pkgPrice = { fontSize: "12px", color: "#64748b" };

const rowIconText = { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" };

const statusBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: "8px",
  fontSize: "11px",
  fontWeight: 800,
  background: status === 'pending' ? '#fef3c7' : status === 'completed' ? '#dcfce7' : '#fef2f2',
  color: status === 'pending' ? '#d97706' : status === 'completed' ? '#166534' : '#991b1b',
});

const actionGroup = { display: "flex", gap: "10px", justifyContent: "flex-end" };
const confirmBtn = { 
  width: "36px", height: "36px", borderRadius: "10px", border: "none", 
  background: "#22c55e15", color: "#22c55e", cursor: "pointer", 
  display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.2s" 
};
const rejectBtn = { 
  width: "36px", height: "36px", borderRadius: "10px", border: "none", 
  background: "#ef444415", color: "#ef4444", cursor: "pointer", 
  display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.2s" 
};
