import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sprout, TrendingUp, FlaskConical, Map,
    Thermometer, Info, CheckCircle2, AlertCircle, Settings,
    RefreshCw, BarChart4, ChevronRight, Wind, Zap, Gauge,
    ShieldCheck, Sparkles, Droplets
} from "lucide-react";
// Removing Page wrapper
import Container from "../../components/layout/Container";
import { sensorService } from "../../services/sensorService";
import { weatherService } from "../../services/weatherService";
import { AuthContext } from "../../App";
import { validateAndDeductCredits } from "../../utils/creditValidator";

const FERTILIZER_API = "http://127.0.0.1:8000/fertilizer";
const YIELD_API = "http://127.0.0.1:8000/yield";

const FERTILIZER_NAMES = {
    "10-26-26": "Diammophoska",
    "17-17-17": "Triple 17",
    "28-28": "UAP",
    "20-20": "Triple 20",
    "14-35-14": "Compound Fertilizer 14-35-14"
};

export default function YieldOptimization() {
    const auth = React.useContext(AuthContext);
    const [isManual, setIsManual] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sensors, setSensors] = useState(null);
    const [weather, setWeather] = useState(null);
    const [lastSync, setLastSync] = useState(null);

    const [form, setForm] = useState({
        Region: "West",
        Soil_Type: "Sandy",
        Crop: "Ruk_Aguna",
        Rainfall_mm: 0,
        Temperature_Celsius: 0,
        Fertilizer_Used: true,
        Irrigation_Used: true,
        Weather_Condition: "Sunny",
        Days_to_Harvest: 90,
        Nitrogen: 0,
        Phosphorous: 0,
        Potassium: 0,
        Humidity: 60,
        Moisture: 45
    });

    const [results, setResults] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isManual) fetchData();
        const timer = setInterval(() => { if (!isManual) fetchData(); }, 20000);
        return () => clearInterval(timer);
    }, [isManual]);

    const fetchData = async () => {
        // Use manual location if set, otherwise auto-detect
        const userLoc = auth.user?.location;
        const coords = (userLoc && !userLoc.isAuto) 
            ? { lat: userLoc.lat, lon: userLoc.lon }
            : await weatherService.getUserLocation();

        const [hData, dData, wData] = await Promise.all([
            sensorService.getHerbqData(),
            sensorService.getDryStorageData(),
            coords
                ? weatherService.getWeatherByCoords(coords.lat, coords.lon, userLoc?.city)
                : weatherService.getWeatherByCity("Colombo")
        ]);

        if (hData.ok) {
            setSensors(prev => ({ ...prev, ...hData.data }));
            setLastSync(new Date());
            setForm(prev => ({
                ...prev,
                Nitrogen: hData.data.nitrogen ?? prev.Nitrogen,
                Phosphorous: hData.data.phosphorus ?? prev.Phosphorous,
                Potassium: hData.data.potassium ?? prev.Potassium,
                Moisture: hData.data.moisture ?? prev.Moisture
            }));
        }

        if (dData.ok) {
            setForm(prev => ({
                ...prev,
                Temperature_Celsius: dData.data.exteriorTemperature ?? prev.Temperature_Celsius,
                Humidity: dData.data.exteriorHumidity ?? prev.Humidity
            }));
        }

        if (wData) {
            setWeather(wData);
            setForm(prev => ({
                ...prev,
                Temperature_Celsius: dData.ok ? (dData.data.exteriorTemperature ?? wData.temp) : wData.temp,
                Humidity: dData.ok ? (dData.data.exteriorHumidity ?? wData.humidity) : wData.humidity,
                Rainfall_mm: wData.rainfall > 0 ? wData.rainfall : prev.Rainfall_mm,
                Weather_Condition: mapWeather(wData.condition)
            }));
        }
    };

    const mapWeather = (cond) => {
        if (cond.includes('Rain')) return 'Rainy';
        if (cond.includes('Cloud')) return 'Cloudy';
        return 'Sunny';
    };

    const runOptimization = async (e) => {
        e.preventDefault();

        // ── CREDIT VALIDATION ──
        const canProceed = await validateAndDeductCredits(auth, "High-Fertilizer Recommendation Forecast");
        if (!canProceed) return;

        setLoading(true);
        setError("");
        setResults(null);

        try {
            const yieldPayload = {
                Region: form.Region,
                Soil_Type: form.Soil_Type,
                Crop: form.Crop,
                Rainfall_mm: Number(form.Rainfall_mm),
                Temperature_Celsius: Number(form.Temperature_Celsius),
                Fertilizer_Used: form.Fertilizer_Used ? 1 : 0,
                Irrigation_Used: form.Irrigation_Used ? 1 : 0,
                Weather_Condition: form.Weather_Condition,
                Days_to_Harvest: Number(form.Days_to_Harvest)
            };

            const fertPayload = {
                Temparature: Number(form.Temperature_Celsius),
                Humidity: Number(form.Humidity),
                Moisture: Number(form.Moisture),
                Nitrogen: Number(form.Nitrogen),
                Phosphorous: Number(form.Phosphorous),
                Potassium: Number(form.Potassium),
                Soil_Type: form.Soil_Type,
                Crop_Type: form.Crop // Removed replace('_', ' ') to keep internal IDs
            };

            const [resYield, resFert] = await Promise.all([
                fetch(YIELD_API, { method: 'POST', body: JSON.stringify(yieldPayload), headers: { 'Content-Type': 'application/json' } }),
                fetch(FERTILIZER_API, { method: 'POST', body: JSON.stringify(fertPayload), headers: { 'Content-Type': 'application/json' } })
            ]);

            if (!resYield.ok || !resFert.ok) throw new Error("Optimization Engine failure.");

            const yData = await resYield.json();
            const fData = await resFert.json();

            setResults({
                yield: yData.yield_tons_per_hectare,
                fertilizer: fData.recommended_fertilizer
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>
            
            {/* ── HEADER (DARK) ── */}
            <section style={{ position: "relative", padding: "120px 0 80px", background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)", textAlign: "center", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
                
                <Container style={{ position: "relative", zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
                            <Sprout size={12} color="#22c55e" />
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px" }}>Productivity Forecast</span>
                        </div>
                        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "24px", color: "white", lineHeight: 1.1 }}>
                            High-Fertilizer <span style={{ color: "#22c55e" }}>Recommendation</span>
                        </h1>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 auto", maxWidth: "600px" }}>
                            Synthesizing NPK sensor data and climate forecasts for maximum productivity.
                        </p>
                    </motion.div>
                </Container>
            </section>

            {/* ── DIAGNOSTIC APPARATUS (WHITE SECTION) ── */}
            <section style={{ padding: "80px 0 120px", background: "#f8fafc", color: "#0a0e0a", borderRadius: "40px 40px 0 0", minHeight: "600px", zIndex: 2, position: "relative" }}>
                <Container>
                    {/* Precision Status Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={statusBanner}
                    >
                        <div style={connList}>
                            <NodeIndicator label="SOIL_NETWORK" active={!!sensors} />
                            <NodeIndicator label="COSMIC_WEATHER" active={!!weather} />
                            <div style={syncMeta}>
                                <RefreshCw size={12} className={loading ? 'spin' : ''} color="#64748b" />
                                <span>Last Sync: {lastSync?.toLocaleTimeString() || 'Pending'}</span>
                            </div>
                        </div>
                        <div style={modeControl}>
                            <span style={modeText}>STRATEGY: <span style={{ color: isManual ? '#f59e0b' : '#22c55e' }}>{isManual ? 'MANUAL_DRAFT' : 'HYBRID_AUTOPILOT'}</span></span>
                            <button type="button" onClick={() => setIsManual(!isManual)} style={toggleAction}>
                                {isManual ? 'Restore Auto-Sync' : 'Manual Override'}
                            </button>
                        </div>
                    </motion.div>

                <div style={layoutGrid}>
                    {/* Optimization Command Center */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={glassCard}
                    >
                        <div style={cardHeader}>
                            <div style={iconCircle}><Gauge size={20} /></div>
                            <div>
                                <h3 style={cardTitle}>Intelligence Control</h3>
                                <p style={cardSub}>Geospacial & Chemical Inputs</p>
                            </div>
                        </div>

                        <form onSubmit={runOptimization}>
                            <div style={formFlow}>
                                {/* Subsection: Terrain & Crop */}
                                <div style={subSection}>
                                    <span style={subLabel}>Terrain Profile</span>
                                    <div style={flexRow}>
                                        <div style={half}>
                                            <label style={fLabel}>Soil Composition</label>
                                            <select style={fInput} value={form.Soil_Type} onChange={e => setForm({ ...form, Soil_Type: e.target.value })}>
                                                <option>Sandy</option><option>Loam</option><option>Clay</option><option>Peaty</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '12px' }}>
                                        <label style={fLabel}>Cultivation Target</label>
                                        <select style={fInput} value={form.Crop} onChange={e => setForm({ ...form, Crop: e.target.value })}>
                                            <option value="Ruk_Aguna">Ruk Aguna</option>
                                            <option value="Pawatta">Pawatta</option>
                                            <option value="SuduHandun">Sudu Handun</option>
                                            <option value="Iramusu">Iramusu</option>

                                        </select>
                                    </div>
                                </div>

                                {/* Subsection: Nutrients */}
                                <div style={subSection}>
                                    <span style={subLabel}>Soil Chemistry (NPK)</span>
                                    <div style={npkGrid}>
                                        <NPKPanel label="N" value={form.Nitrogen} readOnly={!isManual} onChange={v => setForm({ ...form, Nitrogen: v })} color="#22c55e" />
                                        <NPKPanel label="P" value={form.Phosphorous} readOnly={!isManual} onChange={v => setForm({ ...form, Phosphorous: v })} color="#3b82f6" />
                                        <NPKPanel label="K" value={form.Potassium} readOnly={!isManual} onChange={v => setForm({ ...form, Potassium: v })} color="#f59e0b" />
                                        <NPKPanel label="M" value={form.Moisture} readOnly={!isManual} onChange={v => setForm({ ...form, Moisture: v })} color="#0ea5e9" unit="%" />
                                    </div>
                                </div>

                                {/* Subsection: Atmospheric */}
                                <div style={subSection}>
                                    <span style={subLabel}>Atmospheric Context</span>
                                    <div style={flexRow}>
                                        <ClimateMetric icon={<Thermometer size={14} />} label="Temp" value={form.Temperature_Celsius} unit="°C" readOnly={!isManual} onChange={v => setForm({ ...form, Temperature_Celsius: v })} />
                                        <ClimateMetric icon={<Droplets size={14} />} label="Humidity" value={form.Humidity} unit="%" readOnly={!isManual} onChange={v => setForm({ ...form, Humidity: v })} />
                                    </div>
                                    {/* {weather && !isManual && (
                                        <div style={extraWeather}>
                                            <MiniBadge icon={<Wind size={10} />} value={`${weather.windSpeed}m/s`} />
                                            <MiniBadge icon={<Zap size={10} />} value={`${weather.pressure}hPa`} />
                                            <MiniBadge icon={<Droplets size={10} />} value={`${weather.humidity}%`} />
                                        </div>
                                    )} */}
                                </div>
                            </div>

                            {error && <div style={errorBanner}><AlertCircle size={16} />{error}</div>}

                            <button type="submit" disabled={loading} style={optimizeBtn}>
                                {loading ? (
                                    <div style={btnContent}><div style={loaderSpin} /><span>Synthesizing Forecast...</span></div>
                                ) : (
                                    <div style={btnContent}><span>Generate Optimization Matrix</span><ChevronRight size={18} /></div>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Results Perspective */}
                    <div style={resultsPane}>
                        <AnimatePresence mode="wait">
                            {!results && !loading ? (
                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={idleState}>
                                    <div style={pulseSphere}><BarChart4 size={64} color="#22c55e" /></div>
                                    <h4 style={idleText}>Forecasting Engine Ready</h4>
                                    <p style={idleHint}>Define geospatial parameters to proceed</p>
                                </motion.div>
                            ) : loading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={scanningState}>
                                    <div style={radarPulse} />
                                    <Sprout size={48} color="#22c55e" />
                                    <p style={scanningText}>Running Computational Biology Models...</p>
                                </motion.div>
                            ) : (
                                <motion.div key="res" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={resultGlassCard}>
                                    <div style={resHeader}>
                                        <div>
                                            <span style={resTag}>BIO-GEOSPACIAL VERDICT</span>
                                            <h3 style={resMainTitle}>Productivity Forecast</h3>
                                        </div>
                                        <div style={shieldBox}><ShieldCheck size={28} color="#22c55e" /></div>
                                    </div>

                                    {/* <div style={yieldHero}>
                                        <div style={yieldCol}>
                                            <span style={yVal}>{results.yield}</span>
                                            <div style={yUnitRow}>
                                                <TrendingUp size={16} color="#22c55e" />
                                                <span style={yUnit}>TONS / HECTARE (EST)</span>
                                            </div>
                                        </div>
                                        <div style={yieldChartPlaceholder} />
                                    </div> */}

                                    <div style={strategyCard}>
                                        <div style={stratHead}>
                                            <FlaskConical size={18} color="#4ade80" />
                                            <span>Agronomy Directive</span>
                                        </div>
                                        <div style={stratBody}>
                                            <span style={stratLabel}>Precision Application:</span>
                                            <span style={stratVal}>{FERTILIZER_NAMES[results.fertilizer] || results.fertilizer}</span>
                                        </div>
                                    </div>

                                    <div style={optFooter}>
                                        <Sparkles size={14} color="#94a3b8" />
                                        <span>Derived from {form.Region} terrain dynamics and {form.Weather_Condition} climatic alignment.</span>
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
                @keyframes pulse { 0% { scale: 1; opacity: 0.4; } 100% { scale: 1.8; opacity: 0; } }
            `}</style>
            </section>
        </div>
    );
}

// Blocks
const NodeIndicator = ({ label, active }) => (
    <div style={{ ...nodeTag, background: active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
        <div style={{ ...nodeDot, background: active ? '#22c55e' : '#ef4444', boxShadow: active ? '0 0 10px #22c55e' : 'none' }} />
        <span>{label}</span>
    </div>
);

const NPKPanel = ({ label, value, readOnly, onChange, color, unit = "mg/kg" }) => (
    <div style={npkItem}>
        <div style={{ ...npkLabel, color }}>{label}</div>
        <input style={npkVal} type="number" value={Math.round(value)} readOnly={readOnly} onChange={e => onChange(e.target.value)} />
        <span style={npkUnit}>{unit}</span>
    </div>
);

const ClimateMetric = ({ icon, label, value, unit, readOnly, onChange }) => (
    <div style={cmBox}>
        <div style={cmLabel}>{icon} {label}</div>
        <div style={cmValRow}>
            <input style={cmInput} type="number" value={Math.round(value)} readOnly={readOnly} onChange={e => onChange(e.target.value)} />
            <span style={cmUnit}>{unit}</span>
        </div>
    </div>
);

const MiniBadge = ({ icon, value }) => (
    <div style={mBadge}>
        {icon}
        <span>{value}</span>
    </div>
);

// Styles
const auroraBackground = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(at 100% 0%, rgba(34,197,94,0.02) 0, transparent 50%), radial-gradient(at 0% 100%, rgba(59,130,246,0.02) 0, transparent 50%)', zIndex: -1, pointerEvents: 'none' };

const statusBanner = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', padding: '16px 24px', borderRadius: '24px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' };
const connList = { display: 'flex', gap: '20px', alignItems: 'center' };
const nodeTag = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.5px' };
const nodeDot = { width: '8px', height: '8px', borderRadius: '50%' };
const syncMeta = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8', fontWeight: 700 };
const modeControl = { display: 'flex', alignItems: 'center', gap: '16px' };
const modeText = { fontSize: '11px', fontWeight: 800, color: '#475569' };
const toggleAction = { background: '#0f172a', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '11px', fontWeight: 900, cursor: 'pointer' };

const layoutGrid = { display: 'grid', gridTemplateColumns: 'minmax(450px, 1fr) 1.2fr', gap: '40px', marginBottom: '100px' };

const glassCard = {
    background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(32px)',
    padding: '40px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.7)',
    boxShadow: '0 40px 100px rgba(0,0,0,0.04)'
};

const cardHeader = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' };
const iconCircle = { width: '48px', height: '48px', background: '#eef2ff', color: '#6366f1', borderRadius: '14px', display: 'grid', placeItems: 'center', boxShadow: '0 10px 20px rgba(100,100,250,0.05)' };
const cardTitle = { margin: 0, fontSize: '20px', fontWeight: 900 };
const cardSub = { margin: '2px 0 0', fontSize: '13px', fontWeight: 700, color: '#64748b' };

const formFlow = { display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '40px' };
const subSection = { padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' };
const subLabel = { display: 'block', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' };

const flexRow = { display: 'flex', gap: '12px' };
const half = { flex: 1 };
const fLabel = { display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px' };
const fInput = { width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #f1f5f9', outline: 'none', background: 'white', fontSize: '14px', fontWeight: 700 };

const npkGrid = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' };
const npkItem = { background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', textAlign: 'center' };
const npkLabel = { fontSize: '12px', fontWeight: 900, marginBottom: '8px' };
const npkVal = { width: '100%', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: 900, outline: 'none', background: 'transparent' };
const npkUnit = { fontSize: '10px', fontWeight: 800, color: '#94a3b8' };

const cmBox = { flex: 1, background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' };
const cmLabel = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '10px' };
const cmValRow = { display: 'flex', alignItems: 'baseline', gap: '4px' };
const cmInput = { width: '50px', border: 'none', fontSize: '24px', fontWeight: 900, outline: 'none', background: 'transparent' };
const cmUnit = { fontSize: '14px', fontWeight: 800, color: '#94a3b8' };

const extraWeather = { display: 'flex', gap: '8px', marginTop: '16px' };
const mBadge = { background: 'white', border: '1px solid #f1f5f9', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 900, color: '#475569' };

const optimizeBtn = { width: '100%', padding: '22px', borderRadius: '20px', border: 'none', background: '#0f172a', color: 'white', cursor: 'pointer', transition: '0.3s ease' };
const btnContent = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '16px', fontWeight: 900 };
const loaderSpin = { width: '18px', height: '18px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' };
const errorBanner = { marginBottom: '24px', padding: '16px', borderRadius: '14px', background: '#fff1f2', color: '#e11d48', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' };

const resultsPane = { position: 'sticky', top: '40px', alignSelf: 'start' };
const idleState = { height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '32px', border: '2px dashed rgba(226, 232, 240, 0.6)', background: 'rgba(255,255,255,0.3)' };
const pulseSphere = { width: '120px', height: '120px', background: 'white', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', position: 'relative' };
const idleText = { marginTop: '32px', fontSize: '20px', fontWeight: 900, color: '#0f172a' };
const idleHint = { fontSize: '15px', fontWeight: 700, color: '#94a3b8' };

const scanningState = { ...idleState, background: 'white', border: 'none' };
const radarPulse = { position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '4px solid rgba(34,197,94,0.1)', animation: 'pulse 1.5s infinite' };
const scanningText = { marginTop: '60px', fontSize: '16px', fontWeight: 800, color: '#22c55e' };

const resultGlassCard = { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(30px)', padding: '56px', borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 50px 120px rgba(0,0,0,0.06)' };
const resHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' };
const resTag = { background: '#f0fdf4', color: '#16a34a', padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 900, letterSpacing: '1px' };
const resMainTitle = { margin: '8px 0 0', fontSize: '32px', fontWeight: 900 };
const shieldBox = { width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '20px', display: 'grid', placeItems: 'center' };

const yieldHero = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', padding: '40px', background: '#f8fafc', borderRadius: '32px', border: '1px solid #f1f5f9' };
const yieldCol = { display: 'flex', flexDirection: 'column' };
const yVal = { fontSize: '80px', fontWeight: 950, color: '#0f172a', lineHeight: 1 };
const yUnitRow = { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' };
const yUnit = { fontSize: '12px', fontWeight: 900, color: '#64748b', letterSpacing: '1px' };
const yieldChartPlaceholder = { width: '120px', height: '80px', borderLeft: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0', position: 'relative' };

const strategyCard = { background: '#0f172a', padding: '40px', borderRadius: '32px', marginBottom: '32px' };
const stratHead = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: 900, color: '#4ade80', marginBottom: '24px', textTransform: 'uppercase' };
const stratBody = { display: 'flex', flexDirection: 'column', gap: '8px' };
const stratLabel = { fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)' };
const stratVal = { fontSize: '24px', fontWeight: 900, color: 'white' };

const optFooter = { display: 'flex', gap: '12px', fontSize: '13px', color: '#94a3b8', fontWeight: 600, lineHeight: 1.6 };
