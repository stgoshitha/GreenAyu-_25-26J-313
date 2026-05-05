import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  Navigation,
  Save,
  ShieldCheck,
  Globe,
  Settings as SettingsIcon,
  LocateFixed,
} from "lucide-react";

import Container from "../components/layout/Container";
import { AuthContext } from "../App";
import Swal from "sweetalert2";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const SRI_LANKA_CENTER = [7.8731, 80.7718];
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

export default function Settings() {
  const auth = React.useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const [selected, setSelected] = useState({
    lat: auth.user?.location?.lat || 6.9271,
    lon: auth.user?.location?.lon || 79.8612,
    city: auth.user?.location?.city || "Colombo",
  });

  const onSearch = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `${GEO_API}?name=${search}&count=5&language=en&format=json`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        title: "Location Not Supported",
        text: "Your browser does not support live location.",
        icon: "error",
        confirmButtonColor: "#22c55e",
      });
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setSelected({
          lat: latitude,
          lon: longitude,
          city: "My Location",
        });

        setGpsLoading(false);

        Swal.fire({
          title: "Live Location Detected",
          text: "Your current GPS location has been selected.",
          icon: "success",
          confirmButtonColor: "#22c55e",
        });
      },
      (error) => {
        console.error(error);
        setGpsLoading(false);

        Swal.fire({
          title: "Location Access Failed",
          text: "Please allow location permission from your browser.",
          icon: "warning",
          confirmButtonColor: "#22c55e",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSave = async () => {
    setLoading(true);

    const success = await auth.updateLocation({
      lat: selected.lat,
      lon: selected.lon,
      city: selected.city,
      isAuto: selected.city === "My Live Location",
    });

    setLoading(false);

    if (success) {
      Swal.fire({
        title: "Intelligence Re-centered",
        text: `Application weather data is now synced to ${selected.city}.`,
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setSelected({
          lat: e.latlng.lat,
          lon: e.latlng.lng,
          city: `Custom Point (${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)})`,
        });
      },
    });

    return selected ? <Marker position={[selected.lat, selected.lon]} /> : null;
  };

  const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  return (
    <div style={{ background: "#060a06", color: "white", minHeight: "100vh" }}>
      <section
        style={{
          position: "relative",
          padding: "120px 0 80px",
          background: "linear-gradient(180deg, #0a1a0a 0%, #060a06 100%)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <Container style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "100px",
                marginBottom: "24px",
              }}
            >
              <SettingsIcon size={12} color="#22c55e" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#22c55e",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Global Parameters
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 900,
                letterSpacing: "-2px",
                marginBottom: "24px",
                color: "white",
                lineHeight: 1.1,
              }}
            >
              System <span style={{ color: "#22c55e" }}>Configuration</span>
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.4)",
                margin: "0 auto",
                maxWidth: "600px",
              }}
            >
              Define your geospatial parameters and operational defaults.
            </p>
          </motion.div>
        </Container>
      </section>

      <section
        style={{
          padding: "80px 0 120px",
          background: "#f8fafc",
          color: "#0a0e0a",
          borderRadius: "40px 40px 0 0",
          minHeight: "600px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <Container>
          <div style={settingsGrid}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={glassPanel}
            >
              <div style={panelHead}>
                <div style={iconBox}>
                  <Navigation size={20} />
                </div>
                <div>
                  <h3 style={pTitle}>Geospatial Intelligence</h3>
                  <p style={pSub}>Select your primary cultivation zone</p>
                </div>
              </div>

              <div style={searchBox}>
                <form onSubmit={onSearch} style={searchForm}>
                  <input
                    style={sInput}
                    placeholder="Search for a city in Sri Lanka..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" style={sBtn}>
                    <Search size={18} />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={getLiveLocation}
                  disabled={gpsLoading}
                  style={liveLocationBtn}
                >
                  <LocateFixed size={18} />
                  {gpsLoading ? "Detecting Location..." : "Use My Live Location"}
                </button>

                {results.length > 0 && (
                  <div style={resList}>
                    {results.map((res, i) => (
                      <div
                        key={i}
                        style={resItem}
                        onClick={() => {
                          setSelected({
                            lat: res.latitude,
                            lon: res.longitude,
                            city: res.name,
                          });
                          setResults([]);
                          setSearch("");
                        }}
                      >
                        <MapPin size={14} color="#22c55e" />
                        <span>
                          {res.name}, {res.admin1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={detailsArea}>
                <div style={detailRow}>
                  <span style={dLabel}>Active Zone</span>
                  <span style={dVal}>{selected.city}</span>
                </div>

                <div style={detailRow}>
                  <span style={dLabel}>Coordinates</span>
                  <span style={dVal}>
                    {selected.lat.toFixed(4)}, {selected.lon.toFixed(4)}
                  </span>
                </div>
              </div>

              <div style={statusBanner}>
                <ShieldCheck size={16} color="#22c55e" />
                <span>
                  This location will override browser GPS across all AI features.
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                style={saveBtn}
              >
                {loading ? (
                  "Updating Master Record..."
                ) : (
                  <>
                    <Save size={18} /> Sync System Data
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={mapContainer}
            >
              <div style={mapHeader}>
                <Globe size={16} />
                <span>Sri Lanka Geopolygon Map</span>
              </div>

              <div style={mapWrapper}>
                <MapContainer
                  center={SRI_LANKA_CENTER}
                  zoom={7}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "24px",
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <LocationMarker />
                  <ChangeView center={[selected.lat, selected.lon]} />
                </MapContainer>
              </div>

              <div style={mapHint}>
                * Click anywhere on the map to pinpoint precise coordinates
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

const settingsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1.5fr",
  gap: "32px",
  margin: "40px 0 100px",
};

const glassPanel = {
  background: "white",
  padding: "48px",
  borderRadius: "32px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.03)",
  border: "1px solid #f1f5f9",
};

const panelHead = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "40px",
};

const iconBox = {
  width: "56px",
  height: "56px",
  background: "#f0fdf4",
  color: "#16a34a",
  borderRadius: "16px",
  display: "grid",
  placeItems: "center",
};

const pTitle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: 900,
  color: "#0f172a",
};

const pSub = {
  margin: "4px 0 0",
  fontSize: "14px",
  fontWeight: 600,
  color: "#64748b",
};

const searchBox = {
  position: "relative",
  marginBottom: "32px",
};

const searchForm = {
  display: "flex",
  gap: "8px",
  background: "#f8fafc",
  padding: "8px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};

const sInput = {
  flex: 1,
  border: "none",
  background: "transparent",
  padding: "8px 12px",
  fontSize: "15px",
  fontWeight: 600,
  outline: "none",
};

const sBtn = {
  background: "#0f172a",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
};

const liveLocationBtn = {
  width: "100%",
  marginTop: "12px",
  background: "#0ea5e9",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
};

const resList = {
  position: "absolute",
  top: "100%",
  left: 0,
  width: "100%",
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  marginTop: "8px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  zIndex: 1000,
  overflow: "hidden",
};

const resItem = {
  padding: "12px 20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  transition: "0.2s",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "14px",
  fontWeight: 600,
};

const detailsArea = {
  background: "#f8fafc",
  padding: "24px",
  borderRadius: "24px",
  marginBottom: "32px",
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  borderBottom: "1px solid rgba(0,0,0,0.03)",
  paddingBottom: "12px",
};

const dLabel = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#64748b",
};

const dVal = {
  fontSize: "14px",
  fontWeight: 800,
  color: "#0f172a",
};

const statusBanner = {
  display: "flex",
  gap: "12px",
  background: "#fffbeb",
  padding: "16px",
  borderRadius: "16px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#92400e",
  marginBottom: "32px",
};

const saveBtn = {
  width: "100%",
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "18px",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 800,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  boxShadow: "0 10px 20px rgba(34,197,94,0.2)",
};

const mapContainer = {
  background: "#0f172a",
  borderRadius: "40px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
};

const mapHeader = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  color: "rgba(255,255,255,0.6)",
  fontSize: "12px",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const mapWrapper = {
  flex: 1,
  minHeight: "500px",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "24px",
  overflow: "hidden",
};

const mapHint = {
  padding: "16px 24px",
  color: "rgba(255,255,255,0.4)",
  fontSize: "11px",
  fontWeight: 700,
};