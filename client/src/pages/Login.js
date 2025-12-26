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

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // 🟢 FUNCTION TO GENERATE RANDOM CAPTCHA
  const generateCaptcha = () => {
    const chars = "0123456789"; // You can add letters "ABCDEFGHIJKLMNOPQRSTUVWXYZ" if you want
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code.split("").join(" ")); // Add spaces for style "1 0 1 4"
  };

  // Generate on load
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🟢 1. CHECK CAPTCHA FIRST
    // Remove spaces from code to compare (e.g., "1 0 1 4" -> "1014")
    const cleanCode = captchaCode.replace(/\s/g, "");
    if (captchaInput !== cleanCode) {
      setError("❌ Invalid Captcha Code. Please try again.");
      generateCaptcha(); // Refresh code on error
      setCaptchaInput(""); // Clear input
      return;
    }

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
        if (role === "Admin") navigate("/admin");
        else if (role === "Teacher") navigate("/teacher");
        else navigate("/student");
      }
    } catch (err) {
      setError("Invalid Credentials");
      generateCaptcha(); // Refresh captcha on failed login too
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* BACKGROUND WAVE */}
      <div style={styles.bgShape}></div>

      <div style={styles.container}>
        {/* LEFT SIDE */}
        <div style={styles.leftContent}>
          <div style={styles.logoRow}>
            <div style={styles.logoCircle}>CP</div>
            <div>
              <h2 style={styles.uniTitle}>CAREER POINT</h2>
              <h2 style={styles.uniSubtitle}>UNIVERSITY</h2>
            </div>
          </div>

          <div style={styles.welcomeText}>
            <p style={{ fontSize: "14px", marginBottom: "5px" }}>Welcome to</p>
            <h1 style={styles.bigTitle}>Career Point University Kota</h1>
            <p style={styles.address}>
              National Highway 52, Opp Alaniya Mata Ji Mandir, Alaniya, Kota,
              Rajasthan 325003
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Login Card */}
        <div style={styles.cardWrapper}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Sign In</h2>

            {error && <div style={styles.errorMsg}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="User Name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
                <span style={styles.icon}>👤</span>
              </div>

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

              {/* 🟢 WORKING CAPTCHA SECTION */}
              <div style={styles.captchaRow}>
                <div style={styles.captchaCode}>
                  {/* Click icon to refresh */}
                  <span
                    onClick={generateCaptcha}
                    style={{
                      cursor: "pointer",
                      fontSize: "18px",
                      marginRight: "8px",
                    }}
                    title="Refresh Captcha"
                  >
                    ↻
                  </span>
                  {captchaCode}
                </div>
                <input
                  type="text"
                  placeholder="Enter Captcha"
                  style={styles.input}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </div>

              <div style={styles.checkRow}>
                <input type="checkbox" id="rem" />
                <label htmlFor="rem">Remember Me</label>
              </div>

              <button type="submit" disabled={loading} style={styles.btn}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div style={styles.links}>
              <span
                onClick={() => setShowForgotModal(true)}
                style={styles.link}
              >
                Forgot Password / UserName
              </span>
            </div>

            <div style={styles.appStore}>
              <div style={styles.playBtn}>
                <span>GET IT ON</span>
                <br />
                <b>Google Play</b>
              </div>
              <div style={styles.qrCode}>QR</div>
            </div>
          </div>
        </div>
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
              <p style={{ color: "#2c5282", fontWeight: "bold" }}>
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

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    background: "#f4f6f9",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },

  bgShape: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "55%",
    background: "#2c5282",
    borderBottomRightRadius: "50% 20%",
    borderBottomLeftRadius: "50% 20%",
    zIndex: 0,
  },

  container: {
    display: "flex",
    width: "100%",
    maxWidth: "1100px",
    zIndex: 1,
    padding: "20px",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  leftContent: {
    flex: 1,
    color: "white",
    paddingRight: "50px",
    minWidth: "300px",
    marginBottom: "30px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "40px",
  },
  logoCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "white",
    color: "#2c5282",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  uniTitle: { margin: 0, fontSize: "24px", letterSpacing: "1px" },
  uniSubtitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "400",
    letterSpacing: "3px",
  },
  welcomeText: { marginTop: "20px" },
  bigTitle: { fontSize: "32px", margin: "5px 0 15px 0", fontWeight: "700" },
  address: {
    fontSize: "14px",
    opacity: 0.9,
    lineHeight: "1.5",
    maxWidth: "400px",
  },

  cardWrapper: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    minWidth: "320px",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "380px",
  },
  cardTitle: { margin: "0 0 20px 0", color: "#333", fontSize: "22px" },
  errorMsg: {
    background: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px",
    fontSize: "13px",
    marginBottom: "15px",
    border: "1px solid #ffcdd2",
    textAlign: "center",
  },

  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { position: "relative" },
  input: {
    width: "100%",
    padding: "10px 10px 10px 10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  icon: { position: "absolute", right: "10px", top: "10px", color: "#ccc" },

  captchaRow: { display: "flex", gap: "10px" },
  captchaCode: {
    flex: 1,
    background: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    letterSpacing: "3px",
    borderRadius: "4px",
    fontSize: "16px",
    userSelect: "none",
  },

  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    color: "#666",
  },

  btn: {
    padding: "12px",
    background: "#1a202c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  links: { marginTop: "15px", textAlign: "center" },
  link: {
    color: "#2c5282",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  appStore: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playBtn: {
    background: "black",
    color: "white",
    padding: "5px 12px",
    borderRadius: "5px",
    fontSize: "10px",
    lineHeight: "1.2",
    cursor: "pointer",
  },
  qrCode: { width: "40px", height: "40px", background: "#ddd" },

  // Modal Styles
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
  modalTitle: { color: "#2c5282", marginTop: 0, fontSize: "20px" },
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
    background: "#2c5282",
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
