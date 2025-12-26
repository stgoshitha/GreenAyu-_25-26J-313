import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, AlertCircle, Activity, Camera, X } from "lucide-react";
import Page from "../_shared/Page";
import Container from "../../components/layout/Container";

const API_URL = "http://127.0.0.1:8000/plant/analyze";

export default function IdentifyHealth() {
  const [plantName, setPlantName] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please upload an image file (JPG/PNG/WEBP).");
      return;
    }

    setIsScanning(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed with status ${res.status}`);
      }

      const data = await res.json();

      const plantCategory = data?.plant_category?.class || "Unknown";
      const plantCatConf = Number(data?.plant_category?.confidence ?? 0);

      const healthClass = data?.plant_health?.class || "Unknown";
      const healthConf = Number(data?.plant_health?.confidence ?? 0);

      const confidencePct = Math.round(Math.max(plantCatConf, healthConf) * 100);

      setResult({
        plant: plantName?.trim() ? `${plantName.trim()} (${plantCategory})` : plantCategory,
        plantCategory,
        plantCategoryConfidence: plantCatConf,
        health: healthClass,
        healthConfidence: healthConf,
        confidence: confidencePct,
        status: "success",
        recommendation:
          healthClass.toLowerCase() === "healthy"
            ? "Plant looks healthy. Suitable for harvesting / processing."
            : "Plant shows possible issues. Consider checking soil, water, and fertilizer plan.",
      });
    } catch (err) {
      setError(
        err?.message?.includes("Failed to fetch")
          ? "Cannot reach API. Make sure backend is running and accessible from browser."
          : (err?.message || "Something went wrong.")
      );
    } finally {
      setIsScanning(false);
    }
  }

  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    // Basic validation
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(f.type)) {
      setError("Unsupported file type. Please upload JPG, PNG, or WEBP.");
      e.target.value = "";
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File is too large. Max 10MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setFile(f);
  }

  function clearFile() {
    setFile(null);
    setResult(null);
    setError("");
  }

  return (
    <Page title="Botanical Diagnostic" subtitle="Identify species and assess health metrics instantly.">
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "32px",
            marginBottom: "100px",
          }}
        >
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
            }}
          >
            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Reference Name (Optional)</label>
                <div style={{ position: "relative" }}>
                  <Search style={{ position: "absolute", left: "16px", top: "16px", color: "#94a3b8" }} size={18} />
                  <input
                    style={{ ...inputStyle, paddingLeft: "48px" }}
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g., pawatta"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Image Upload</label>

                <div style={uploadZoneStyle}>
                  {!file ? (
                    <>
                      <Camera size={32} color="#22c55e" style={{ marginBottom: "12px" }} />
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                        Click to upload plant image
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        JPG, PNG or WEBP (Max 10MB)
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={onPickFile}
                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                      />
                    </>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {file.name}
                        </div>
                        <button
                          type="button"
                          onClick={clearFile}
                          className="btn btn-ghost"
                          style={{ height: 38, padding: "0 10px" }}
                        >
                          <X size={16} /> Remove
                        </button>
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          borderRadius: 16,
                          overflow: "hidden",
                          border: "1px solid #e2e8f0",
                          background: "#f8fafc",
                        }}
                      >
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error ? (
                <div style={{ marginBottom: 16 }} className="alert">
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                </div>
              ) : null}

              <button
                className="btn btn-primary"
                type="submit"
                disabled={isScanning}
                style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: 800 }}
              >
                {isScanning ? "Analyzing Specimen..." : "Run AI Diagnostic"}
              </button>

              <div
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#64748b",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <AlertCircle size={14} />
                <span>API: {API_URL}</span>
              </div>
            </form>
          </motion.div>

          {/* Result Section */}
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              {!result && !isScanning && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={emptyStateStyle}
                >
                  <Activity size={48} color="#e2e8f0" style={{ marginBottom: "16px" }} />
                  <p style={{ color: "#94a3b8", fontWeight: 600 }}>Upload an image and run analysis…</p>
                </motion.div>
              )}

              {isScanning && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={emptyStateStyle}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      border: "4px solid #22c55e",
                      borderTopColor: "transparent",
                    }}
                  />
                  <p style={{ marginTop: "20px", color: "#22c55e", fontWeight: 800 }}>
                    Processing…
                  </p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={resultCardStyle}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 900 }}>Analysis Complete</h3>
                    <CheckCircle2 color="#22c55e" size={24} />
                  </div>

                  <div style={dataRow}>
                    <span>Plant Category:</span>
                    <strong style={{ color: "#064e3b" }}>{result.plantCategory}</strong>
                  </div>

                  <div style={dataRow}>
                    <span>Health:</span>
                    <span style={{ color: result.health?.toLowerCase() === "healthy" ? "#16a34a" : "#b45309", fontWeight: 800 }}>
                      {result.health}
                    </span>
                  </div>

                  <div style={dataRow}>
                    <span>Category Confidence:</span>
                    <strong>{Math.round(result.plantCategoryConfidence * 100)}%</strong>
                  </div>

                  <div style={dataRow}>
                    <span>Health Confidence:</span>
                    <strong>{Math.round(result.healthConfidence * 100)}%</strong>
                  </div>

                  <div style={{ margin: "24px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                      <span style={{ fontWeight: 800 }}>Overall Confidence</span>
                      <span>{result.confidence}%</span>
                    </div>
                    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        style={{ height: "100%", background: "#22c55e" }}
                      />
                    </div>
                  </div>

                  <div style={{ background: "#f0fdf4", padding: "16px", borderRadius: "12px", border: "1px solid #dcfce7" }}>
                    <div style={{ fontSize: "12px", fontWeight: 900, color: "#166534", marginBottom: "4px", textTransform: "uppercase" }}>
                      Recommendation
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#064e3b", lineHeight: 1.5 }}>
                      {result.recommendation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Page>
  );
}

// Styles (kept same feel as your original)
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 800,
  color: "#475569",
  marginBottom: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  outline: "none",
  background: "#f8fafc",
  fontSize: "15px",
};
const uploadZoneStyle = {
  position: "relative",
  border: "2px dashed #cbd5e1",
  borderRadius: "16px",
  padding: "26px 18px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all 0.2s",
  background: "#f8fafc",
};
const emptyStateStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "2px dashed #e2e8f0",
  borderRadius: "24px",
  background: "#f8fafc",
  minHeight: "400px",
};
const resultCardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "24px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
  height: "100%",
};
const dataRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "15px",
};
