import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";

import IdentifyHealth from "./pages/features/IdentifyHealth";
import FertilizerRecommend from "./pages/features/FertilizerRecommend";
import YieldPredict from "./pages/features/YieldPredict";
import ShelfLife from "./pages/features/ShelfLife";
import PartsQuality from "./pages/features/PartsQuality";

import NotFound from "./pages/NotFound";

// -------------------- Dummy auth (for now) --------------------
export const AuthContext = React.createContext(null);

const DEMO_USER = { name: "Demo User", email: "demo@agricultor.lk" };
const DEMO_EMAIL = "demo@agricultor.lk";
const DEMO_PASSWORD = "Demo@123";

function useAuthProvider() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ap_user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthed = !!user;

  function login(email, password) {
    // Dummy login (replace later with backend)
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem("ap_user", JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      return { ok: true };
    }
    return { ok: false, message: "Invalid demo credentials. Try demo@agricultor.lk / Demo@123" };
  }

  function logout() {
    localStorage.removeItem("ap_user");
    setUser(null);
  }

  return useMemo(() => ({ user, isAuthed, login, logout }), [user, isAuthed]);
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

export default function App() {
  const location = useLocation();
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <div className="app-shell">
        <ScrollToTopOnRouteChange />
        <Header />

        <main className="main">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Feature pages (protected) */}
              <Route
                path="/features/identify-health"
                element={
                  <ProtectedRoute>
                    <IdentifyHealth />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features/fertilizer"
                element={
                  <ProtectedRoute>
                    <FertilizerRecommend />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features/yield"
                element={
                  <ProtectedRoute>
                    <YieldPredict />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features/shelf-life"
                element={
                  <ProtectedRoute>
                    <ShelfLife />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features/parts-quality"
                element={
                  <ProtectedRoute>
                    <PartsQuality />
                  </ProtectedRoute>
                }
              />

              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
