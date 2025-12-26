import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🟢 CAPTCHA STATES
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // 🟢 FIX 1: Get 'user' from context so we can watch for updates
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // 🟢 GENERATE RANDOM CAPTCHA
  const generateCaptcha = () => {
    const chars = "0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code); // Store raw code: "1014"
  };

  // Generate on load
  useEffect(() => {
    generateCaptcha();
  }, []);

  // 🟢 FIX 2: useEffect to handle Navigation AFTER state updates
  useEffect(() => {
    if (user) {
      // Logic to determine dashboard based on role
      // Optional: .toLowerCase() added for safety against DB mismatches
      const role = user.role;
      if (role === "Admin") navigate("/admin");
      else if (role === "Teacher") navigate("/teacher");
      else navigate("/student");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🛑 STRICT CAPTCHA CHECK
    if (!captchaInput || captchaInput !== captchaCode) {
      setError("❌ Invalid Captcha. Please try again.");
      generateCaptcha(); // Refresh code to prevent brute force
      setCaptchaInput(""); // Clear input
      return; // ⛔ STOP HERE. Do not proceed to login.
    }

    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email,
        password,
      });
      if (res.data.token && res.data.user) {
        // 🟢 FIX 3: Just update state and storage here.
        // The useEffect above will handle the navigation automatically.
        login(res.data.user);
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      setError("Invalid Credentials");
      generateCaptcha();
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* 🟦 BLUE WAVE BACKGROUND */}
      <div style={styles.blueSection}>
        <div style={styles.logoContainer}>
          {/* Placeholder for University Logo Image */}
          <div style={styles.logoCircle}>
            <span style={{ fontSize: "24px" }}>🎓</span>
          </div>
          <div style={{ textAlign: "left" }}>
            <h1 style={styles.uniTitle}>CAREER POINT</h1>
            <h2 style={styles.uniSubtitle}>UNIVERSITY</h2>
          </div>
        </div>

        <div style={styles.welcomeContainer}>
          <p style={styles.welcomeSmall}>Welcome to</p>
          <h1 style={styles.welcomeBig}>Career Point University Kota</h1>
          <p style={styles.address}>
            National Highway 52, Opp Alaniya Mata Ji Mandir, Alaniya, Kota,
            Rajasthan 325003
          </p>
        </div>
      </div>

      {/* ⬜ WHITE CURVE OVERLAY */}
      <div style={styles.whiteCurve}></div>

      {/* ⬜ LOGIN CARD */}
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h2 style={styles.signInTitle}>Sign In</h2>

          {error && <div style={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* User Name */}
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="User Name"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <span style={styles.icon}>👤</span>
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <span style={styles.icon}>🔒</span>
            </div>

            {/* 🟢 CAPTCHA ROW (Fixed Alignment) */}
            <div style={styles.captchaRow}>
              <div style={styles.captchaDisplay}>
                <span
                  onClick={generateCaptcha}
                  style={styles.refreshIcon}
                  title="Refresh"
                >
                  ↻
                </span>
                <span style={styles.codeText}>
                  {captchaCode.split("").join(" ")}
                </span>
              </div>
              <input
                type="text"
                placeholder="Captcha"
                style={styles.captchaInput}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
            </div>

            {/* Remember Me */}
            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                id="remember"
                style={{ cursor: "pointer" }}
              />
              <label
                htmlFor="remember"
                style={{ cursor: "pointer", fontSize: "14px", color: "#555" }}
              >
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} style={styles.loginBtn}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* REPLACED <a> WITH <button> TO FIX ESLINT ERROR */}
          <div style={styles.footerLinks}>
            <button
              onClick={() => setShowForgotModal(true)}
              style={{
                ...styles.forgotLink, // Keep your existing link styles
                background: "none",
                border: "none",
                padding: "0",
                font: "inherit",
                cursor: "pointer",
                textDecoration: "underline", // Optional: ensures it looks like a link
              }}
            >
              Forgot Password / UserName
            </button>
          </div>

          <div style={styles.cardFooter}>
            <div style={styles.playBadge}>
              <span style={{ fontSize: "8px" }}>GET IT ON</span>
              <br />
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                Google Play
              </span>
            </div>
            {/* QR Code Placeholder */}
            <div style={styles.qrCode}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#000",
                  opacity: 0.1,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔐 MODAL */}
      {showForgotModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Recover Account</h3>
            <p>
              Please contact IT Admin: <b>support@cpur.edu.in</b>
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              style={styles.modalBtn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* 🎨 PIXEL-PERFECT STYLES */
const styles = {
  page: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#fff",
    fontFamily: '"Segoe UI", sans-serif',
    position: "relative",
    overflow: "hidden",
  },
  // 🔷 LEFT BLUE SECTION
  blueSection: {
    width: "60%", // Covers left side
    height: "100%",
    backgroundColor: "#305f82", // The specific muted blue from screenshot
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "8%",
    color: "#fff",
    position: "relative",
    zIndex: 1,
  },
  // ⚪ WHITE CURVE OVERLAY (Creates the wave effect)
  whiteCurve: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "55%",
    height: "100%",
    backgroundColor: "#fff",
    clipPath: "ellipse(70% 100% at 80% 50%)", // Creates the curve shape
    zIndex: 2,
    pointerEvents: "none", // Let clicks pass through if needed
  },

  // LOGO & TEXT
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "40px",
  },
  logoCircle: {
    width: "50px",
    height: "50px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#305f82",
  },
  uniTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "1px",
    lineHeight: "1",
  },
  uniSubtitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "400",
    letterSpacing: "4px",
    marginTop: "2px",
  },
  welcomeContainer: {
    marginTop: "20px",
    maxWidth: "500px",
  },
  welcomeSmall: {
    fontSize: "16px",
    marginBottom: "5px",
    opacity: 0.9,
  },
  welcomeBig: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "15px",
  },
  address: {
    fontSize: "14px",
    lineHeight: "1.5",
    opacity: 0.8,
  },

  // ⬜ CARD CONTAINER (Floats on right)
  cardContainer: {
    position: "absolute",
    right: "10%",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10, // Above the wave
    width: "380px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  signInTitle: {
    fontSize: "22px",
    color: "#333",
    marginBottom: "25px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "10px 35px 10px 12px", // Space for icon on right
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
    color: "#333",
  },
  icon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#999",
    fontSize: "16px",
  },

  // 🟢 CAPTCHA STYLES
  captchaRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  captchaDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2c3e50",
    letterSpacing: "3px",
    userSelect: "none",
  },
  refreshIcon: {
    cursor: "pointer",
    fontSize: "18px",
    color: "#555",
  },
  codeText: {
    marginLeft: "5px",
  },
  captchaInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "5px",
  },
  loginBtn: {
    backgroundColor: "#1a237e", // Dark Navy Blue
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  footerLinks: {
    textAlign: "center",
    marginTop: "15px",
  },
  forgotLink: {
    color: "#305f82",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
  },
  cardFooter: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playBadge: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "5px",
    lineHeight: "1.2",
    cursor: "pointer",
    width: "fit-content",
  },
  qrCode: {
    width: "40px",
    height: "40px",
    border: "1px solid #ddd",
  },
  errorMsg: {
    color: "#d32f2f",
    background: "#ffebee",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "13px",
    marginBottom: "15px",
    textAlign: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    minWidth: "300px",
  },
  modalBtn: {
    marginTop: "15px",
    padding: "8px 20px",
    background: "#305f82",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Login;
