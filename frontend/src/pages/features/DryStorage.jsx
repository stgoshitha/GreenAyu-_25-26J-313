import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  AlertCircle,
  Settings,
  RefreshCw,
  Cpu,
  ChevronRight,
  Sparkles,
  Activity,
  ShieldCheck,
  Info,
  SlidersHorizontal,
  Leaf,
} from "lucide-react";

import Container from "../../components/layout/Container";
import { sensorService } from "../../services/sensorService";
import { weatherService } from "../../services/weatherService";
import { AuthContext } from "../../App";
import { validateAndDeductCredits } from "../../utils/creditValidator";

const DRYING_API = "http://127.0.0.1:8000/herb/drying-time";
const SHELF_API = "http://127.0.0.1:8000/shelf-life";

const PLANT_TYPE_MAP = {
  Ruk_Aguna: "leaf",
  Pawatta: "leaf",
  Iramusu: "root",
  Sudu_Handun: "leaf",
};

// These values are fallback/default values for advanced shelf-life parameters.
// Normal users do not need to manually enter these unless they open Advanced Settings.
const PLANT_DEFAULTS = {
  Ruk_Aguna: {
    initial_moisture_pct: 45,
    airflow_ms: 1.5,
    layer_thickness_cm: 0.5,
    respiration_rate: 18.0,
    ethylene_sensitivity: 0.75,
    water_content: 85.0,
    damage_level: 0.1,
    microbial_risk: 0.2,
  },
  Pawatta: {
    initial_moisture_pct: 48,
    airflow_ms: 1.5,
    layer_thickness_cm: 0.5,
    respiration_rate: 16.0,
    ethylene_sensitivity: 0.7,
    water_content: 82.0,
    damage_level: 0.1,
    microbial_risk: 0.25,
  },
  Iramusu: {
    initial_moisture_pct: 55,
    airflow_ms: 1.2,
    layer_thickness_cm: 0.7,
    respiration_rate: 12.0,
    ethylene_sensitivity: 0.6,
    water_content: 78.0,
    damage_level: 0.12,
    microbial_risk: 0.3,
  },
  Sudu_Handun: {
    initial_moisture_pct: 50,
    airflow_ms: 1.4,
    layer_thickness_cm: 0.5,
    respiration_rate: 14.0,
    ethylene_sensitivity: 0.65,
    water_content: 80.0,
    damage_level: 0.1,
    microbial_risk: 0.22,
  },
};

export default function DryStorage() {
  const auth = React.useContext(AuthContext);

  const [isManual, setIsManual] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sensors, setSensors] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Basic user inputs
    plant_type: "Ruk_Aguna",
    drying_method: "Air Drying",
    preparation: "Whole",
    storage_type: "refrigerated",

    // Sensor / environment values
    temperature_C: 35,
    humidity_pct: 50,
    temperature_c: 35,
    humidity_percent: 50,

    // Advanced drying values
    initial_moisture_pct: 45,
    airflow_ms: 1.5,
    layer_thickness_cm: 0.5,

    // Advanced shelf-life values
    respiration_rate: 18.0,
    ethylene_sensitivity: 0.75,
    water_content: 85.0,
    damage_level: 0.1,
    microbial_risk: 0.2,
  });

  useEffect(() => {
    if (!isManual) fetchSensors();

    const timer = setInterval(() => {
      if (!isManual) fetchSensors();
    }, 30000);

    return () => clearInterval(timer);
  }, [isManual]);

  // Auto-fill advanced default values when plant type changes.
  // This keeps the UI simple for normal users.
  useEffect(() => {
    const defaults = PLANT_DEFAULTS[form.plant_type];
    if (!defaults) return;

    setForm((prev) => ({
      ...prev,
      ...defaults,
    }));
  }, [form.plant_type]);

  const fetchWeather = async () => {
    try {
      const userLoc = auth.user?.location;
      const coords =
        userLoc && !userLoc.isAuto
          ? { lat: userLoc.lat, lon: userLoc.lon }
          : await weatherService.getUserLocation();

      if (coords) {
        await weatherService.getWeatherByCoords(coords.lat, coords.lon, userLoc?.city);
      } else {
        await weatherService.getWeatherByCity("Colombo");
      }
    } catch (err) {
      console.warn("Weather fetch skipped:", err.message);
    }
  };

  const fetchSensors = async () => {
    try {
      await fetchWeather();
      const res = await sensorService.getDryStorageData();

      if (res.ok) {
        setSensors(res.data);
        setLastSync(new Date());

        setForm((prev) => ({
          ...prev,
          // Drying model sensor values
          temperature_C: res.data.interiorTemperature ?? prev.temperature_C,
          humidity_pct: res.data.interiorHumidity ?? prev.humidity_pct,

          // Shelf-life model sensor values
          temperature_c: res.data.interiorTemperature ?? prev.temperature_c,
          humidity_percent: res.data.interiorHumidity ?? prev.humidity_percent,
        }));
      }
    } catch (err) {
      console.warn("Sensor fetch failed:", err.message);
    }
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = async (e) => {
    e.preventDefault();

    const canProceed = await validateAndDeductCredits(
      auth,
      "Smart Drying & Storage Prediction"
    );
    if (!canProceed) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const dryingPayload = {
        plant_type: form.plant_type,
        initial_moisture_pct: Number(form.initial_moisture_pct),
        temperature_C: Number(form.temperature_C),
        humidity_pct: Number(form.humidity_pct),
        airflow_ms: Number(form.airflow_ms),
        layer_thickness_cm: Number(form.layer_thickness_cm),
        drying_method: form.drying_method,
        preparation: form.preparation,
      };

      const shelfPayload = {
        plant_type: PLANT_TYPE_MAP[form.plant_type] || "leaf",
        storage_type: form.storage_type,
        temperature_c: Number(form.temperature_c),
        humidity_percent: Number(form.humidity_percent),
        respiration_rate: Number(form.respiration_rate),
        ethylene_sensitivity: Number(form.ethylene_sensitivity),
        water_content: Number(form.water_content),
        damage_level: Number(form.damage_level),
        microbial_risk: Number(form.microbial_risk),
      };

      const [resDry, resShelf] = await Promise.all([
        fetch(DRYING_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dryingPayload),
        }),
        fetch(SHELF_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shelfPayload),
        }),
      ]);

      if (!resDry.ok || !resShelf.ok) {
        const dErr = !resDry.ok ? await resDry.text() : "";
        const sErr = !resShelf.ok ? await resShelf.text() : "";
        throw new Error(`Engine Error: ${dErr || sErr}`);
      }

      const dData = await resDry.json();
      const sData = await resShelf.json();

      setResults({
        dryingTime: dData.drying_time_hours,
        shelfLife: sData.shelf_life_days,
      });
    } catch (err) {
      setError(err.message || "Prediction failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>
      {/* Header */}
      <section style={heroSection}>
        <div style={heroGlow} />
        <Container style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={heroBadge}>
              <Settings size={12} color="#22c55e" />
              <span>AI + IoT Preservation System</span>
            </div>

            <h1 style={heroTitle}>
              Smart Dry & <span style={{ color: "#22c55e" }}>Store</span>
            </h1>

            <p style={heroText}>
              Predict drying duration and storage life using IoT sensor data and AI models.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main Section */}
      <section style={mainSection}>
        <Container>
          {/* Sensor Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={statusBar}
          >
            <div style={connList}>
              <ConnectivityIndicator label="STORAGE_NODE_01" active={!!sensors} />
              <div style={syncMeta}>
                <RefreshCw size={12} className={loading ? "spin" : ""} color="#64748b" />
                <span>Last Sync: {lastSync?.toLocaleTimeString() || "Scanning..."}</span>
              </div>
            </div>

            <div style={modeToggleBar}>
              <span style={modeLabel}>
                CONTROL:{" "}
                <span style={{ color: isManual ? "#f59e0b" : "#22c55e" }}>
                  {isManual ? "MANUAL" : "AUTO-SYNC"}
                </span>
              </span>
              <button type="button" onClick={() => setIsManual(!isManual)} style={toggleBtn}>
                {isManual ? "Enable Sensors" : "Override Manual"}
              </button>
            </div>
          </motion.div>

          <div style={layoutGrid}>
            {/* Input Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              style={glassCard}
            >
              <div style={cardHeader}>
                <div style={iconBox}>
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 style={cardTitle}>Process Parameters</h3>
                  <p style={cardSub}>Basic inputs + optional advanced configuration</p>
                </div>
              </div>

              <form onSubmit={onCalculate}>
                <div style={formSections}>
                  {/* Basic Section */}
                  <div style={sectionBox}>
                    <span style={sectionLabel}>Basic User Inputs</span>

                    <div style={inputRow}>
                      <div style={half}>
                        <label style={fLabel}>Plant Type</label>
                        <CustomDropdown
                          value={form.plant_type}
                          onChange={(value) => updateForm("plant_type", value)}
                          options={[
                            { value: "Ruk_Aguna", label: "Ruk Aguna" },
                            { value: "Pawatta", label: "Pawatta" },
                            { value: "Iramusu", label: "Iramusu" },
                            { value: "Sudu_Handun", label: "Sudu Handun" },
                          ]}
                        />
                      </div>

                      <div style={half}>
                        <label style={fLabel}>Drying Method</label>
                        <CustomDropdown
                          value={form.drying_method}
                          onChange={(value) => updateForm("drying_method", value)}
                          options={[
                            { value: "Air Drying", label: "Air Drying" },
                            { value: "Dehydrator", label: "Dehydrator" },
                            { value: "Freeze Drying", label: "Freeze Drying" },
                            { value: "Oven", label: "Oven" },
                          ]}
                        />
                      </div>
                    </div>

                    <div style={{ ...inputRow, marginTop: 12 }}>
                      <div style={half}>
                        <label style={fLabel}>Preparation</label>
                        <CustomDropdown
                          value={form.preparation}
                          onChange={(value) => updateForm("preparation", value)}
                          options={[
                            { value: "Chopped", label: "Chopped / Cut" },
                            { value: "Stem-on", label: "Stem-on" },
                            { value: "Whole", label: "Whole Leaf" },
                          ]}
                        />
                      </div>

                      <div style={half}>
                        <label style={fLabel}>Storage Mode</label>
                        <CustomDropdown
                          value={form.storage_type}
                          onChange={(value) => updateForm("storage_type", value)}
                          options={[
                            { value: "refrigerated", label: "Refrigerated / Cool" },
                            { value: "ambient", label: "Ambient / Room" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* IoT Sensor Section */}
                  <div style={sectionBox}>
                    <span style={sectionLabel}>IoT Sensor Readings</span>

                    <div style={sensorNote}>
                      <Leaf size={15} color="#22c55e" />
                      <span>
                        Temperature and humidity are auto-filled from the IoT drying/storage node.
                      </span>
                    </div>

                    <div style={inputGrid}>
                      <DoubleMetric
                        label="Chamber Temp"
                        value={form.temperature_C}
                        unit="°C"
                        readOnly={!isManual}
                        onChange={(v) => {
                          updateForm("temperature_C", v);
                          updateForm("temperature_c", v);
                        }}
                      />

                      <DoubleMetric
                        label="Chamber Humidity"
                        value={form.humidity_pct}
                        unit="%"
                        readOnly={!isManual}
                        onChange={(v) => {
                          updateForm("humidity_pct", v);
                          updateForm("humidity_percent", v);
                        }}
                      />
                    </div>
                  </div>

                  {/* Advanced Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={advancedToggle}
                  >
                    <SlidersHorizontal size={16} />
                    <span>{showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}</span>
                  </button>

                  {/* Advanced Section */}
                  <AnimatePresence initial={false}>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={advancedWrapper}>
                          <div style={sectionBox}>
                            <span style={sectionLabel}>Advanced Drying Parameters</span>
                            <div style={inputGrid}>
                              <DoubleMetric
                                label="Initial Moisture"
                                value={form.initial_moisture_pct}
                                unit="%"
                                onChange={(v) => updateForm("initial_moisture_pct", v)}
                              />
                              <DoubleMetric
                                label="Airflow Velocity"
                                value={form.airflow_ms}
                                unit="m/s"
                                onChange={(v) => updateForm("airflow_ms", v)}
                              />
                              <DoubleMetric
                                label="Layer Thickness"
                                value={form.layer_thickness_cm}
                                unit="cm"
                                onChange={(v) => updateForm("layer_thickness_cm", v)}
                              />
                            </div>
                          </div>

                          <div style={sectionBox}>
                            <span style={sectionLabel}>Advanced Shelf-Life Risk Parameters</span>
                            <div style={inputGrid}>
                              <DoubleMetric
                                label="Respiration Rate"
                                value={form.respiration_rate}
                                unit="RR"
                                onChange={(v) => updateForm("respiration_rate", v)}
                              />
                              <DoubleMetric
                                label="Water Content"
                                value={form.water_content}
                                unit="%"
                                onChange={(v) => updateForm("water_content", v)}
                              />
                              <DoubleMetric
                                label="Ethylene Sensitivity"
                                value={form.ethylene_sensitivity}
                                unit="0-1"
                                step="0.01"
                                onChange={(v) => updateForm("ethylene_sensitivity", v)}
                              />
                              <DoubleMetric
                                label="Damage Level"
                                value={form.damage_level}
                                unit="0-1"
                                step="0.01"
                                onChange={(v) => updateForm("damage_level", v)}
                              />
                              <DoubleMetric
                                label="Microbial Risk"
                                value={form.microbial_risk}
                                unit="0-1"
                                step="0.01"
                                onChange={(v) => updateForm("microbial_risk", v)}
                              />
                              <DoubleMetric
                                label="Holding Humidity"
                                value={form.humidity_percent}
                                unit="%"
                                readOnly={!isManual}
                                onChange={(v) => {
                                  updateForm("humidity_percent", v);
                                  updateForm("humidity_pct", v);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {error && (
                  <div style={errAlert}>
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={submitAction}>
                  {loading ? (
                    <div style={btnContent}>
                      <div style={miniSpin} />
                      <span>Optimizing preservation...</span>
                    </div>
                  ) : (
                    <div style={btnContent}>
                      <span>Initialize Lifecycle AI</span>
                      <ChevronRight size={18} />
                    </div>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Result Panel */}
            <div style={visPane}>
              <AnimatePresence mode="wait">
                {!results && !loading ? (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={idleState}>
                    <div style={pulseBox}>
                      <Clock size={48} color="#22c55e" />
                    </div>
                    <h4 style={idleTitle}>Preservation Matrix Ready</h4>
                    <p style={idleDesc}>Select basic details and run prediction</p>
                  </motion.div>
                ) : loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={scanningState}>
                    <div style={loadingRing} />
                    <Activity size={40} color="#22c55e" />
                    <p style={loadingText}>Synthesizing Dehydration & Shelf-Life Models...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="res"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={resultGlassCard}
                  >
                    <div style={resHeader}>
                      <div>
                        <span style={resTag}>PRESERVATION REPORT</span>
                        <h3 style={resMainTitle}>Optimization Verdict</h3>
                      </div>
                      <div style={shieldBox}>
                        <ShieldCheck size={28} color="#22c55e" />
                      </div>
                    </div>

                    <div style={bigMetricsGrid}>
                      <HighlightCard
                        icon={<Clock size={20} />}
                        label="Ideal Drying Cycle"
                        value={
                          results.dryingTime !== undefined
                            ? Number(results.dryingTime).toFixed(1)
                            : "---"
                        }
                        unit="Hours"
                        color="#3b82f6"
                      />

                      <HighlightCard
                        icon={<Calendar size={20} />}
                        label="Estimated Shelf Life"
                        value={
                          results.shelfLife !== undefined
                            ? Number(results.shelfLife).toFixed(1)
                            : "---"
                        }
                        unit="Days"
                        color="#22c55e"
                      />
                    </div>

                    <div style={insightCard}>
                      <div style={insHead}>
                        <Sparkles size={16} color="#4ade80" />
                        <span>AI Storage Intelligence</span>
                      </div>
                      <p style={insText}>
                        For best preservation, maintain stable chamber temperature around {form.temperature_c}°C
                        and humidity around {form.humidity_percent}%. The system combines real-time IoT readings
                        with plant-specific parameters to estimate drying duration and storage life.
                      </p>
                    </div>

                    <div style={weatherContext}>
                      <Info size={14} />
                      <span>
                        Contextual sync with storage node sensors @ {lastSync?.toLocaleTimeString() || "Manual mode"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Container>

        <style>{`
          .spin { animation: spin 2s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </section>
    </div>
  );
}

const ConnectivityIndicator = ({ label, active }) => (
  <div
    style={{
      ...connTag,
      background: active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
      color: active ? "#166534" : "#991b1b",
    }}
  >
    <div style={{ ...dot, background: active ? "#22c55e" : "#ef4444" }} />
    <span>{label}</span>
  </div>
);

const DoubleMetric = ({ label, value, unit, readOnly, onChange, step = "0.1" }) => (
  <div style={{ ...mBox, opacity: readOnly ? 0.85 : 1 }}>
    <span style={mLabel}>{label}</span>
    <div style={mInputWrap}>
      <input
        style={{ ...mInput, cursor: readOnly ? "not-allowed" : "text" }}
        type="number"
        step={step}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
      <span style={mUnit}>{unit}</span>
    </div>
  </div>
);

const HighlightCard = ({ icon, label, value, unit, color }) => (
  <div style={hCard}>
    <div style={{ ...hIcon, color }}>{icon}</div>
    <div style={hContent}>
      <span style={hLabel}>{label}</span>
      <div style={hValRow}>
        <span style={hVal}>{value}</span>
        <span style={hUnit}>{unit}</span>
      </div>
    </div>
  </div>
);

const CustomDropdown = ({ value, onChange, options, placeholder = "Select option" }) => {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef(null);
  const selectedOption = options.find((item) => item.value === value);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      style={{ ...customSelectWrapper, zIndex: open ? 99999 : 20 }}
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
      onFocus={openDropdown}
      onBlur={closeDropdown}
    >
      <button
        type="button"
        style={{
          ...customSelectButton,
          borderColor: open ? "#22c55e" : "#e2e8f0",
          boxShadow: open
            ? "0 0 0 4px rgba(34,197,94,0.12)"
            : "0 8px 18px rgba(15,23,42,0.04)",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <span style={{ ...customArrow, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={customDropdownMenu}>
          {options.map((item) => (
            <div
              key={item.value}
              style={{
                ...customDropdownOption,
                ...(item.value === value ? customDropdownOptionActive : {}),
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const heroSection = {
  position: "relative",
  padding: "120px 0 80px",
  background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)",
  textAlign: "center",
  overflow: "hidden",
};

const heroGlow = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  height: "400px",
  background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 60%)",
  pointerEvents: "none",
};

const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 14px",
  background: "rgba(34,197,94,0.08)",
  border: "1px solid rgba(34,197,94,0.2)",
  borderRadius: "100px",
  marginBottom: "24px",
  fontSize: "12px",
  fontWeight: 800,
  color: "#22c55e",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const heroTitle = {
  fontSize: "clamp(40px, 6vw, 64px)",
  fontWeight: 900,
  letterSpacing: "-2px",
  marginBottom: "24px",
  color: "white",
  lineHeight: 1.1,
};

const heroText = {
  fontSize: "16px",
  color: "rgba(255,255,255,0.45)",
  margin: "0 auto",
  maxWidth: "620px",
};

const mainSection = {
  padding: "80px 0 120px",
  background: "#f8fafc",
  color: "#0a0e0a",
  borderRadius: "40px 40px 0 0",
  minHeight: "600px",
  zIndex: 2,
  position: "relative",
};

const statusBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
  padding: "16px 24px",
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.5)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.02)",
};

const connList = { display: "flex", alignItems: "center", gap: "24px" };

const connTag = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 14px",
  borderRadius: "100px",
  fontSize: "10px",
  fontWeight: 900,
  letterSpacing: "0.5px",
};

const dot = { width: "8px", height: "8px", borderRadius: "50%" };

const syncMeta = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  color: "#94a3b8",
  fontWeight: 700,
};

const modeToggleBar = { display: "flex", alignItems: "center", gap: "16px" };
const modeLabel = { fontSize: "11px", fontWeight: 800, color: "#475569" };

const toggleBtn = {
  background: "#0f172a",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "10px",
  fontSize: "11px",
  fontWeight: 900,
  cursor: "pointer",
};

const layoutGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(450px, 1fr) 1.2fr",
  gap: "40px",
  marginBottom: "100px",
};

const glassCard = {
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(32px)",
  padding: "40px",
  borderRadius: "32px",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  boxShadow: "0 40px 100px rgba(0,0,0,0.04)",
};

const cardHeader = { display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" };

const iconBox = {
  width: "48px",
  height: "48px",
  background: "#f8fafc",
  color: "#0f172a",
  borderRadius: "14px",
  display: "grid",
  placeItems: "center",
};

const cardTitle = { margin: 0, fontSize: "20px", fontWeight: 900 };
const cardSub = { margin: "2px 0 0", fontSize: "13px", fontWeight: 700, color: "#64748b" };
const formSections = { display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" };

const sectionBox = {
  padding: "24px",
  background: "#f8fafc",
  borderRadius: "20px",
  border: "1px solid #f1f5f9",
};

const sectionLabel = {
  display: "block",
  fontSize: "10px",
  fontWeight: 900,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "20px",
};

const inputGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" };
const inputRow = { display: "flex", gap: "12px" };
const half = { flex: 1 };
const fLabel = { display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", marginBottom: "8px" };

const sensorNote = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 14px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#166534",
  borderRadius: "14px",
  fontSize: "12px",
  fontWeight: 800,
  marginBottom: "14px",
};

const advancedToggle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "14px 18px",
  borderRadius: "16px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  color: "#166534",
  fontSize: "13px",
  fontWeight: 900,
  cursor: "pointer",
};

const advancedWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  marginTop: "0px",
};

const mBox = {
  background: "white",
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #f1f5f9",
};

const mLabel = { display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", marginBottom: "8px" };
const mInputWrap = { display: "flex", alignItems: "baseline", gap: "4px" };

const mInput = {
  width: "100%",
  border: "none",
  fontSize: "20px",
  fontWeight: 900,
  outline: "none",
  background: "transparent",
};

const mUnit = { fontSize: "12px", fontWeight: 800, color: "#94a3b8" };

const customSelectWrapper = { position: "relative", width: "100%", zIndex: 100 };

const customSelectButton = {
  width: "100%",
  height: "50px",
  padding: "0 16px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  outline: "none",
  transition: "0.2s ease",
};

const customArrow = { fontSize: "16px", color: "#64748b", transition: "0.2s ease" };

const customDropdownMenu = {
  position: "absolute",
  top: "58px",
  left: 0,
  right: 0,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "6px",
  zIndex: 9999,
  boxShadow: "0 18px 40px rgba(15,23,42,0.14)",
};

const customDropdownOption = {
  padding: "12px 14px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: 700,
  color: "#334155",
  cursor: "pointer",
  transition: "0.2s ease",
};

const customDropdownOptionActive = {
  background: "#dcfce7",
  color: "#166534",
  fontWeight: 900,
};

const submitAction = {
  width: "100%",
  padding: "20px",
  borderRadius: "18px",
  border: "none",
  background: "#0f172a",
  color: "white",
  cursor: "pointer",
  transition: "0.3s ease",
};

const btnContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  fontSize: "16px",
  fontWeight: 900,
};

const miniSpin = {
  width: "18px",
  height: "18px",
  border: "3px solid rgba(255,255,255,0.2)",
  borderTopColor: "white",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const errAlert = {
  marginBottom: "24px",
  padding: "16px",
  borderRadius: "14px",
  background: "#fff1f2",
  color: "#e11d48",
  fontSize: "13px",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const visPane = { position: "relative" };

const idleState = {
  height: "100%",
  minHeight: "600px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "32px",
  border: "2px dashed rgba(226, 232, 240, 0.6)",
  background: "rgba(255,255,255,0.3)",
};

const pulseBox = {
  width: "100px",
  height: "100px",
  background: "white",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
  position: "relative",
};

const idleTitle = { margin: "24px 0 8px", fontSize: "18px", fontWeight: 900, color: "#0f172a" };
const idleDesc = { margin: 0, fontSize: "14px", fontWeight: 700, color: "#94a3b8" };
const scanningState = { ...idleState, background: "white", border: "none" };

const loadingRing = {
  position: "absolute",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  border: "4px solid rgba(34,197,94,0.1)",
  borderTopColor: "#22c55e",
  animation: "spin 1s linear infinite",
};

const loadingText = { marginTop: "100px", fontSize: "15px", fontWeight: 800, color: "#22c55e" };

const resultGlassCard = {
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(30px)",
  padding: "48px",
  borderRadius: "32px",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 50px 120px rgba(0,0,0,0.06)",
};

const resHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
};

const resTag = {
  background: "#ebf5ff",
  color: "#2563eb",
  padding: "6px 12px",
  borderRadius: "8px",
  fontSize: "10px",
  fontWeight: 900,
  letterSpacing: "1px",
};

const resMainTitle = { margin: "8px 0 0", fontSize: "28px", fontWeight: 900 };

const shieldBox = {
  width: "56px",
  height: "56px",
  background: "#f0fdf4",
  borderRadius: "16px",
  display: "grid",
  placeItems: "center",
};

const bigMetricsGrid = { display: "grid", gap: "20px", marginBottom: "40px" };

const hCard = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  padding: "32px",
  background: "#f8fafc",
  borderRadius: "24px",
  border: "1px solid #f1f5f9",
};

const hIcon = {
  width: "56px",
  height: "56px",
  background: "white",
  borderRadius: "16px",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 10px 20px rgba(0,0,0,0.03)",
};

const hContent = { display: "flex", flexDirection: "column", gap: "4px" };
const hLabel = { fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" };
const hValRow = { display: "flex", alignItems: "baseline", gap: "8px" };
const hVal = { fontSize: "32px", fontWeight: 900, color: "#0f172a" };
const hUnit = { fontSize: "14px", fontWeight: 800, color: "#22c55e" };

const insightCard = {
  background: "#0f172a",
  padding: "32px",
  borderRadius: "24px",
  marginBottom: "24px",
};

const insHead = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
  fontWeight: 900,
  color: "#4ade80",
  marginBottom: "16px",
  textTransform: "uppercase",
};

const insText = {
  margin: 0,
  fontSize: "16px",
  color: "rgba(255,255,255,0.8)",
  lineHeight: 1.6,
};

const weatherContext = {
  display: "flex",
  gap: "10px",
  fontSize: "12px",
  color: "#94a3b8",
  fontWeight: 700,
};
