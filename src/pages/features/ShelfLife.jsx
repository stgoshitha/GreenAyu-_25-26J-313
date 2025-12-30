import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Thermometer,
  Wind,
  AlertTriangle,
  Snowflake,
  Sun,
  ShieldCheck,
  Info,
  Bug,
  Droplets,
  Activity,
} from "lucide-react";
import Page from "../_shared/Page";
import Container from "../../components/layout/Container";

const API_URL = "http://127.0.0.1:8000/shelf-life";

const PLANT_TYPES = ["leaf", "root", "flower", "stem", "seed"];
const STORAGE_TYPES = [
  { key: "refrigerated", label: "Refrigerated", desc: "Cool storage (recommended)", icon: <Snowflake size={18} /> },
  { key: "ambient", label: "Ambient", desc: "Room temperature", icon: <Wind size={18} /> },
  { key: "exposed", label: "Exposed", desc: "Warm / outdoor conditions", icon: <Sun size={18} /> },
];

export default function ShelfLife() {
  const [plant, setPlant] = useState("");

  const [form, setForm] = useState({
    plant_type: "leaf",
    storage_type: "refrigerated",
    temperature_c: 4.0,
    humidity_percent: 90.0,
    respiration_rate: 18.0,
    ethylene_sensitivity: 0.85,
    water_content: 92.0,
    damage_level: 0.1,
    microbial_risk: 0.2,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [out, setOut] = useState(null);
  const [error, setError] = useState("");

  const plantLabel = useMemo(() => (plant?.trim() ? plant.trim() : "Sample plant"), [plant]);

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function autoSetByStorage(type) {
    if (type === "refrigerated") {
      setForm((p) => ({ ...p, storage_type: type, temperature_c: 4.0, humidity_percent: 90.0 }));
    } else if (type === "ambient") {
      setForm((p) => ({ ...p, storage_type: type, temperature_c: 24.0, humidity_percent: 70.0 }));
    } else {
      setForm((p) => ({ ...p, storage_type: type, temperature_c: 32.0, humidity_percent: 55.0 }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsAnalyzing(true);
    setOut(null);
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const days = Number(data?.shelf_life_days);

      if (!Number.isFinite(days)) throw new Error("API response missing shelf_life_days.");

      // UI risk indicator (derived from your inputs)
      const riskScore =
        0.45 * form.microbial_risk + 0.35 * form.damage_level + 0.2 * Math.min(1, form.respiration_rate / 30);

      const riskLevel =
        riskScore >= 0.65 ? "High" : riskScore >= 0.35 ? "Moderate" : "Low";

      const tempRange =
        form.storage_type === "refrigerated"
          ? "0°C - 8°C"
          : form.storage_type === "ambient"
          ? "18°C - 28°C"
          : "> 30°C";

      setOut({
        plant: plantLabel,
        shelfLifeDays: days,
        shelfLifeText: `${days.toFixed(1)} days`,
        riskLevel,
        tempRange,
        note:
          form.storage_type === "refrigerated"
            ? "Keep sealed + clean container. Avoid bruising. Maintain high humidity to reduce dehydration."
            : form.storage_type === "ambient"
            ? "Keep away from sunlight and moisture. Use breathable packing and monitor mold risk."
            : "Reduce exposure to heat immediately. High temperature accelerates spoilage and potency loss.",
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
    <Page title="Stability Analysis" subtitle="Predict botanical shelf-life and potency retention based on storage environment.">
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "40px",
            paddingBottom: "100px",
          }}
        >
          {/* Input Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={panelStyle}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", marginBottom: "6px" }}>
                Environment Setup
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                Configure storage + material properties for prediction.
              </p>
            </div>

            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Botanical Specimen (optional)</label>
                <input
                  style={inputStyle}
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  placeholder="e.g., Pawatta, Iramusu..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Plant Type</label>
                  <select
                    style={inputStyle}
                    value={form.plant_type}
                    onChange={(e) => setField("plant_type", e.target.value)}
                  >
                    {PLANT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Storage Type</label>
                  <select
                    style={inputStyle}
                    value={form.storage_type}
                    onChange={(e) => autoSetByStorage(e.target.value)}
                  >
                    {STORAGE_TYPES.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Quick Storage Preset</label>
                <div style={{ display: "grid", gap: "12px" }}>
                  {STORAGE_TYPES.map((opt) => (
                    <StorageOption
                      key={opt.key}
                      active={form.storage_type === opt.key}
                      onClick={() => autoSetByStorage(opt.key)}
                      icon={opt.icon}
                      label={opt.label}
                      desc={opt.desc}
                    />
                  ))}
                </div>
              </div>

              {/* Numeric inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <NumberField
                  icon={<Thermometer size={18} color="#94a3b8" />}
                  label="Temperature"
                  value={form.temperature_c}
                  suffix="°C"
                  onChange={(v) => setField("temperature_c", v)}
                />
                <NumberField
                  icon={<Droplets size={18} color="#94a3b8" />}
                  label="Humidity"
                  value={form.humidity_percent}
                  suffix="%"
                  onChange={(v) => setField("humidity_percent", v)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <NumberField
                  icon={<Activity size={18} color="#94a3b8" />}
                  label="Respiration Rate"
                  value={form.respiration_rate}
                  suffix=""
                  onChange={(v) => setField("respiration_rate", v)}
                />
                <NumberField
                  icon={<Wind size={18} color="#94a3b8" />}
                  label="Ethylene Sensitivity"
                  value={form.ethylene_sensitivity}
                  suffix=""
                  onChange={(v) => setField("ethylene_sensitivity", v)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <NumberField
                  icon={<Droplets size={18} color="#94a3b8" />}
                  label="Water Content"
                  value={form.water_content}
                  suffix="%"
                  onChange={(v) => setField("water_content", v)}
                />
                <NumberField
                  icon={<AlertTriangle size={18} color="#94a3b8" />}
                  label="Damage Level"
                  value={form.damage_level}
                  suffix=""
                  step="0.01"
                  onChange={(v) => setField("damage_level", v)}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <NumberField
                  icon={<Bug size={18} color="#94a3b8" />}
                  label="Microbial Risk"
                  value={form.microbial_risk}
                  suffix=""
                  step="0.01"
                  onChange={(v) => setField("microbial_risk", v)}
                />
              </div>

              {error ? (
                <div className="alert" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <AlertTriangle size={14} />
                    <span>{error}</span>
                  </div>
                </div>
              ) : null}

              <button className="btn btn-primary" type="submit" disabled={isAnalyzing} style={{ width: "100%", height: "56px" }}>
                {isAnalyzing ? "Calculating Stability..." : "Estimate Shelf-Life"}
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
                <span>API: {API_URL}</span>
              </div>
            </form>
          </motion.div>

          {/* Result Panel */}
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              {!out && !isAnalyzing ? (
                <div style={emptyCardStyle}>
                  <Clock size={48} color="#e2e8f0" />
                  <p style={{ color: "#94a3b8", marginTop: "16px", fontWeight: 700 }}>Define environment to start</p>
                </div>
              ) : isAnalyzing ? (
                <div style={emptyCardStyle}>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Clock size={40} color="#22c55e" />
                  </motion.div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={resultCardStyle}>
                  <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{ color: "#22c55e", marginBottom: "8px" }}>
                      <ShieldCheck size={32} style={{ margin: "0 auto" }} />
                    </div>
                    <h2 style={{ fontSize: "34px", fontWeight: 900, color: "#0f172a", margin: 0 }}>
                      {out.shelfLifeText}
                    </h2>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Estimated Shelf-life
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "1px",
                      background: "#f1f5f9",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <DataTile label="Target Specimen" value={out.plant} />
                    <DataTile label="Plant Type" value={form.plant_type} />
                    <DataTile label="Storage Type" value={form.storage_type} />
                    <DataTile label="Thermal Range" value={out.tempRange} />
                    <DataTile
                      label="Spoilage Risk"
                      value={out.riskLevel}
                      color={out.riskLevel === "High" ? "#ef4444" : out.riskLevel === "Moderate" ? "#f59e0b" : "#22c55e"}
                    />
                  </div>

                  <div style={alertBox}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        color: "#064e3b",
                        fontWeight: 900,
                        fontSize: "13px",
                        marginBottom: "6px",
                      }}
                    >
                      <AlertTriangle size={16} /> Preservation Protocol
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#166534", lineHeight: 1.5 }}>{out.note}</p>
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

// Helpers
function StorageOption({ active, onClick, icon, label, desc }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "16px",
        borderRadius: "12px",
        border: active ? "2px solid #22c55e" : "1px solid #e2e8f0",
        background: active ? "#f0fdf4" : "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.2s",
      }}
    >
      <div style={{ color: active ? "#22c55e" : "#94a3b8" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "#64748b" }}>{desc}</div>
      </div>
    </div>
  );
}

function DataTile({ label, value, color = "#0f172a" }) {
  return (
    <div style={{ background: "white", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 900, color }}>{value}</span>
    </div>
  );
}

function NumberField({ label, value, onChange, suffix, icon, step }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 12, top: 13 }}>{icon}</div>
        <input
          style={{ ...inputStyle, paddingLeft: 42 }}
          type="number"
          step={step || "any"}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix ? (
          <span style={{ position: "absolute", right: 12, top: 14, fontSize: 12, color: "#94a3b8", fontWeight: 900 }}>
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// Styles
const panelStyle = { background: "white", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0" };
const labelStyle = { display: "block", fontSize: "12px", fontWeight: 900, color: "#475569", marginBottom: "8px", textTransform: "uppercase" };
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" };
const emptyCardStyle = { height: "100%", minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", borderRadius: "24px", border: "2px dashed #e2e8f0" };
const resultCardStyle = { background: "white", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" };
const alertBox = { marginTop: "24px", background: "#f0fdf4", padding: "20px", borderRadius: "16px", border: "1px solid #dcfce7" };
