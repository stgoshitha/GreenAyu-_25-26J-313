import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Register from "./pages/Register";

import TelemetryDashboard from "./pages/features/TelemetryDashboard";
import IdentifyHealth from "./pages/features/IdentifyHealth";
import YieldOptimization from "./pages/features/YieldOptimization";
import DryStorage from "./pages/features/DryStorage";
import PartsQuality from "./pages/features/PartsQuality";

import NotFound from "./pages/NotFound";

import API from "./services/api";

export const AuthContext = React.createContext(null);

const SIX_HOURS = 6 * 60 * 60 * 1000;

function useAuthProvider() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ap_user");
    const loginTime = localStorage.getItem("ap_login_time");
    
    if (raw && loginTime) {
      const now = new Date().getTime();
      if (now - parseInt(loginTime) > SIX_HOURS) {
        localStorage.removeItem("ap_user");
        localStorage.removeItem("ap_token");
        localStorage.removeItem("ap_login_time");
        return null;
      }
      return JSON.parse(raw);
    }
    return null;
  });

  const isAuthed = !!user;

  async function login(email, password) {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const userData = res.data.user;
        const token = res.data.token;
        const now = new Date().getTime();

        localStorage.setItem("ap_user", JSON.stringify(userData));
        localStorage.setItem("ap_token", token);
        localStorage.setItem("ap_login_time", now.toString());
        
        setUser(userData);
        return { ok: true, user: userData };
      }
      return { ok: false, message: "Login failed" };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || "Invalid credentials" };
    }
  }

  async function register(name, email, password) {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data.success) {
        const userData = res.data.user;
        const token = res.data.token;
        const now = new Date().getTime();

        localStorage.setItem("ap_user", JSON.stringify(userData));
        localStorage.setItem("ap_token", token);
        localStorage.setItem("ap_login_time", now.toString());
        
        setUser(userData);
        return { ok: true, user: userData };
      }
      return { ok: false, message: "Registration failed" };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || "Registration failed" };
    }
  }

  async function refreshUser() {
    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        const userData = {
          ...res.data.data,
          id: res.data.data._id // For consistency with login payload
        };
        localStorage.setItem("ap_user", JSON.stringify(userData));
        setUser(userData);
      }
    } catch (err) {
      console.error("Failed to refresh user data", err);
    }
  }

  function logout() {
    localStorage.removeItem("ap_user");
    localStorage.removeItem("ap_token");
    localStorage.removeItem("ap_login_time");
    setUser(null);
  }

  function updateUser(newData) {
    localStorage.setItem("ap_user", JSON.stringify(newData));
    setUser(newData);
  }

  async function updateLocation(locData) {
    try {
      const res = await API.put('/auth/location', locData);
      if (res.data.success) {
        const newUser = { ...user, location: res.data.data };
        updateUser(newUser);
        return true;
      }
    } catch (err) {
      console.error("Location update failed", err);
      return false;
    }
  }

  return useMemo(() => ({ user, isAuthed, login, register, logout, updateUser, refreshUser, updateLocation }), [user, isAuthed]);
}

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const auth = React.useContext(AuthContext);
  if (!auth?.isAuthed) return <Navigate to="/login" replace />;
  return children;
}

function AdminProtectedRoute({ children }) {
  const auth = React.useContext(AuthContext);
  if (!auth?.isAuthed) return <Navigate to="/login" replace />;
  if (auth.user.role !== 'admin') return <Navigate to="/features/identify-health" replace />;
  return children;
}

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePackages from "./pages/admin/ManagePackages";
import PackageRequests from "./pages/admin/PackageRequests";

export default function App() {
  const location = useLocation();
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <div className="app-shell">
        <ScrollToTopOnRouteChange />
        {/* Only show header/footer if not in admin dashboard for a cleaner look, or keep them if preferred */}
        {!location.pathname.startsWith('/admin') && <Header />}

        <main className="main">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<Faq />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} 
              />
              <Route 
                path="/admin/packages" 
                element={<AdminProtectedRoute><ManagePackages /></AdminProtectedRoute>} 
              />
              <Route 
                path="/admin/requests" 
                element={<AdminProtectedRoute><PackageRequests /></AdminProtectedRoute>} 
              />

              {/* Feature pages (protected) */}
              <Route
                path="/features/telemetry"
                element={<ProtectedRoute><TelemetryDashboard /></ProtectedRoute>}
              />
              <Route
                path="/features/identify-health"
                element={<IdentifyHealth />}
              />
              <Route
                path="/features/parts-quality"
                element={<PartsQuality />}
              />
              <Route
                path="/features/dry-storage"
                element={<ProtectedRoute><DryStorage /></ProtectedRoute>}
              />
              <Route
                path="/features/yield-optimization"
                element={<ProtectedRoute><YieldOptimization /></ProtectedRoute>}
              />

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        {!location.pathname.startsWith('/admin') && <Footer />}

      </div>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/94702169017"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          width: "64px",
          height: "64px",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(37, 211, 102, 0.4)",
          zIndex: 99999,
          cursor: "pointer",
          textDecoration: "none"
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Chat with an Agronomist"
      >
        <MessageSquare size={32} fill="white" color="white" />
      </motion.a>
    </AuthContext.Provider>
  );
}
