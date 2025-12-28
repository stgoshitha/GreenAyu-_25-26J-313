import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  Microscope,
  Award,
  AlertCircle,
  Camera,
  CheckCircle2,
  X,
  Info,
  BadgeCheck,
  Hourglass,
} from "lucide-react";
import Page from "../_shared/Page";
import Container from "../../components/layout/Container";

const API_URL = "http://127.0.0.1:8000/plant-part";

export default function PartsQuality() {
  const [part, setPart] = useState("leaf");

  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [out, setOut] = useState(null);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(f.type)) {
      setError("Unsupported file type. Please upload JPG, PNG, or WEBP.");
      e.target.value = "";
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setOut(null);
    setFile(f);
  }

  function clearFile() {
    setFile(null);
    setOut(null);
    setError("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOut(null);

    if (!file) {
      setError("Please upload a specimen image first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      const data = await res.json();

      const detectedPart = data?.plant_part ?? "Unknown";
      const conf = Number(data?.confidence ?? 0);

      if (!detectedPart) throw new Error("API response missing plant_part.");
      if (!Number.isFinite(conf)) throw new Error("API response missing confidence.");

      setOut({
        selectedPart: part.charAt(0).toUpperCase() + part.slice(1),
        detectedPart,
        confidencePct: Math.round(conf * 100),
        quality: "Coming Soon",
        defects: "Coming Soon",
        purity: "Coming Soon",
        note:
          "Plant part detection is enabled. Quality grading will be added in the next release.",
      });
    } catch (err) {
      setError(
        err?.message?.includes("Failed to fetch")
          ? "Cannot reach API. Make sure backend is running and CORS is enabled."
          : err?.message || "Something went wrong."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <Page title="Parts & Quality" subtitle="Identify plant parts now — quality grading will arrive soon.">
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "40px",
            paddingBottom: "100px",
          }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={panelStyle}>
            <div style={{ marginBottom: "32px" }}>
              <div style={iconHeader}>
                <Microscope size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>Specimen Input</h3>
            </div>

            <form onSubmit={onSubmit}>
              

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Upload Specimen Image</label>

                <div style={uploadBox}>
                  {!file ? (
                    <>
                      <Camera size={32} color="#22c55e" />
                      <p style={{ fontSize: "13px", color: "#64748b", margin: "8px 0 0" }}>
                        Click to upload a clear plant-part image
                      </p>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0" }}>
                        JPG / PNG / WEBP • Max 10MB
                      </p>

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
                        <div
                          style={{
                            fontSize: 13,
                            color: "#0f172a",
                            fontWeight: 800,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </div>
                        <button
                          type="button"
                          onClick={clearFile}
                          className="btn btn-ghost"
                          style={{ height: 36, padding: "0 10px" }}
                        >
                          <X size={16} /> Remove
                        </button>
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          borderRadius: 14,
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
                <div className="alert" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                </div>
              ) : null}

              <button className="btn btn-primary" type="submit" disabled={isAnalyzing} style={{ width: "100%", height: "56px" }}>
                {isAnalyzing ? "Detecting Part..." : "Detect Plant Part"}
              </button>

              <div
                style={{
                  marginTop: "14px",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#64748b",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Info size={14} color="#22c55e" />
                <span>API: {API_URL} (form-data: file)</span>
              </div>
            </form>
          </motion.div>

          {/* RIGHT: Result */}
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              {!out && !isAnalyzing ? (
                <div style={emptyCard}>
                  <Scan size={48} color="#e2e8f0" />
                  <p style={{ color: "#94a3b8", marginTop: "16px" }}>Upload an image and detect the part</p>
                </div>
              ) : isAnalyzing ? (
                <div style={emptyCard}>
                  <motion.div
                    animate={{ y: [0, 100, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{ width: "100%", height: "2px", background: "#22c55e", position: "absolute", top: "20%" }}
                  />
                  <p style={{ color: "#22c55e", fontWeight: 800 }}>AI Analysis in Progress...</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={certCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 900, color: "#22c55e", textTransform: "uppercase" }}>
                        Detected
                      </div>
                      <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 900 }}>
                        {out.detectedPart}
                      </h2>
                      <div style={{ marginTop: 8, fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                        Manual selection: <span style={{ color: "#0f172a" }}>{out.selectedPart}</span>
                      </div>
                    </div>

                    <div style={confidenceBadge}>
                      <BadgeCheck size={16} />
                      {out.confidencePct}%
                    </div>
                  </div>

                  {/* ✅ Quality placeholder */}
                  <div style={comingSoonBox}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0f172a", fontWeight: 900 }}>
                      <Hourglass size={16} color="#22c55e" />
                      Quality grading (Coming soon)
                    </div>
                    <p style={{ margin: "8px 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>
                      We’ll add quality grade, defects, and purity once the quality model is ready.
                    </p>
                  </div>

                  <div style={reportNote}>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: "13px",
                        color: "#064e3b",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Award size={16} /> Summary
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#166534", lineHeight: 1.6 }}>{out.note}</p>
                  </div>

                  <div style={{ marginTop: "24px", borderTop: "1px dashed #e2e8f0", paddingTop: "18px", textAlign: "center" }}>
                    <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Result ID: AP-PART-001
                    </span>
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

const panelStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "24px",
  border: "1px solid #e2e8f0",
};

const iconHeader = {
  width: "40px",
  height: "40px",
  background: "#f0fdf4",
  color: "#22c55e",
  borderRadius: "10px",
  display: "grid",
  placeItems: "center",
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 900,
  color: "#475569",
  marginBottom: "10px",
  textTransform: "uppercase",
};

const uploadBox = {
  position: "relative",
  border: "2px dashed #e2e8f0",
  borderRadius: "16px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
  minHeight: "180px",
};

const emptyCard = {
  position: "relative",
  height: "100%",
  minHeight: "420px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
  borderRadius: "24px",
  border: "2px dashed #e2e8f0",
  overflow: "hidden",
};

const certCard = {
  background: "white",
  padding: "40px",
  borderRadius: "24px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.05)",
  position: "relative",
};

const confidenceBadge = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#dcfce7",
  color: "#166534",
  padding: "10px 14px",
  borderRadius: "12px",
  fontWeight: 900,
};

const comingSoonBox = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: "18px",
  borderRadius: "16px",
  marginBottom: "18px",
};

const reportNote = {
  background: "#f0fdf4",
  padding: "24px",
  borderRadius: "20px",
  border: "1px solid #dcfce7",
};
