import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan, Microscope, Award, AlertCircle, Camera, CheckCircle2,
  X, Info, BadgeCheck, Layers, Sparkles, ChevronRight,
  TrendingUp, Fingerprint, ShieldCheck, Leaf, Star, Package,
  ArrowRight, AlertTriangle, ThumbsUp, Shield, Upload
} from "lucide-react";
import Container from "../../components/layout/Container";
import { sensorService } from "../../services/sensorService";
import { AuthContext } from "../../App";
import { validateAndDeductCredits } from "../../utils/creditValidator";

const PART_ID_URL = "/api/plant-part";
const QUALITY_URL = "/api/plant/quality";

// =====================================================================
//  QUALITY-BASED RECOMMENDATION ENGINE
// =====================================================================
const GRADE_CONFIG = {
  Good: {
    color: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    label: "Premium Quality",
    emoji: "🥇",
    tier: "PREMIUM",
    description: "This specimen meets the highest quality standards for medicinal use. The active compound concentration, structural integrity, and overall composition are within optimal parameters for Ayurvedic preparations.",
    recommendations: [
      "Suitable for direct use in primary Ayurvedic formulations and decoctions",
      "Can be processed into high-value medicinal products (kashaya, arishta, choorna)",
      "Recommended for premium product lines and export-grade preparations",
      "Store in airtight containers at 18–25°C and below 60% humidity for maximum shelf life",
    ],
    storageGuide: "Dry in shade at 35–45°C for 3–5 days. Store in food-grade sealed containers away from direct sunlight. Expected shelf life: 12–18 months when properly dried and stored.",
    processingNotes: "Minimal processing needed. Suitable for whole-part use, powder grinding, or oil extraction. Active compound potency estimated at 85–100% of reference standard.",
  },
  Middle: {
    color: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    label: "Standard Quality",
    emoji: "🥈",
    tier: "STANDARD",
    description: "This specimen falls within acceptable quality ranges for medicinal application but shows some deviations from the ideal profile. Minor variations in texture, compound concentration, or visual appearance have been detected.",
    recommendations: [
      "Suitable for standard Ayurvedic formulations and general-purpose preparations",
      "May require additional processing or blending with premium-grade material for optimal efficacy",
      "Acceptable for internal use with proper processing (boiling, decoction preparation)",
      "Consider mixing with higher-grade material in a 1:2 ratio for improved potency",
    ],
    storageGuide: "Dry thoroughly at 40–50°C for 5–7 days to reduce moisture below 10%. Store in sealed containers with desiccant packets. Expected shelf life: 6–12 months.",
    processingNotes: "Additional cleaning and sorting recommended before use. Consider fine-grinding to increase bioavailability. Active compound potency estimated at 60–85% of reference standard.",
    improvementTips: [
      "Harvest earlier in the season when active compound concentration peaks",
      "Improve soil nutrition with organic compost to enhance plant compound synthesis",
      "Ensure proper irrigation during the growing period to reduce stress-related quality drops",
      "Consider using shade-drying methods instead of direct sun exposure to preserve volatile compounds",
    ],
  },
  Bad: {
    color: "#dc2626",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    label: "Below Standard",
    emoji: "⚠️",
    tier: "SUBSTANDARD",
    description: "This specimen does not meet the minimum quality threshold for primary medicinal use. Significant degradation in structure, compound concentration, or contamination indicators have been detected by the AI model.",
    recommendations: [
      "NOT recommended for direct medicinal use — compounds may be insufficient for therapeutic effect",
      "May be repurposed for low-concentration secondary products (aromatic sachets, non-therapeutic items)",
      "Consider extracting usable compounds through advanced processing (solvent extraction, distillation)",
      "Investigate the cause of quality degradation — likely environmental stress, disease, or harvesting issues",
    ],
    storageGuide: "If retaining, dry immediately at higher temperature (50–60°C) and store separately from good-grade stock. Label clearly as sub-grade. Do not mix with premium batches.",
    processingNotes: "Extensive processing required if any medicinal use is planned. Concentrated extraction methods may recover some active compounds. Potency estimated below 60% of reference standard.",
    rootCauses: [
      "Harvested past optimal maturity — active compounds may have degraded",
      "Possible exposure to excessive heat, sunlight, or improper drying conditions",
      "Plant stress from drought, nutrient deficiency, or pest/disease damage",
      "Contamination from soil, handling, or storage conditions needs investigation",
    ],
  },
};

const PLANT_PART_INFO = {
  Aralu: { name: "Aralu (Terminalia chebula)", sinhala: "අරළු", family: "Combretaceae", uses: "Digestive health, constipation, liver support, eye health" },
  Edaru: { name: "Edaru", sinhala: "එදරු", family: "Various", uses: "Traditional herbal formulations" },
  Iramusu: { name: "Iramusu (Hemidesmus indicus)", sinhala: "ඉරමුසු", family: "Apocynaceae", uses: "Blood purification, skin disorders, cooling agent" },
  "Lunuvarana Pothu": { name: "Lunuvarana Pothu", sinhala: "ලුණුවරණ පොතු", family: "Various", uses: "Traditional Ayurvedic preparations" },
  Nika: { name: "Nika (Vitex negundo)", sinhala: "නික", family: "Lamiaceae", uses: "Anti-inflammatory, pain relief, respiratory issues" },
  "Sudu Handun": { name: "Sudu Handun (Santalum album)", sinhala: "සුදු හඳුන්", family: "Santalaceae", uses: "Skin care, urinary infections, cooling, aromatherapy" },
  Thippili: { name: "Thippili (Piper longum)", sinhala: "තිප්පිලි", family: "Piperaceae", uses: "Respiratory health, digestive aid, immune booster" },
  Valmee: { name: "Valmee (Glycyrrhiza glabra)", sinhala: "වල්මී", family: "Fabaceae", uses: "Cough relief, gastric support, anti-inflammatory" },
  Venivelgeta: { name: "Venivelgeta (Coscinium fenestratum)", sinhala: "වැනිවැල්ගැට", family: "Menispermaceae", uses: "Diabetes management, antimicrobial, wound healing" },
};

// =====================================================================
//  QUALITY SCALE HELPER
//  NOTE: confidence = model certainty, not quality score.
//  This maps each grade to its correct scale area so Bad with 90%
//  confidence still appears inside the Bad range.
// =====================================================================
const getQualityDisplayScore = (grade, confidence = 0) => {
  const conf = Math.max(0, Math.min(1, Number(confidence) || 0));

  if (grade === "Bad") {
    return Math.round(10 + conf * 25); // 10–35
  }

  if (grade === "Middle") {
    return Math.round(45 + conf * 20); // 45–65
  }

  if (grade === "Good") {
    return Math.round(75 + conf * 20); // 75–95
  }

  return 50;
};

const getQualityText = (grade, confidence = 0) => {
  return `${grade} • ${(Number(confidence || 0) * 100).toFixed(1)}% model confidence`;
};


export default function PartsQuality() {
  const auth = React.useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    checkConnectivity();
    const timer = setInterval(checkConnectivity, 10000);
    return () => clearInterval(timer);
  }, []);

  async function checkConnectivity() {
    const ok = await sensorService.checkBackend();
    setBackendStatus(ok ? "connected" : "disconnected");
  }

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError("");
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    // ── CREDIT VALIDATION ──
    const canProceed = await validateAndDeductCredits(auth, "Product Identification & Grading Grading");
    if (!canProceed) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const fd1 = new FormData();
      fd1.append("file", file);

      const fd2 = new FormData();
      fd2.append("file", file);

      const [resPart, resQual] = await Promise.all([
        fetch(PART_ID_URL, { method: "POST", body: fd1 }),
        fetch(QUALITY_URL, { method: "POST", body: fd2 })
      ]);

      if (!resPart.ok || !resQual.ok) throw new Error("Quality analysis engine offline.");

      const partData = await resPart.json();
      const qualData = await resQual.json();

      // Correctly parse the API response
      // Backend returns: { plant, grade, combined_class, confidence, all_probabilities }
      const plantName = qualData.plant || "Unknown";
      const grade = qualData.grade || "Middle";
      const combinedClass = qualData.combined_class || `${plantName}_${grade}`;
      const confidence = Number(qualData.confidence ?? 0);
      const allProbs = qualData.all_probabilities || {};

      const gradeConfig = GRADE_CONFIG[grade] || GRADE_CONFIG.Middle;
      const partInfo = PLANT_PART_INFO[partData.plant_part] || { name: partData.plant_part || "Unknown", sinhala: "", uses: "Under investigation" };

      setResult({
        part: partData.plant_part || "Unknown",
        partConfidence: Math.min(99, Math.round(Number(partData.confidence ?? 0) * 100)),
        plant: plantName,
        grade: grade,
        combinedClass: combinedClass,
        score: getQualityDisplayScore(grade, confidence),
        modelConfidence: Math.round(confidence * 100),
        qualityText: getQualityText(grade, confidence),
        allProbabilities: allProbs,
        gradeConfig: gradeConfig,
        partInfo: partInfo,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
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
              <Microscope size={12} color="#22c55e" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px" }}>Dual AI Analysis</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "24px", color: "white", lineHeight: 1.1 }}>
             Product Identification & <span style={{ color: "#22c55e" }}>Grading</span>
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0 auto", maxWidth: "600px" }}>
              High-precision medicinal grading and anatomical part identification powered by EfficientNet-B1.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── ANALYSIS APPARATUS (WHITE SECTION) ── */}
      <section style={{ padding: "80px 0 120px", background: "#f8fafc", color: "#0a0e0a", borderRadius: "40px 40px 0 0", minHeight: "600px", zIndex: 2, position: "relative" }}>
        <Container>
        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pq-status-bar"
          style={statusBarStyle}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ ...connTag, background: backendStatus === 'connected' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
              <div style={{ ...dotPulse, background: backendStatus === 'connected' ? '#22c55e' : '#ef4444' }} />
              <span style={{ color: backendStatus === 'connected' ? '#166534' : '#991b1b', fontSize: '11px', fontWeight: 900 }}>
                QUALITY_ENGINE_{backendStatus.toUpperCase()}
              </span>
            </div>
          </div>
          <div style={modeBadge}>
            <Sparkles size={12} />
            <span>DUAL_MODEL_ANALYSIS</span>
          </div>
        </motion.div>

        <div className="pq-layout-grid" style={layoutGrid}>
          {/* Analysis Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="pq-glass-card"
            style={glassCard}
          >
            <div style={cardHeader}>
              <div style={iconBox}><Layers size={20} /></div>
              <div>
                <h3 style={cardTitle}>Specimen Intake</h3>
                <p style={cardSub}>Plant Part ID + Quality Grading</p>
              </div>
            </div>

            <div style={uploadArea}>
              {!file ? (
                <div style={dropContent}>
                  <div style={cameraCircleStyle}><Camera size={32} /></div>
                  <h4 style={dropTitle}>Upload Plant Part Image</h4>
                  <p style={dropDesc}>Supports dried herbs, bark, roots, leaves & powders</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', zIndex: 10 }}>
                    <label htmlFor="pq-file-upload" style={{
                       display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px',
                       background: '#f1f5f9', color: '#334155', borderRadius: '12px',
                       fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: '0.2s'
                    }}>
                      <Upload size={16} /> Gallery
                    </label>
                    <label htmlFor="pq-camera-upload" style={{
                       display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px',
                       background: '#22c55e', color: '#ffffff', borderRadius: '12px',
                       fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                    }}>
                      <Camera size={16} /> Camera
                    </label>
                  </div>
                  <input id="pq-file-upload" type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
                  <input id="pq-camera-upload" type="file" accept="image/*" capture="environment" onChange={onFileChange} style={{ display: 'none' }} />
                </div>
              ) : (
                <div style={previewWrapper}>
                  <div style={imageContainer}>
                    <img src={previewUrl} alt="Preview" style={previewImg} />
                    <div style={scanlineStyle} />
                  </div>
                  <button onClick={() => { setFile(null); setResult(null); }} style={removeBtn}><X size={14} /></button>
                </div>
              )}
            </div>

            {error && <div style={errorBox}><AlertCircle size={16} />{error}</div>}

            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing || backendStatus !== 'connected'}
              style={{
                ...actionBtn,
                opacity: (!file || isAnalyzing || backendStatus !== 'connected') ? 0.6 : 1,
                background: isAnalyzing ? '#0f172a' : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)'
              }}
            >
              {isAnalyzing ? (
                <div style={btnContentStyle}>
                  <div style={spinStyle} />
                  <span>Analyzing Quality...</span>
                </div>
              ) : (
                <div style={btnContentStyle}>
                  <span>Execute Quality Analysis</span>
                  <ChevronRight size={18} />
                </div>
              )}
            </button>

            {/* Model Info */}
            <div style={modelInfoBox}>
              <div style={modelInfoHeader}>
                <Info size={14} />
                <span>Two AI Models Run Simultaneously</span>
              </div>
              <div style={modelInfoGrid}>
                <div style={modelInfoItem}><Package size={12} color="#6366f1" /><span>Plant Part Identification (10 classes)</span></div>
                <div style={modelInfoItem}><Award size={12} color="#f59e0b" /><span>Quality Grading (4 plants × 3 grades = 12 classes)</span></div>
              </div>
            </div>
          </motion.div>

          {/* Result Output */}
          <div style={resultsPane}>
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={emptyPanel}
                >
                  <Fingerprint size={64} color="#e2e8f0" />
                  <p style={{ color: '#94a3b8', fontWeight: 700, marginTop: '20px' }}>Quality Analysis Engine Idle</p>
                  <div style={idleTagsRow}>
                    <span style={idleTag}>🌿 Part ID</span>
                    <span style={idleTag}>⭐ Quality Grading</span>
                    <span style={idleTag}>📋 Recommendations</span>
                  </div>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={scanningPanel}
                >
                  <div style={loaderContainer}>
                    <div style={pulseRing} />
                    <Microscope size={48} color="#22c55e" />
                  </div>
                  <h3 style={scanningTitleStyle}>Analyzing Batch Quality</h3>
                  <div style={loaderTrack}>
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      style={loaderFill}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="res"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  {/* Main Result Card */}
                  <div className="pq-res-card" style={resultGlassCard}>
                    <div className="pq-res-head" style={resultHead}>
                      <div style={badgeBoxStyle}>
                        <BadgeCheck size={32} color="#22c55e" />
                      </div>
                      <div>
                        <span style={reportTag}>AUTHENTICATED QUALITY REPORT</span>
                        <h3 style={resTitleStyle}>Medicinal Quality Verdict</h3>
                      </div>
                    </div>

                    {/* Grade Hero Section */}
                      {result.part !== "Other" ? (<>
                      <div className="pq-grade-hero" style={{
                      ...gradeHero,
                      background: result.gradeConfig.bgColor,
                      borderColor: result.gradeConfig.borderColor,
                    }}>
                      <div className="pq-grade-hero-row" style={gradeHeroRow}>
                        <span style={gradeEmoji}>{result.gradeConfig.emoji}</span>
                        <div>
                          <div style={{ ...gradeTierBadge, color: result.gradeConfig.color, background: `${result.gradeConfig.color}15` }}>
                            {result.gradeConfig.tier}
                          </div>
                          <div style={{ ...gradeNameText, color: result.gradeConfig.color }}>
                            Grade: {result.grade} — {result.gradeConfig.label}
                          </div>
                        </div>
                      </div>
                      <div style={gradeScoreBox}>
                        <span style={{ ...gradeScoreNum, color: result.gradeConfig.color }}>{result.partConfidence}%</span>
                        <span style={gradeScoreLabel}>Confidence</span>
                      </div>
                      </div>
                      </>):(<>
                      <div
                        className="pq-grade-hero"
                        style={{
                          ...gradeHero,
                          background: "#fef2f2",      // light red bg
                          borderColor: "#dc2626",     // strong red border
                        }}
                      >
                        <div className="pq-grade-hero-row" style={gradeHeroRow}>
                          <span style={{ ...gradeEmoji }}>🚫</span>

                          <div>
                            <div
                              style={{
                                ...gradeNameText,
                                color: "#dc2626", // red text
                              }}
                            >
                              Other - Not Plant Part
                            </div>
                          </div>
                        </div>

                        <div style={gradeScoreBox}>
                          <span
                            style={{
                              ...gradeScoreNum,
                              color: "#dc2626", // red number
                            }}
                          >
                            {result.partConfidence}%
                          </span>
                          <span
                            style={{
                              ...gradeScoreLabel,
                              color: "#b91c1c", // slightly darker red for label
                            }}
                          >
                            Confidence
                          </span>
                        </div>
                      </div>
                      </>)}
           

                    {/* Plant Part Info */}
                    {result.partInfo && (
                      <div style={partInfoCard}>
                        <div style={partInfoRow}>
                          <Leaf size={18} color="#16a34a" />
                          <div>
                            <div style={partInfoNameText}>{result.partInfo.name}</div>
                            {result.partInfo.sinhala && <div style={partInfoSinhala}>{result.partInfo.sinhala}</div>}
                          </div>
                        </div>
                        <div style={partInfoUses}>
                          <span style={partUsesLabel}>Medicinal Uses:</span> {result.partInfo.uses}
                        </div>
                      </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="pq-details-grid" style={detailsGrid}>
                      {result.part !== "Other" ? (
                        <>
                          <DetailBox
                            label="Identified Part"
                            value={result.part}
                            icon={<Layers size={14} />}
                            confidence={result.partConfidence}
                          />

                          <DetailBox
                            label="Plant Species"
                            value={result.plant}
                            icon={<Leaf size={14} />}
                          />

                          <DetailBox
                            label="Quality Grade"
                            value={`${result.grade} (${result.gradeConfig.label})`}
                            icon={<Award size={14} />}
                            valueColor={result.gradeConfig.color}
                          />

                          <DetailBox
                            label="Combined Class"
                            value={result.combinedClass}
                            icon={<Star size={14} />}
                          />
                        </>
                      ) : (
                        <>
                        </>
                      )}
                    </div>

                    {/* Quality Gradient */}
                    <div style={gradientContainer}>

                      {result.part !== "Other" ? (<>
                      <div style={gradMetaStyle}>
                        <span style={gradLabelStyle}>Quality Scale</span>
                        <span style={{ ...gradValStyle, color: result.gradeConfig.color }}>{result.qualityText}</span>
                      </div>
                      <div style={visualGradientStyle}>
                        <QualityPointer
                          score={result.score}
                          label={`${result.grade} ${result.modelConfidence}%`}
                          color={result.gradeConfig.color}
                        />
                        <div style={gradBarStyle} />
                        <div style={gradTicksStyle}>
                          <span>BAD (0–40)</span>
                          <span>MIDDLE (40–70)</span>
                          <span>GOOD (70–100)</span>
                        </div>
                      </div>
                      </>):(<></>)}
                      
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={qualityFooter}>
                    <Sparkles size={14} color="#94a3b8" />
                    <span>Grading correlated with regional Ayurvedic pharmacopoeia standards (Sri Lankan traditional medicine classification).</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        @keyframes pulse { 0% { scale: 1; opacity: 0.6; } 100% { scale: 1.8; opacity: 0; } }
        .pq-layout-grid {
          display: grid;
          grid-template-columns: minmax(400px, 1fr) 1.4fr;
        }
        .pq-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pq-glass-card {
          padding: 40px;
          position: sticky;
          top: 100px;
        }
        .pq-res-card, .pq-rec-card {
          padding: 40px;
        }
        .pq-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 900px) {
          .pq-layout-grid {
            grid-template-columns: 1fr;
          }
          .pq-glass-card {
            position: relative;
            top: 0;
            padding: 24px;
          }
        }
        @media (max-width: 500px) {
          .pq-layout-grid {
            display: flex;
            flex-direction: column;
          }
          .pq-glass-card {
            padding: 20px;
          }
          .pq-res-card, .pq-rec-card {
            padding: 20px;
          }
          .pq-res-head, .pq-rec-head {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .pq-grade-hero {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start !important;
            padding: 20px !important;
          }
          .pq-status-bar {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .pq-grade-hero-row {
            flex-direction: column;
            align-items: flex-start !important;
          }
          .pq-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      </section>
    </div>
  );
}

// Blocks
const QualityPointer = ({ score, label, color }) => {
  const safeScore = Math.max(4, Math.min(96, Number(score) || 0));

  return (
    <motion.div
      initial={{ left: "50%" }}
      animate={{ left: `${safeScore}%` }}
      style={pointerWrap}
    >
      <div style={{ ...pointerLabelStyle, background: color || '#0f172a' }}>{label}</div>
      <div style={{ ...pointerArrow, borderTopColor: color || '#0f172a' }} />
    </motion.div>
  );
};

const DetailBox = ({ label, value, icon, confidence, valueColor }) => (
  <div style={dBox}>
    <div style={dHead}>{icon} <span>{label}</span></div>
    <div style={{ ...dVal, color: valueColor || '#0f172a' }}>{value}</div>
    {confidence !== undefined && (
      <div style={dConf}>
        <div style={dConfTrack}>
          <div style={{ ...dConfFill, width: `${confidence}%` }} />
        </div>
        <span style={dConfText}>{confidence}%</span>
      </div>
    )}
  </div>
);

// =====================================================================
//  STYLES
// =====================================================================
const statusBarStyle = {
  marginBottom: '40px', padding: '16px 32px',
  background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
};
const connTag = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px' };
const dotPulse = { width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 10px currentColor' };
const modeBadge = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#0f172a', color: 'white', borderRadius: '100px', fontSize: '10px', fontWeight: 900 };

const layoutGrid = { gap: '40px', marginBottom: '80px' };

const glassCard = {
  background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(32px)',
  borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.7)',
  boxShadow: '0 40px 100px rgba(0,0,0,0.04)', alignSelf: 'start'
};

const cardHeader = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' };
const iconBox = { width: '48px', height: '48px', background: '#eef2ff', color: '#6366f1', borderRadius: '14px', display: 'grid', placeItems: 'center' };
const cardTitle = { margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' };
const cardSub = { margin: '2px 0 0', fontSize: '12px', fontWeight: 700, color: '#64748b' };

const uploadArea = {
  position: 'relative', borderRadius: '24px', border: '2px dashed #e2e8f0',
  background: '#f8fafc', overflow: 'hidden', padding: '12px', minHeight: '300px'
};
const dropContent = {
  height: '300px', display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center'
};
const cameraCircleStyle = { width: '64px', height: '64px', background: 'white', color: '#22c55e', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '20px' };
const dropTitle = { margin: '0 0 4px', fontSize: '18px', fontWeight: 900, color: '#1e293b' };
const dropDesc = { margin: 0, fontSize: '13px', fontWeight: 700, color: '#94a3b8' };
const hiddenInput = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' };

const previewWrapper = { position: 'relative', width: '100%', height: '100%' };
const imageContainer = { position: 'relative', borderRadius: '18px', overflow: 'hidden', height: '300px' };
const previewImg = { width: '100%', height: '100%', objectFit: 'cover' };
const scanlineStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'rgba(34,197,94,0.4)', boxShadow: '0 0 15px #22c55e', animation: 'scan 3s ease-in-out infinite' };
const removeBtn = { position: 'absolute', top: '16px', right: '16px', background: 'white', color: '#ef4444', width: '32px', height: '32px', borderRadius: '50%', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'grid', placeItems: 'center' };

const errorBox = { margin: '24px 0', padding: '16px', borderRadius: '14px', background: '#fff1f2', color: '#e11d48', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' };

const actionBtn = {
  width: '100%', padding: '20px', borderRadius: '18px', border: 'none',
  color: 'white', cursor: 'pointer', transition: '0.3s ease', marginTop: '32px'
};
const btnContentStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '16px', fontWeight: 900 };
const spinStyle = { width: '18px', height: '18px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1.5s linear infinite' };

const modelInfoBox = { marginTop: '32px', padding: '20px', background: '#eef2ff', borderRadius: '18px', border: '1px solid #c7d2fe' };
const modelInfoHeader = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: '#4338ca', marginBottom: '16px' };
const modelInfoGrid = { display: 'flex', flexDirection: 'column', gap: '10px' };
const modelInfoItem = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#475569' };

const resultsPane = { position: 'relative' };
const emptyPanel = {
  height: '100%', minHeight: '600px', borderRadius: '32px', border: '2px dashed rgba(226, 232, 240, 0.5)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)'
};
const idleTagsRow = { display: 'flex', gap: '12px', marginTop: '16px' };
const idleTag = { padding: '8px 14px', background: 'white', borderRadius: '100px', fontSize: '13px', fontWeight: 700, color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };

const scanningPanel = { ...emptyPanel, border: 'none', background: 'white' };
const loaderContainer = { position: 'relative', width: '100px', height: '100px', display: 'grid', placeItems: 'center', marginBottom: '32px' };
const pulseRing = { position: 'absolute', inset: 0, border: '4px solid rgba(34,197,94,0.1)', borderRadius: '50%', animation: 'pulse 1.5s infinite' };
const scanningTitleStyle = { fontSize: '20px', fontWeight: 900, color: '#0f172a', marginBottom: '24px' };
const loaderTrack = { width: '200px', height: '4px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' };
const loaderFill = { width: '100px', height: '100%', background: '#22c55e' };

const resultGlassCard = {
  background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(40px)',
  borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 50px 120px rgba(0,0,0,0.06)'
};

const resultHead = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' };
const badgeBoxStyle = { width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '16px', display: 'grid', placeItems: 'center', flexShrink: 0 };
const reportTag = { fontSize: '10px', fontWeight: 900, color: '#16a34a', letterSpacing: '1px', background: '#dcfce7', padding: '4px 10px', borderRadius: '6px' };
const resTitleStyle = { margin: '8px 0 0', fontSize: '24px', fontWeight: 900, color: '#0f172a' };

const gradeHero = { padding: '28px', borderRadius: '24px', border: '2px solid', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const gradeHeroRow = { display: 'flex', alignItems: 'center', gap: '16px' };
const gradeEmoji = { fontSize: '48px' };
const gradeTierBadge = { display: 'inline-block', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 900, letterSpacing: '1px', marginBottom: '6px' };
const gradeNameText = { fontSize: '18px', fontWeight: 900 };
const gradeScoreBox = { textAlign: 'center' };
const gradeScoreNum = { display: 'block', fontSize: '36px', fontWeight: 900 };
const gradeScoreLabel = { fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' };

const partInfoCard = { background: '#f8fafc', padding: '20px 24px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' };
const partInfoRow = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' };
const partInfoNameText = { fontSize: '16px', fontWeight: 900, color: '#0f172a' };
const partInfoSinhala = { fontSize: '14px', color: '#64748b', fontWeight: 600 };
const partInfoUses = { fontSize: '13px', color: '#475569', lineHeight: 1.6 };
const partUsesLabel = { fontWeight: 800, color: '#1e293b' };

const gradientContainer = { marginBottom: '32px' };
const gradMetaStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' };
const gradLabelStyle = { fontSize: '13px', fontWeight: 900, color: '#64748b' };
const gradValStyle = { fontSize: '14px', fontWeight: 900 };

const visualGradientStyle = { position: 'relative', paddingBottom: '32px' };
const gradBarStyle = { height: '16px', background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 40%, #22c55e 70%, #06b6d4 100%)', borderRadius: '10px' };
const gradTicksStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px 10px 0', fontSize: '10px', fontWeight: 900, color: '#94a3b8' };

const pointerWrap = { position: 'absolute', top: '-30px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)', transition: '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' };
const pointerLabelStyle = { color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap' };
const pointerArrow = { width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #0f172a' };

const detailsGrid = { gap: '16px', marginBottom: '32px' };
const dBox = { padding: '20px', background: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' };
const dHead = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' };
const dVal = { fontSize: '16px', fontWeight: 900, textTransform: 'capitalize' };
const dConf = { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' };
const dConfTrack = { flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' };
const dConfFill = { height: '100%', background: '#22c55e', borderRadius: '10px', transition: 'width 0.5s ease' };
const dConfText = { fontSize: '11px', fontWeight: 900, color: '#64748b' };

const allProbSection = { background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9' };
const allProbHeader = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 900, color: '#475569', textTransform: 'uppercase', marginBottom: '16px' };
const allProbGrid = { display: 'flex', flexDirection: 'column', gap: '8px' };
const allProbRow = { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px' };
const allProbLabel = { display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', fontSize: '12px' };
const topBadge = { background: '#22c55e', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 900 };
const allProbTrack = { flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' };
const allProbFill = { height: '100%', borderRadius: '10px' };
const allProbPct = { fontSize: '12px', fontWeight: 900, minWidth: '35px', textAlign: 'right' };

// Recommendation Card Styles
const recCard = { background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.04)' };
const recHeaderRow = { display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' };
const recTitleText = { margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' };
const recSubText = { margin: '8px 0 0', fontSize: '14px', color: '#64748b', lineHeight: 1.6 };

const recSection = { marginBottom: '28px' };
const recSectionTitle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 900, color: '#0f172a', marginBottom: '16px' };
const recList = { display: 'flex', flexDirection: 'column', gap: '10px' };
const recItem = { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' };
const recItemText = { fontSize: '13px', color: '#475569', lineHeight: 1.5, fontWeight: 600 };

const storageSection = { marginBottom: '28px', padding: '20px', background: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe' };
const storageText = { margin: '0', fontSize: '14px', color: '#1e40af', lineHeight: 1.6, fontWeight: 600 };

const procSection = { marginBottom: '28px', padding: '20px', background: '#faf5ff', borderRadius: '16px', border: '1px solid #e9d5ff' };
const procText = { margin: '0', fontSize: '14px', color: '#6b21a8', lineHeight: 1.6, fontWeight: 600 };

const tipsSection = { marginBottom: '20px' };
const tipsList = { display: 'flex', flexDirection: 'column', gap: '10px' };
const tipsItem = { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' };
const tipsText = { fontSize: '13px', color: '#92400e', lineHeight: 1.5, fontWeight: 600 };

const causeSection = { marginBottom: '20px' };
const causeList = { display: 'flex', flexDirection: 'column', gap: '10px' };
const causeItem = { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' };
const causeText = { fontSize: '13px', color: '#991b1b', lineHeight: 1.5, fontWeight: 600 };

const qualityFooter = { display: 'flex', gap: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 700, lineHeight: 1.5, padding: '16px 24px', background: 'rgba(255,255,255,0.6)', borderRadius: '16px' };
