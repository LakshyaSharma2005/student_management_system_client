import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔒 HARDCODED BACKEND URL
  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.token && res.data.user) {
        login(res.data.user);
        localStorage.setItem("token", res.data.token);

        const role = res.data.user.role;
        if (role === "Admin") navigate("/admin-dash");
        else if (role === "Teacher") navigate("/teacher-dash");
        else if (role === "Student") navigate("/student-dash");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* ✨ ANIMATIONS & STYLES INJECTED HERE */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        /* Floating Label Magic */
        .input-group { position: relative; }
        .input-group input:focus + label,
        .input-group input:not(:placeholder-shown) + label {
          transform: translateY(-28px) scale(0.8);
          color: #FFD700; /* Gold when active */
          font-weight: 700;
        }
      `}</style>

      <div style={styles.glassCard}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logoCircle}>🏛️</div>
          <h1 style={styles.title}>Career Point University</h1>
          <p style={styles.subtitle}>Sign in to your dashboard</p>
        </div>

        {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Field with Floating Label */}
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder=" "
              required
            />
            <label style={styles.floatingLabel}>Email Address</label>
          </div>

          {/* Password Field with Floating Label */}
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder=" "
              required
            />
            <label style={styles.floatingLabel}>Password</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonLoading : styles.button}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) =>
              !loading && (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Trouble logging in?{" "}
          <span style={styles.link} onClick={() => setShowForgotModal(true)}>
            Reset Password
          </span>
        </p>
      </div>

      {/* 🔐 FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>🔐 Reset Password</h3>
            <p style={styles.modalText}>
              Contact the administration to reset your credentials.
            </p>
            <div style={styles.adminContact}>
              <p>
                <strong>Admin Contact:</strong>
              </p>
              <p style={{ color: "#FFD700" }}>support@college.edu</p>
              <p style={{ marginTop: "5px" }}>+91 7297885540</p>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              style={styles.closeBtn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* 🎨 ROYAL + ANIMATED THEME STYLES */
const styles = {
  page: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // 🌌 Animated Deep Royal Gradient
    background: "linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #141E30)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 12s ease infinite",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glassCard: {
    background: "rgba(16, 16, 28, 0.65)", // Darker glass for Royal feel
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "50px 40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 215, 0, 0.1)", // Subtle Gold Border
    animation: "float 6s ease-in-out infinite",
    zIndex: 10,
  },
  header: { textAlign: "center", marginBottom: "40px" },
  logoCircle: {
    fontSize: "45px",
    marginBottom: "10px",
    filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.4))",
  },
  title: {
    margin: "0",
    color: "#fff",
    fontSize: "26px",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  subtitle: { margin: "8px 0 0", color: "#a0a0c0", fontSize: "14px" },

  errorBanner: {
    background: "rgba(220, 38, 38, 0.2)",
    color: "#ff8888",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid rgba(220, 38, 38, 0.5)",
  },

  form: { display: "flex", flexDirection: "column", gap: "25px" },

  // Input Styles
  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(255, 255, 255, 0.05)",
    fontSize: "16px",
    color: "#fff",
    outline: "none",
    transition: "all 0.3s",
    boxSizing: "border-box",
  },
  floatingLabel: {
    position: "absolute",
    left: "16px",
    top: "16px",
    color: "#a0a0c0",
    fontSize: "16px",
    pointerEvents: "none",
    transition: "0.3s ease all",
  },

  // Gold Button
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #FFD700 0%, #FDB931 100%)",
    color: "#332200",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 5px 20px rgba(253, 185, 49, 0.3)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  buttonLoading: {
    width: "100%",
    padding: "16px",
    background: "#444",
    color: "#888",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "not-allowed",
    marginTop: "10px",
  },

  footer: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "13px",
    color: "#8888aa",
  },
  link: {
    color: "#FFD700",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },

  // MODAL
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    background: "#1a1a2e",
    padding: "30px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "320px",
    textAlign: "center",
    border: "1px solid #FFD700",
    boxShadow: "0 0 30px rgba(255, 215, 0, 0.2)",
  },
  modalTitle: { color: "#fff", marginTop: 0, fontSize: "20px" },
  modalText: { color: "#ccc", fontSize: "14px", lineHeight: "1.5" },
  adminContact: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "8px",
    margin: "20px 0",
    color: "#fff",
  },
  closeBtn: {
    background: "transparent",
    border: "1px solid #FFD700",
    color: "#FFD700",
    padding: "8px 24px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background 0.2s",
  },
};

export default Login;
