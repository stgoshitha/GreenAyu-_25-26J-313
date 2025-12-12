import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Beaker, Info, Leaf, ChevronRight, AlertCircle, ClipboardCheck } from "lucide-react";
import Page from "../_shared/Page";
import Container from "../../components/layout/Container";

const API_URL = "http://127.0.0.1:5000/fertilizer";

const SOIL_TYPES = ["Black", "Red", "Clayey", "Sandy", "Loamy"];
const CROP_TYPES = ['Iramusu','Pawatta', 'Ruk_aguna', 'SuduHandun'];

export default function FertilizerRecommend() {
  const [plant, setPlant] = useState("");

  const [form, setForm] = useState({
    Temparature: 35,
    Humidity: 58,
    Moisture: 35,
    Nitrogen: 4,
    Phosphorous: 16,
    Potassium: 14,
    Soil_Type: "Black",
    Crop_Type: "Cotton",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [out, setOut] = useState(null);
  const [error, setError] = useState("");

  const plantLabel = useMemo(() => {
    return plant?.trim() ? plant.trim() : "Medicinal Plant ";
  }, [plant]);

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
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

      const recommended = data?.recommended_fertilizer;
      if (!recommended) throw new Error("API response missing recommended_fertilizer.");

      // ✅ Minimal UI output (based on real API)
      setOut({
        plant: plantLabel,
        recommended_fertilizer: recommended,
        inputs: form,
        note:
          "This recommendation is based on temperature, humidity, moisture and soil nutrients. Verify with local agronomist before large-scale usage.",
      });
    } catch (err) {
      setError(
        err?.message?.includes("Failed to fetch")
          ? "Cannot reach API. Make sure backend is running and CORS is enabled."
          : err?.message || "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Page title="Nutrient Advisor" subtitle="Precision fertilizer protocols tailored to medicinal plant growth.">
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "40px",
            paddingBottom: "100px",
          }}
        >
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <form onSubmit={onSubmit}>
              {/* Optional plant name */}
              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>Target Plant (Optional)</label>
                <div style={{ position: "relative" }}>
                  <Leaf style={{ position: "absolute", left: "16px", top: "16px", color: "#22c55e" }} size={18} />
                  <input
                    style={{ ...inputStyle, paddingLeft: "48px" }}
                    value={plant}
                    onChange={(e) => setPlant(e.target.value)}
                    placeholder="e.g., Iramusu, Gotukola..."
                  />
                </div>
              </div>

              {/* API fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <Field
                  label="Temperature"
                  suffix="°C"
                  value={form.Temparature}
                  onChange={(v) => setField("Temparature", v)}
                />
                <Field
                  label="Humidity"
                  suffix="%"
                  value={form.Humidity}
                  onChange={(v) => setField("Humidity", v)}
                />
                <Field
                  label="Moisture"
                  suffix="%"
                  value={form.Moisture}
                  onChange={(v) => setField("Moisture", v)}
                />
                <Field label="Nitrogen" value={form.Nitrogen} onChange={(v) => setField("Nitrogen", v)} />
                <Field label="Phosphorous" value={form.Phosphorous} onChange={(v) => setField("Phosphorous", v)} />
                <Field label="Potassium" value={form.Potassium} onChange={(v) => setField("Potassium", v)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
                <div>
                  <label style={labelStyle}>Soil Type</label>
                  <select
                    style={inputStyle}
                    value={form.Soil_Type}
                    onChange={(e) => setField("Soil_Type", e.target.value)}
                  >
                    {SOIL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Crop Type</label>
                  <select
                    style={inputStyle}
                    value={form.Crop_Type}
                    onChange={(e) => setField("Crop_Type", e.target.value)}
                  >
                    {CROP_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error ? (
                <div className="alert" style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  background: "#064e3b",
                  color: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {isLoading ? "Requesting Recommendation..." : "Get Fertilizer Recommendation"}
                <ChevronRight size={18} />
              </button>
            </form>

            <div
              style={{
                marginTop: "18px",
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
              <Info size={14} color="#34d399" />
              <span>API: {API_URL}</span>
            </div>
          </motion.div>

          {/* Output Side */}
          <div style={{ position: "relative" }}>
            <AnimatePresence mode="wait">
              {!out && !isLoading ? (
                <div style={placeholderStyle}>
                  <Beaker size={48} color="#e2e8f0" />
                  <p style={{ marginTop: "16px", color: "#94a3b8" }}>Fill inputs and request recommendation</p>
                </div>
              ) : isLoading ? (
                <div style={placeholderStyle}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "3px solid #22c55e",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={prescriptionCard}>
                  <div style={{ borderBottom: "2px solid #f1f5f9", paddingBottom: "18px", marginBottom: "22px" }}>
                    <div
                      style={{
                        color: "#22c55e",
                        fontSize: "12px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        marginBottom: "6px",
                      }}
                    >
                      Recommendation For:
                    </div>
                    <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>{out.plant}</h3>
                  </div>

                  <div style={{ display: "grid", gap: "18px" }}>
                    <ResultRow
                      icon={<Beaker size={18} />}
                      label="Recommended Fertilizer"
                      value={out.recommended_fertilizer}
                    />
                    <ResultRow
                      icon={<Droplets size={18} />}
                      label="Soil / Crop"
                      value={`${out.inputs.Soil_Type} soil • ${out.inputs.Crop_Type}`}
                    />
                    <ResultRow
                      icon={<ClipboardCheck size={18} />}
                      label="NPK Inputs"
                      value={`N:${out.inputs.Nitrogen}, P:${out.inputs.Phosphorous}, K:${out.inputs.Potassium}`}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: "26px",
                      padding: "16px",
                      background: "#f0fdf4",
                      borderRadius: "16px",
                      border: "1px solid #dcfce7",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#166534", fontWeight: 900, fontSize: 12, textTransform: "uppercase" }}>
                      <Info size={14} /> Note
                    </div>
                    <p style={{ margin: "8px 0 0", fontSize: 14, color: "#064e3b", lineHeight: 1.55 }}>{out.note}</p>
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

// Small input field component
function Field({ label, value, onChange, suffix }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={inputStyle}
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

// Sub-components
function ResultRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <div style={{ padding: "10px", background: "#f0fdf4", borderRadius: "10px", color: "#22c55e" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: 800 }}>{value}</div>
      </div>
    </div>
  );
}

// Styles
const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 900,
  color: "#475569",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: "15px",
  background: "#f8fafc",
};
const placeholderStyle = {
  height: "100%",
  minHeight: "420px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
  borderRadius: "24px",
  border: "2px dashed #e2e8f0",
};
const prescriptionCard = {
  background: "white",
  padding: "40px",
  borderRadius: "24px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
};
