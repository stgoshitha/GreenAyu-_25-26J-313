import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

export default function CustomModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={overlay}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={modalContent}
        >
          <div style={modalHeader}>
            <div style={iconWrapper}>
              <AlertCircle size={24} color="#f59e0b" />
            </div>
            <button onClick={onClose} style={closeBtn}><X size={20} /></button>
          </div>

          <div style={modalBody}>
            <h3 style={modalTitle}>{title}</h3>
            <p style={modalDesc}>{message}</p>
          </div>

          <div style={modalFooter}>
            <button onClick={onClose} style={btnCancel}>{cancelText}</button>
            <button onClick={onConfirm} style={btnConfirm}>{confirmText}</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
  padding: "20px"
};

const modalContent = {
  background: "white",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "400px",
  padding: "32px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  position: "relative"
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px"
};

const iconWrapper = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  background: "#fef3c7",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const closeBtn = {
  background: "none",
  border: "none",
  color: "#94a3b8",
  cursor: "pointer",
  padding: "4px"
};

const modalBody = { marginBottom: "32px" };
const modalTitle = { fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" };
const modalDesc = { fontSize: "15px", color: "#64748b", lineHeight: 1.5 };

const modalFooter = { display: "flex", gap: "12px" };
const btnCancel = {
  flex: 1,
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  background: "white",
  color: "#475569",
  fontWeight: 700,
  cursor: "pointer"
};
const btnConfirm = {
  flex: 1,
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#0f172a",
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
};
