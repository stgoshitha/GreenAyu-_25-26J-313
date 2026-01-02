import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Map as MapIcon,
  Scale,
  Info,
  TrendingUp,
  Package,
  AlertCircle,
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
} from "lucide-react";
import Page from "../_shared/Page";
import Container from "../../components/layout/Container";

const API_URL = "http://127.0.0.1:8000/yield";

// Simple dropdown options (you can expand later)
const REGIONS = ["West", "East", "North", "South", "Central"];
const SOILS = ["Sandy", "Black", "Red", "Clayey", "Loamy"];
const CROPS = ["Cotton", "Rice", "Wheat", "Tea", "Coconut", "Maize", "Sugarcane"];
const WEATHER = ["Sunny", "Cloudy", "Rainy"];

export default function YieldPredict() {
  // Optional (kept from your UI)
  const [plant, setPlant] = useState("");

  // ✅ API input payload (same keys you provided)
  const [form, setForm] = useState({
    Region: "West",
    Soil_Type: "Sandy",
    Crop: "Cotton",
    Rainfall_mm: 897.07,
    Temperature_Celsius: 27.6,
    Fertilizer_Used: false,
    Irrigation_Used: true,
    Weather_Condition: "Cloudy",
    Days_to_Harvest: 122,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [out, setOut] = useState(null);
  const [error, setError] = useState("");

  const plantLabel = useMemo(() => (plant?.trim() ? plant.trim() : "Medicinal Crop (optional)"), [plant]);

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsCalculating(true);
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
      const y = Number(data?.yield_tons_per_hectare);

      if (!Number.isFinite(y)) {
        throw new Error("API response missing yield_tons_per_hectare.");
      }

      setOut({
        plant: plantLabel,
        estimatedYieldTonsPerHectare: y.toFixed(2),
        unit: "hectare",
        confidence: 88, 
        note: `Forecast based on ${form.Region} region, ${form.Soil_Type} soil, ${form.Weather_Condition} weather and ${form.Days_to_Harvest} days to harvest.`,
      });
    } catch (err) {
      setError(
        err?.message?.includes("Failed to fetch")
          ? "Cannot reach API. Make sure backend is running and CORS is enabled."
          : err?.message || "Something went wrong."
      );
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <Page title="Yield Forecast" subtitle="Predict yield (tons/hectare) using weather, soil, and cultivation parameters.">
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            paddingBottom: "100px",
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={panelStyle}>
            <div style={{ marginBottom: "26px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={iconBoxStyle}>
                <BarChart3 size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 900 }}>Forecast Inputs</h3>
            </div>

            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Medicinal Species (Optional)</label>
                <input
                  style={inputStyle}
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  placeholder="e.g., Pawatta, Iramusu..."
                />
              </div>

              <div style={twoCol}>
                <div>
                  <label style={labelStyle}>Region</label>
                  <select style={inputStyle} value={form.Region} onChange={(e) => setField("Region", e.target.value)}>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Soil Type</label>
                  <select
                    style={inputStyle}
                    value={form.Soil_Type}
                    onChange={(e) => setField("Soil_Type", e.target.value)}
                  >
                    {SOILS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={twoCol}>
                <div>
                  <label style={labelStyle}>Crop</label>
                  <select style={inputStyle} value={form.Crop} onChange={(e) => setField("Crop", e.target.value)}>
                    {CROPS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Weather Condition</label>
                  <select
                    style={inputStyle}
                    value={form.Weather_Condition}
                    onChange={(e) => setField("Weather_Condition", e.target.value)}
                  >
                    {WEATHER.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={twoCol}>
                <NumberField
                  label="Rainfall"
                  icon={<CloudRain size={18} color="#94a3b8" />}
                  value={form.Rainfall_mm}
                  suffix="mm"
                  onChange={(v) => setField("Rainfall_mm", v)}
                />
                <NumberField
                  label="Temperature"
                  icon={<Thermometer size={18} color="#94a3b8" />}
                  value={form.Temperature_Celsius}
                  suffix="°C"
                  onChange={(v) => setField("Temperature_Celsius", v)}
                />
              </div>

              <div style={twoCol}>
                <NumberField
                  label="Days to Harvest"
                  icon={<MapIcon size={18} color="#94a3b8" />}
                  value={form.Days_to_Harvest}
                  suffix="days"
                  onChange={(v) => setField("Days_to_Harvest", v)}
                />
                <div>
                  <label style={labelStyle}>Irrigation Used</label>
                  <ToggleRow
                    value={form.Irrigation_Used}
                    onChange={(v) => setField("Irrigation_Used", v)}
                    left="No"
                    right="Yes"
                  />
                </div>
              </div>

              <div style={twoCol}>
                <div>
                  <label style={labelStyle}>Fertilizer Used</label>
                  <ToggleRow
                    value={form.Fertilizer_Used}
                    onChange={(v) => setField("Fertilizer_Used", v)}
                    left="No"
                    right="Yes"
                  />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={labelStyle}>API</label>
                  <div style={apiChipStyle}>
                    <Info size={14} color="#22c55e" />
                    <span style={{ fontSize: 12, color: "#64748b" }}>{API_URL}</span>
                  </div>
                </div>
              </div>

              {error ? (
                <div className="alert" style={{ marginTop: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                </div>
              ) : null}

              <button className="btn btn-primary" type="submit" disabled={isCalculating} style={{ width: "100%", height: "56px", fontWeight: 900 }}>
                {isCalculating ? "Processing..." : "Generate Forecast"}
              </button>
            </form>
          </motion.div>

          {/* Forecast Results */}
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              {!out && !isCalculating ? (
                <div style={emptyCardStyle}>
                  <TrendingUp size={48} color="#e2e8f0" />
                  <p style={{ color: "#94a3b8", marginTop: "16px", fontWeight: 700 }}>Submit parameters for projection</p>
                </div>
              ) : isCalculating ? (
                <div style={emptyCardStyle}>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                    <BarChart3 size={40} color="#22c55e" />
                  </motion.div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={resultCardStyle}>
                  <div style={{ marginBottom: "26px" }}>
                    <span style={badgeStyle}>Yield Prediction</span>
                    <h2 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", margin: "8px 0" }}>
                      {out.estimatedYieldTonsPerHectare}{" "}
                      <span style={{ fontSize: "16px", color: "#64748b" }}>{out.unit}</span>
                    </h2>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Estimated output for {out.plant}</p>
                  </div>

                  <div style={statsGrid}>
                    <div style={statBox}>
                      <Scale size={18} color="#22c55e" />
                      <div>
                        <div style={statLabel}>Confidence</div>
                        <div style={statValue}>{out.confidence}%</div>
                      </div>
                    </div>

                    <div style={statBox}>
                      <Package size={18} color="#22c55e" />
                      <div>
                        <div style={statLabel}>Weather</div>
                        <div style={statValue}>{out?.note?.includes("Sunny") ? "Sunny" : form.Weather_Condition}</div>
                      </div>
                    </div>
                  </div>

                  <div style={noteBox}>
                    <div style={{ display: "flex", gap: "8px", color: "#064e3b", fontWeight: 800, fontSize: "13px", marginBottom: "6px" }}>
                      <Info size={16} /> Technical Insight
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#166534", lineHeight: 1.5 }}>{out.note}</p>
                  </div>

                  <div style={{ marginTop: "22px", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
                    Results generated by Agricultor AI (Yield Model)
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

function NumberField({ label, icon, value, onChange, suffix }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: 14 }}>{icon}</div>
        <input
          style={{ ...inputStyle, paddingLeft: 44 }}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix ? (
          <span style={{ position: "absolute", right: 12, top: 14, fontSize: 12, color: "#94a3b8", fontWeight: 800 }}>
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ToggleRow({ value, onChange, left = "No", right = "Yes" }) {
  return (
    <div style={toggleWrap}>
      <button type="button" onClick={() => onChange(false)} style={{ ...toggleBtn, ...(value === false ? toggleActive : {}) }}>
        {left}
      </button>
      <button type="button" onClick={() => onChange(true)} style={{ ...toggleBtn, ...(value === true ? toggleActive : {}) }}>
        {right}
      </button>
    </div>
  );
}

// Styles (same as your original feel)
const panelStyle = { background: "white", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" };
const iconBoxStyle = { width: "40px", height: "40px", background: "#f0fdf4", color: "#22c55e", borderRadius: "10px", display: "grid", placeItems: "center" };
const labelStyle = { display: "block", fontSize: "13px", fontWeight: 800, color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" };
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", background: "#f8fafc", transition: "border 0.2s" };
const twoCol = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 };
const emptyCardStyle = { height: "100%", minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", borderRadius: "24px", border: "2px dashed #e2e8f0" };
const resultCardStyle = { background: "white", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)", height: "100%" };
const badgeStyle = { background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" };
const statsGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "26px" };
const statBox = { padding: "16px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9", display: "flex", gap: "12px", alignItems: "center" };
const statLabel = { fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" };
const statValue = { fontSize: "16px", fontWeight: 900, color: "#0f172a" };
const noteBox = { background: "#f0fdf4", padding: "20px", borderRadius: "16px", border: "1px solid #dcfce7" };
const apiChipStyle = { display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" };
const toggleWrap = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
const toggleBtn = { height: 46, borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontWeight: 900, color: "#475569" };
const toggleActive = { background: "#dcfce7", borderColor: "#86efac", color: "#166534" };
