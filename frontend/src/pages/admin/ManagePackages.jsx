import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import API from "../../services/api";
import Swal from "sweetalert2";

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null); // id of package being edited
  const [editData, setEditData] = useState({ name: "", description: "", price: 0, tokenAmount: 0 });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await API.get('/packages');
      setPackages(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/packages', editData);
      setShowAddForm(false);
      setEditData({ name: "", description: "", price: 0, tokenAmount: 0 });
      Swal.fire('Created!', 'Package has been added.', 'success');
      fetchPackages();
    } catch (err) {
      Swal.fire('Error', 'Could not add package', 'error');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/packages/${id}`, editData);
      setIsEditing(null);
      Swal.fire('Updated!', 'Package details saved.', 'success');
      fetchPackages();
    } catch (err) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently remove this package.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/packages/${id}`);
        Swal.fire('Deleted!', 'Package has been removed.', 'success');
        fetchPackages();
      } catch (err) {
        Swal.fire('Error', 'Deletion failed', 'error');
      }
    }
  };

  const startEdit = (pkg) => {
    setIsEditing(pkg._id);
    setEditData({ ...pkg });
  };

  return (
    <AdminLayout>
      <div style={headerAction}>
        <h2 style={sectionTitle}>Credit Packages</h2>
        <button onClick={() => setShowAddForm(true)} style={addBtn}>
          <Plus size={18} />
          Add New Package
        </button>
      </div>

      {showAddForm && (
        <div style={formOverlay}>
          <form style={addForm} onSubmit={handleAdd}>
            <div style={formHeader}>
              <h3>Create New Package</h3>
              <button type="button" onClick={() => setShowAddForm(false)} style={XBtn}><X /></button>
            </div>
            <div style={formGrid}>
               <input 
                placeholder="Name" 
                style={inputStyle} 
                value={editData.name} 
                onChange={e => setEditData({...editData, name: e.target.value})} 
                required 
               />
               <input 
                placeholder="Tokens" 
                type="number" 
                style={inputStyle} 
                value={editData.tokenAmount} 
                onChange={e => setEditData({...editData, tokenAmount: e.target.value})} 
                required 
               />
               <input 
                placeholder="Price (LKR)" 
                type="number" 
                style={inputStyle} 
                value={editData.price} 
                onChange={e => setEditData({...editData, price: e.target.value})} 
                required 
               />
               <textarea 
                placeholder="Description" 
                style={areaStyle} 
                value={editData.description} 
                onChange={e => setEditData({...editData, description: e.target.value})} 
                required 
               />
            </div>
            <button type="submit" style={saveBtn}>Create Package</button>
          </form>
        </div>
      )}

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr style={thGroup}>
              <th style={thStyle}>Package Name</th>
              <th style={thStyle}>Credits</th>
              <th style={thStyle}>Price (LKR)</th>
              <th style={thStyle}>Created At</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id} style={trStyle}>
                <td style={tdStyle}>
                  {isEditing === pkg._id ? (
                    <input 
                      style={inlineInput} 
                      value={editData.name} 
                      onChange={e => setEditData({...editData, name: e.target.value})} 
                    />
                  ) : pkg.name}
                </td>
                <td style={tdStyle}>
                  {isEditing === pkg._id ? (
                    <input 
                      style={inlineInput} 
                      type="number"
                      value={editData.tokenAmount} 
                      onChange={e => setEditData({...editData, tokenAmount: e.target.value})} 
                    />
                  ) : pkg.tokenAmount}
                </td>
                <td style={tdStyle}>
                  {isEditing === pkg._id ? (
                    <input 
                      style={inlineInput} 
                      type="number"
                      value={editData.price} 
                      onChange={e => setEditData({...editData, price: e.target.value})} 
                    />
                  ) : pkg.price}
                </td>
                <td style={tdStyle}>{new Date(pkg.createdAt).toLocaleDateString()}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {isEditing === pkg._id ? (
                    <div style={actionGroup}>
                      <button onClick={() => handleUpdate(pkg._id)} style={confirmBtn}><Save size={16} /></button>
                      <button onClick={() => setIsEditing(null)} style={cancelBtn}><X size={16} /></button>
                    </div>
                  ) : (
                    <div style={actionGroup}>
                      <button onClick={() => startEdit(pkg)} style={editBtn}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(pkg._id)} style={deleteBtn}><Trash2 size={16} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

const headerAction = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" };
const sectionTitle = { fontSize: "24px", fontWeight: 800, color: "#0f172a" };
const addBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "12px",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const tableContainer = { background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thGroup = { borderBottom: "1px solid #f1f5f9", background: "#f8fafc" };
const thStyle = { padding: "20px 24px", textAlign: "left", color: "#64748b", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" };
const trStyle = { borderBottom: "1px solid #f8fafc" };
const tdStyle = { padding: "20px 24px", color: "#0f172a", fontSize: "14px", fontWeight: 500 };

const actionGroup = { display: "flex", gap: "8px", justifyContent: "flex-end" };
const editBtn = { padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#3b82f6", cursor: "pointer" };
const deleteBtn = { padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#ef4444", cursor: "pointer" };
const confirmBtn = { padding: "8px", borderRadius: "8px", border: "none", background: "#10b981", color: "white", cursor: "pointer" };
const cancelBtn = { padding: "8px", borderRadius: "8px", border: "none", background: "#94a3b8", color: "white", cursor: "pointer" };

const inlineInput = { padding: "6px 10px", borderRadius: "6px", border: "1px solid #3b82f6", outline: "none", width: "100%" };

const formOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center" };
const addForm = { background: "white", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "24px" };
const formHeader = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const XBtn = { background: "none", border: "none", cursor: "pointer", color: "#64748b" };
const formGrid = { display: "flex", flexDirection: "column", gap: "16px" };
const inputStyle = { padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc" };
const areaStyle = { ...inputStyle, height: "100px", resize: "none" };
const saveBtn = { background: "#0f172a", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" };
