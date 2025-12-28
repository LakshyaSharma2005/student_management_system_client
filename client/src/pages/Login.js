import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // 🟢 Captcha States
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  // 🟢 NEW: State to control redirection
  const [canRedirect, setCanRedirect] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // 🟢 Generate Captcha
  const generateCaptcha = () => {
    const chars = "0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
    // 🛑 FORCE LOGOUT ON LOAD: Clear old tokens so the Login Page ALWAYS shows
    localStorage.removeItem("token");
  }, []);

  // 🟢 FIX: Only navigate if 'user' exists AND we explicitly allowed it (via Login button)
  useEffect(() => {
    if (user && canRedirect) {
      const role = user.role ? user.role.toLowerCase() : "";

      if (role === "admin") navigate("/admin-dash");
      else if (role === "teacher") navigate("/teacher-dash");
      else if (role === "student") navigate("/student-dash");
      else navigate("/student-dash");
    }
  }, [user, canRedirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (captchaInput !== captchaCode) {
      setError("⚠️ Invalid Captcha. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.token && res.data.user) {
        // 🟢 1. Allow redirection to happen
        setCanRedirect(true);

        // 🟢 2. Update Auth State
        localStorage.setItem("token", res.data.token);
        login(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
      generateCaptcha();
      setCaptchaInput("");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgWave}></div>

      <div style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🎓</span>
            <h1 style={styles.logoText}>
              CAREER POINT
              <br />
              <span style={styles.universityText}>UNIVERSITY</span>
            </h1>
          </div>
          <h2 style={styles.signInTitle}>Sign In</h2>
          <p style={styles.subtitle}>Welcome to Career Point University Kota</p>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Username / Email"
              required
            />
            <span style={styles.inputIcon}>👤</span>
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Password"
              required
            />
            <span style={styles.inputIcon}>🔒</span>
          </div>

          <div style={styles.captchaContainer}>
            <div
              style={styles.captchaCode}
              onClick={generateCaptcha}
              title="Click to Refresh"
            >
              ↻ {captchaCode.split("").join(" ")}
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              style={styles.captchaInput}
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <div style={styles.rememberRow}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" style={{ marginRight: "5px" }} /> Remember
              Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonLoading : styles.button}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          <span style={styles.link} onClick={() => setShowForgotModal(true)}>
            Forgot Password / UserName?
          </span>
        </p>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <div style={styles.appBadge}>
            GET IT ON
            <br />
            <b>Google Play</b>
          </div>
        </div>
      </div>

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
              <p style={{ color: "#003366", fontWeight: "bold" }}>
                support@cpur.edu.in
              </p>
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

/* 🎨 STYLES (Unchanged) */
const styles = {
  page: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgWave: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "50%",
    background: "#003366",
    borderBottomRightRadius: "50% 20%",
    borderBottomLeftRadius: "50% 20%",
    zIndex: 0,
  },
  loginCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    zIndex: 10,
    position: "relative",
  },
  header: { textAlign: "left", marginBottom: "20px" },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    color: "#003366",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "10px",
  },
  logoIcon: { fontSize: "32px", marginRight: "10px" },
  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
    lineHeight: "1.2",
    margin: 0,
  },
  universityText: {
    fontSize: "14px",
    fontWeight: "normal",
    letterSpacing: "2px",
  },
  signInTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px",
    marginTop: "0",
  },
  subtitle: { margin: "0 0 20px", color: "#666", fontSize: "14px" },
  errorBanner: {
    background: "#fdecea",
    color: "#d93025",
    padding: "10px",
    borderRadius: "4px",
    fontSize: "13px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid #f2dede",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { position: "relative" },
  inputIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
    fontSize: "18px",
  },
  input: {
    width: "100%",
    padding: "12px 40px 12px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  captchaContainer: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "5px",
  },
  captchaCode: {
    background: "#f0f0f0",
    padding: "8px 12px",
    borderRadius: "4px",
    fontWeight: "bold",
    letterSpacing: "3px",
    fontFamily: "monospace",
    fontSize: "16px",
    color: "#333",
    flex: 1,
    textAlign: "center",
    border: "1px solid #ccc",
    cursor: "pointer",
    userSelect: "none",
  },
  captchaInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  rememberRow: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    color: "#666",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.3s",
  },
  buttonLoading: {
    width: "100%",
    padding: "12px",
    background: "#555",
    color: "#ccc",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "10px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "13px",
  },
  link: {
    color: "#003366",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
  },
  appBadge: {
    background: "#000",
    color: "#fff",
    display: "inline-block",
    padding: "5px 15px",
    borderRadius: "5px",
    fontSize: "10px",
    textAlign: "left",
    lineHeight: "1.2",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "320px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },
  modalTitle: { color: "#003366", marginTop: 0, fontSize: "20px" },
  modalText: { color: "#555", fontSize: "14px", lineHeight: "1.5" },
  adminContact: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    margin: "20px 0",
    color: "#333",
    border: "1px solid #eee",
  },
  closeBtn: {
    background: "#003366",
    border: "none",
    color: "#fff",
    padding: "8px 24px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default Login;
