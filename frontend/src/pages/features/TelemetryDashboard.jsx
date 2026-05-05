import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Cloud, Wind, Thermometer, Droplets, FlaskConical,
    Cpu, Zap, Sun, ShieldCheck, RefreshCw, MapPin,
    BarChart4, Gauge, Activity, Radio, ChevronRight,
    Signal, Database, Server, Sparkles, ActivitySquare
} from "lucide-react";
import Container from "../../components/layout/Container";
import { sensorService } from "../../services/sensorService";
import { weatherService } from "../../services/weatherService";
import { AuthContext } from "../../App";

export default function TelemetryDashboard() {
    const auth = React.useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);
    const [herbq, setHerbq] = useState(null);
    const [drystore, setDrystore] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        fetchAll();
        const timer = setInterval(fetchAll, 30000); // 30s update
        return () => clearInterval(timer);
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        
        // Use manual location if set, otherwise auto-detect
        const userLoc = auth.user?.location;
        const coords = (userLoc && !userLoc.isAuto) 
            ? { lat: userLoc.lat, lon: userLoc.lon }
            : await weatherService.getUserLocation();

        const [wData, hData, dData] = await Promise.all([
            coords
                ? weatherService.getWeatherByCoords(coords.lat, coords.lon)
                : weatherService.getWeatherByCity("Colombo"),
            sensorService.getHerbqData(),
            sensorService.getDryStorageData()
        ]);

        setWeather(wData);
        if (hData.ok) setHerbq(hData.data);
        if (dData.ok) setDrystore(dData.data);

        setLastUpdate(new Date());
        setLoading(false);
    };

    return (
        <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>
            
            {/* ── HEADER (DARK) ── */}
            <section style={{ position: "relative", padding: "120px 0 80px", background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "400px", background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
                
                <Container style={{ position: "relative", zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "100px", marginBottom: "24px" }}>
                            <ActivitySquare size={12} color="#22c55e" />
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px" }}>Data Stream Active</span>
                        </div>
                        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "24px", color: "white", lineHeight: 1.1 }}>
                            Telemetry <span style={{ color: "#22c55e" }}>Intelligence</span>
                        </h1>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 auto", maxWidth: "600px" }}>
                            Real-time multi-node sensory data and atmospheric analytics monitoring your agricultural ecosystem.
                        </p>
                    </motion.div>
                </Container>
            </section>

            {/* ── DASHBOARD GRID (LIGHT SECTION) ── */}
            <section style={{ padding: "60px 0 120px", background: "#f8fafc", color: "#0a0e0a", borderRadius: "40px 40px 0 0", minHeight: "600px", zIndex: 2, position: "relative" }}>
                <Container>
                    
                    {/* Advanced Mission Status */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={topBar}>
                        <div style={statusGroup}>
                            <GlobalNode label="ATMO_NODE" status={weather ? 'LIVE' : 'SYNCING'} active={!!weather} />
                            <GlobalNode label="SOIL_NODE" status={herbq ? 'LIVE' : 'OFFLINE'} active={!!herbq} />
                            <GlobalNode label="STORE_NODE" status={drystore ? 'LIVE' : 'OFFLINE'} active={!!drystore} />
                        </div>
                        <div style={timeGroup}>
                            <div style={syncBox}>
                                <RefreshCw size={14} className={loading ? "spin" : ""} color="#22c55e" />
                                <span>Scan: {lastUpdate?.toLocaleTimeString() || "Initializing..."}</span>
                            </div>
                            <div style={dataBadge}>
                                <Database size={12} color="#fff" />
                                <span>PIPELINE_OK</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="telem-grid" style={dashboardGrid}>
                        {/* Atmospheric Intelligence Card */}
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={brightCard}>
                            <div style={cardHeader}>
                                <div style={iconCircle}><Cloud size={20} color="#3b82f6" /></div>
                                <div>
                                    <h3 style={cardTitle}>Atmospheric Intel</h3>
                                    <p style={cardSub}>Climatic condition monitoring</p>
                                </div>
                            </div>

                            <div style={locationBox}>
                                <MapPin size={14} color="#22c55e" />
                                <span>{weather?.city || "Detecting coordinates..."}</span>
                            </div>

                            <div style={metricsGrid}>
                                <BigMetric icon={<Thermometer size={18} />} label="Temp" value={weather?.temp} unit="°C" color="#ef4444" />
                                <BigMetric icon={<Droplets size={18} />} label="Humid" value={weather?.humidity} unit="%" color="#3b82f6" />
                                <BigMetric icon={<Wind size={18} />} label="Wind" value={weather?.windSpeed} unit="m/s" color="#64748b" />
                                <BigMetric icon={<Zap size={18} />} label="Pressr" value={weather?.pressure} unit="hPa" color="#f59e0b" />
                            </div>

                            <div style={subMetricsRow}>
                                <MiniStat label="Clouds" value={`${weather?.clouds || 0}%`} />
                                <MiniStat label="Precip(1h)" value={`${weather?.rainfall || 0}mm`} />
                                <div style={weatherStateTag}>{weather?.condition || "SYNCING"}</div>
                            </div>
                        </motion.div>

                        {/* Soil Nutrient Profile Card */}
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={brightCard}>
                            <div style={cardHeader}>
                                <div style={{ ...iconCircle, background: 'rgba(34,197,94,0.1)' }}><FlaskConical size={20} color="#22c55e" /></div>
                                <div>
                                    <h3 style={cardTitle}>Soil Nutrient Matrix</h3>
                                    <p style={cardSub}>NPK molecular tracking</p>
                                </div>
                            </div>

                            <div style={nutrientContainer}>
                                <NutrientTrack label="Nitrogen (N)" value={herbq?.nitrogen || 0} max={100} color="#22c55e" />
                                <NutrientTrack label="Phosphorus (P)" value={herbq?.phosphorus || 0} max={100} color="#3b82f6" />
                                <NutrientTrack label="Potassium (K)" value={herbq?.potassium || 0} max={100} color="#f59e0b" />
                                <NutrientTrack label="Soil Moisture" value={herbq?.moisture || 0} max={100} color="#0ea5e9" unit="%" />
                            </div>

                            <div style={sensorInfoFoot}>
                                <div style={liveTag}><div style={liveDot} /> STREAMING_LIVE</div>
                                <span>NODE_HERBQ_01</span>
                            </div>
                        </motion.div>

                        {/* Environmental Monitoring - Storage Node */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ ...brightCard, gridColumn: 'span 2' }}>
                            <div style={{ ...cardHeader, marginBottom: '32px' }}>
                                <div style={{ ...iconCircle, background: '#0f172a' }}><Server size={20} color="white" /></div>
                                <div>
                                    <h3 style={cardTitle}>Storage Node Analytics</h3>
                                    <p style={cardSub}>Internal chamber vs Ambient monitoring</p>
                                </div>
                            </div>

                            <div className="telem-chamber" style={chamberGrid}>
                                <div style={chamberPanel}>
                                    <div style={panelHead}><div style={pDot} /> INTERIOR_CHAMBER</div>
                                    <div style={panelMetrics}>
                                        <DataPoint label="Dryness Factor" value={drystore?.interiorHumidity ? `${drystore.interiorHumidity}%` : '--'} />
                                        <DataPoint label="Thermal Load" value={drystore?.interiorTemperature ? `${drystore.interiorTemperature}°C` : '--'} />
                                    </div>
                                </div>
                                <div style={chamberPanel}>
                                    <div style={panelHead}><div style={{ ...pDot, background: '#64748b' }} /> AMBIENT_EXTERIOR</div>
                                    <div style={panelMetrics}>
                                        <DataPoint label="Ambient Humid" value={drystore?.exteriorHumidity ? `${drystore.exteriorHumidity}%` : '--'} />
                                        <DataPoint label="Ambient Temp" value={drystore?.exteriorTemperature ? `${drystore.exteriorTemperature}°C` : '--'} />
                                    </div>
                                </div>
                                <div style={lightPanel}>
                                    <span style={panelLabel}>PHOTOMETRIC_SENSE</span>
                                    <div style={{ ...lightBox, background: drystore?.isSufficientLight ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)' }}>
                                        {drystore?.isSufficientLight ? (
                                            <div style={lightStatus}><Sun size={24} color="#16a34a" /> <span style={{ color: '#16a34a' }}>OPTIMAL_LUX</span></div>
                                        ) : (
                                            <div style={lightStatus}><Zap size={24} color="#d97706" /> <span style={{ color: '#d97706' }}>LOW_INTENSITY</span></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* System Integrity Report */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={integrityPanel}>
                        <div style={intSide}>
                            <ShieldCheck size={28} color="#22c55e" />
                            <h4 style={intTitle}>SYSTEM<br/>INTEGRITY</h4>
                        </div>
                        <div style={intGrid}>
                            <IntegrityRow service="Atmospheric Neural Engine" status={weather ? 'OPERATIONAL' : 'SYNCING'} quality="99.9%" />
                            <IntegrityRow service="MQTT Soil Node 01" status={herbq ? 'STABLE' : 'LINK_LOST'} quality={herbq ? "High-Fi" : "---"} />
                            <IntegrityRow service="Environmental Storage Hub" status={drystore ? 'STABLE' : 'LINK_LOST'} quality={drystore ? "High-Fi" : "---"} />
                        </div>
                    </motion.div>
                </Container>
            </section>
            
            <style>{`
                .spin { animation: spin 2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulseLive { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
                .telem-grid { grid-template-columns: 1fr 1fr; }
                .telem-chamber { grid-template-columns: 1fr 1fr 1fr; }
                @media (max-width: 900px) {
                    .telem-grid { grid-template-columns: 1fr; }
                    .telem-chamber { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

// Blocks
const GlobalNode = ({ label, status, active }) => (
    <div style={gNode}>
        <div style={{ ...gDot, background: active ? '#22c55e' : '#ef4444' }} />
        <div style={gContent}>
            <span style={gLabel}>{label}</span>
            <span style={{ ...gStatus, color: active ? '#0f172a' : '#94a3b8' }}>{status}</span>
        </div>
    </div>
);

const BigMetric = ({ icon, label, value, unit, color }) => (
    <div style={bmBox}>
        <div style={{ ...bmIcon, color, background: `${color}15` }}>{icon}</div>
        <div style={bmData}>
            <span style={bmLabel}>{label}</span>
            <div style={bmValRow}>
                <span style={bmVal}>{value || '--'}</span>
                {value && <span style={bmUnit}>{unit}</span>}
            </div>
        </div>
    </div>
);

const MiniStat = ({ label, value }) => (
    <div style={msBox}>
        <span style={msLabel}>{label}</span>
        <span style={msVal}>{value}</span>
    </div>
);

const NutrientTrack = ({ label, value, max, color, unit = "mg/kg" }) => (
    <div style={ntBox}>
        <div style={ntHead}>
            <span style={ntLabel}>{label}</span>
            <span style={ntVal}>{value} <small style={{ color: '#94a3b8', fontSize: '12px' }}>{unit}</small></span>
        </div>
        <div style={ntTrack}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} style={{ ...ntFill, background: color }} />
        </div>
    </div>
);

const DataPoint = ({ label, value }) => (
    <div style={dpBox}>
        <span style={dpVal}>{value}</span>
        <span style={dpLabel}>{label}</span>
    </div>
);

const IntegrityRow = ({ service, status, quality }) => (
    <div style={irBox}>
        <span style={irServ}>{service}</span>
        <div style={irMeta}>
            <span style={{ ...irStat, color: status.includes('LINK') ? '#ef4444' : '#22c55e' }}>{status}</span>
            <span style={irQual}>{quality}</span>
        </div>
    </div>
);

// Styles
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px 32px', borderRadius: '24px', marginBottom: '40px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' };
const statusGroup = { display: 'flex', gap: '32px', flexWrap: 'wrap' };

const gNode = { display: 'flex', alignItems: 'center', gap: '12px' };
const gDot = { width: '8px', height: '8px', borderRadius: '50%' };
const gContent = { display: 'flex', flexDirection: 'column' };
const gLabel = { fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' };
const gStatus = { fontSize: '11px', fontWeight: 900 };

const timeGroup = { display: 'flex', alignItems: 'center', gap: '20px' };
const syncBox = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', fontWeight: 700 };
const dataBadge = { display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', color: 'white', padding: '6px 14px', borderRadius: '100px', fontSize: '10px', fontWeight: 900 };

const dashboardGrid = { display: 'grid', gap: '40px', marginBottom: '40px' };

const brightCard = {
    background: 'white', border: '1px solid #e2e8f0',
    padding: '40px', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.02)'
};

const cardHeader = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' };
const iconCircle = { width: '48px', height: '48px', background: 'rgba(59,130,246,0.1)', borderRadius: '14px', display: 'grid', placeItems: 'center' };
const cardTitle = { margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' };
const cardSub = { margin: '2px 0 0', fontSize: '13px', fontWeight: 700, color: '#64748b' };

const locationBox = { display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '12px 20px', borderRadius: '16px', marginBottom: '32px', fontSize: '13px', fontWeight: 800, color: '#334155', border: '1px solid #e2e8f0' };

const metricsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '32px' };
const bmBox = { display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' };
const bmIcon = { width: '36px', height: '36px', borderRadius: '10px', display: 'grid', placeItems: 'center' };
const bmData = { display: 'flex', flexDirection: 'column' };
const bmLabel = { fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' };
const bmValRow = { display: 'flex', alignItems: 'baseline', gap: '4px' };
const bmVal = { fontSize: '24px', fontWeight: 900, color: '#0f172a' };
const bmUnit = { fontSize: '12px', fontWeight: 800, color: '#64748b' };

const subMetricsRow = { display: 'flex', gap: '24px', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #f1f5f9' };
const msBox = { display: 'flex', flexDirection: 'column' };
const msLabel = { fontSize: '10px', fontWeight: 800, color: '#64748b', marginBottom: '4px' };
const msVal = { fontSize: '14px', fontWeight: 900, color: '#0f172a' };
const weatherStateTag = { marginLeft: 'auto', background: '#0f172a', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, letterSpacing: '1px' };

const nutrientContainer = { display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' };
const ntBox = { width: '100%' };
const ntHead = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' };
const ntLabel = { fontSize: '13px', fontWeight: 800, color: '#334155' };
const ntVal = { fontSize: '16px', fontWeight: 900, color: '#0f172a' };
const ntTrack = { height: '8px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' };
const ntFill = { height: '100%', borderRadius: '100px' };

const sensorInfoFoot = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 800, color: '#64748b', paddingTop: '24px', borderTop: '1px solid #f1f5f9' };
const liveTag = { display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e' };
const liveDot = { width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulseLive 1s infinite' };

const chamberGrid = { display: 'grid', gap: '24px' };
const chamberPanel = { padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' };
const panelHead = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', fontWeight: 900, color: '#64748b', marginBottom: '24px', letterSpacing: '1px' };
const pDot = { width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' };
const panelMetrics = { display: 'flex', flexDirection: 'column', gap: '24px' };

const dpBox = { display: 'flex', flexDirection: 'column' };
const dpVal = { fontSize: '28px', fontWeight: 900, color: '#0f172a' };
const dpLabel = { fontSize: '11px', fontWeight: 800, color: '#64748b', marginTop: '4px' };

const lightPanel = { padding: '24px', background: '#f0fdf4', borderRadius: '24px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column' };
const panelLabel = { fontSize: '10px', fontWeight: 900, color: '#166534', marginBottom: '20px', letterSpacing: '1px' };
const lightBox = { flex: 1, borderRadius: '20px', display: 'grid', placeItems: 'center', border: '1px solid rgba(22,163,74,0.2)' };
const lightStatus = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', fontWeight: 900, fontSize: '12px' };

const integrityPanel = { background: '#0a120a', padding: '40px', borderRadius: '40px', color: 'white', display: 'flex', gap: '40px', alignItems: 'center', boxSizing: 'border-box', border: '1px solid rgba(34,197,94,0.3)', flexWrap: 'wrap' };
const intSide = { display: 'flex', alignItems: 'center', gap: '16px' };
const intTitle = { margin: 0, fontSize: '14px', fontWeight: 900, letterSpacing: '2px', color: 'rgba(255,255,255,0.6)' };

const intGrid = { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' };
const irBox = { display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' };
const irServ = { fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)' };
const irMeta = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const irStat = { fontSize: '12px', fontWeight: 900 };
const irQual = { fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.3)' };
