import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("fees"); // Default to fees to show the feature

  // Data States
  const [student, setStudent] = useState({
    name: "Student",
    email: "",
    course: "B.Tech",
    roll: "Unknown",
  });
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [fees, setFees] = useState({
    status: "Pending",
    amount: 50000,
    due: "2025-01-15",
  });
  const [loadingPay, setLoadingPay] = useState(false);

  // 🔄 Initial Load
  useEffect(() => {
    const loadData = async () => {
      // 1. Load User Info
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setStudent((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          roll: "CS-2025-001",
        }));
      }

      // 2. Fetch or Mock Data
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/student/attendance`,
          {
            headers: { Authorization: token },
          }
        );
        setAttendance(res.data);
      } catch (err) {
        console.log("Using Demo Data");
        setAttendance([
          {
            date: "2025-12-01",
            subject: "Computer Networks",
            status: "Present",
          },
          { date: "2025-12-02", subject: "Database Systems", status: "Absent" },
          {
            date: "2025-12-03",
            subject: "Operating Systems",
            status: "Present",
          },
          { date: "2025-12-04", subject: "Data Structures", status: "Present" },
          { date: "2025-12-05", subject: "Software Eng.", status: "Present" },
        ]);
        setMarks([
          { subject: "Computer Networks", mid: 45, final: 88, grade: "A" },
          { subject: "Database Systems", mid: 40, final: 82, grade: "A-" },
          { subject: "Operating Systems", mid: 38, final: 75, grade: "B+" },
          { subject: "Data Structures", mid: 48, final: 92, grade: "A+" },
        ]);
      }
    };
    loadData();
  }, []);

  // 💳 MOCK PAYMENT HANDLER
  const handleMockPayment = () => {
    const confirm = window.confirm(
      "Proceed to Secure Payment Gateway for ₹50,000?"
    );
    if (confirm) {
      setLoadingPay(true);
      // Simulate network delay
      setTimeout(() => {
        setFees((prev) => ({ ...prev, status: "Paid" }));
        setLoadingPay(false);
        alert("✅ Payment Successful! Transaction ID: TXN_99887766");
      }, 2000);
    }
  };

  // 📊 Calculate Stats
  const totalClasses = attendance.length;
  const presentCount = attendance.filter((r) => r.status === "Present").length;
  const percentage =
    totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(0) : 0;

  return (
    <div style={styles.container}>
      {/* 🟢 TOP NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.brand}>
          <span style={styles.logoIcon}>🎓</span>
          <h1>
            Student<span style={{ color: "#f1c40f" }}>Portal</span>
          </h1>
        </div>
        <div style={styles.navRight}>
          <div style={styles.profile}>
            <div style={styles.avatarNav}>{student.name.charAt(0)}</div>
            <span>{student.name}</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* 🟡 SIDEBAR */}
        <div style={styles.sidebar}>
          <p style={styles.menuLabel}>ACADEMIC</p>
          <NavBtn
            label="📊 Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavBtn
            label="📝 Attendance"
            active={activeTab === "attendance"}
            onClick={() => setActiveTab("attendance")}
          />
          <NavBtn
            label="🏅 Report Card"
            active={activeTab === "marks"}
            onClick={() => setActiveTab("marks")}
          />
          <NavBtn
            label="💰 Fee Status"
            active={activeTab === "fees"}
            onClick={() => setActiveTab("fees")}
          />
        </div>

        {/* 🔵 MAIN CONTENT */}
        <div style={styles.content}>
          {/* 1️⃣ DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              {/* Profile Header */}
              <div style={styles.welcomeCard}>
                <div style={styles.welcomeText}>
                  <h1>Welcome back, {student.name}! 👋</h1>
                  <p>You have 2 classes scheduled for today.</p>
                </div>
                <div style={styles.idCard}>
                  <small>ID CARD</small>
                  <h3>{student.name}</h3>
                  <p>
                    {student.course} | {student.roll}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div style={styles.overviewGrid}>
                <StatCard
                  title="Overall Attendance"
                  value={`${percentage}%`}
                  color={percentage > 75 ? "#2ecc71" : "#e74c3c"}
                />
                <StatCard title="CGPA" value="9.2" color="#f1c40f" />
                <StatCard
                  title="Fee Status"
                  value={fees.status}
                  color={fees.status === "Paid" ? "#2ecc71" : "#e74c3c"}
                />
              </div>

              {/* Recent Activity */}
              <div style={styles.card}>
                <h3>📅 Recent Attendance</h3>
                <div style={styles.activityList}>
                  {attendance.slice(0, 3).map((r, i) => (
                    <div key={i} style={styles.activityItem}>
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          alignItems: "center",
                        }}
                      >
                        <div style={styles.dateBadge}>
                          {r.date.split("-")[2]}
                          <br />
                          <small>DEC</small>
                        </div>
                        <div>
                          <strong>{r.subject}</strong>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              color: "#666",
                            }}
                          >
                            Lecture Hall A
                          </p>
                        </div>
                      </div>
                      <span
                        style={
                          r.status === "Present"
                            ? styles.statusGreen
                            : styles.statusRed
                        }
                      >
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 2️⃣ ATTENDANCE TAB */}
          {activeTab === "attendance" && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>📝 Full Attendance Record</h3>
                <div style={styles.progressBarBg}>
                  <div
                    style={{
                      ...styles.progressBarFill,
                      width: `${percentage}%`,
                      background: percentage > 75 ? "#2ecc71" : "#e74c3c",
                    }}
                  ></div>
                </div>
                <span style={{ fontWeight: "bold" }}>
                  {percentage}% Present
                </span>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((r, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{r.date}</td>
                      <td style={styles.td}>
                        <b>{r.subject}</b>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={
                            r.status === "Present"
                              ? styles.statusGreen
                              : styles.statusRed
                          }
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3️⃣ MARKS TAB */}
          {activeTab === "marks" && (
            <div style={styles.card}>
              <h3>🏅 Examination Results</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th>Subject</th>
                    <th>Mid Term (50)</th>
                    <th>Final (100)</th>
                    <th>Total</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>
                        <b>{m.subject}</b>
                      </td>
                      <td style={styles.td}>{m.mid}</td>
                      <td style={styles.td}>{m.final}</td>
                      <td style={styles.td}>
                        <strong>{m.mid + m.final}</strong>/150
                      </td>
                      <td style={styles.td}>
                        <span style={styles.gradeBadge}>{m.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4️⃣ FEES TAB */}
          {activeTab === "fees" && (
            <div style={styles.feeCard}>
              <div style={styles.feeHeader}>
                <div>
                  <h3>💰 Semester Fees</h3>
                  <p>Due Date: {fees.due}</p>
                </div>
                <div
                  style={
                    fees.status === "Paid" ? styles.paidStamp : styles.dueStamp
                  }
                >
                  {fees.status.toUpperCase()}
                </div>
              </div>

              <div style={styles.feeDetails}>
                <div style={styles.feeRow}>
                  <span>Tuition Fee</span>
                  <span>₹45,000</span>
                </div>
                <div style={styles.feeRow}>
                  <span>Library Fee</span>
                  <span>₹2,000</span>
                </div>
                <div style={styles.feeRow}>
                  <span>Lab Charges</span>
                  <span>₹3,000</span>
                </div>
                <div
                  style={{
                    ...styles.feeRow,
                    borderTop: "1px solid #ddd",
                    paddingTop: "10px",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total Amount</span>
                  <span>₹{fees.amount.toLocaleString()}</span>
                </div>
              </div>

              {fees.status === "Pending" ? (
                <button
                  style={styles.payBtn}
                  onClick={handleMockPayment}
                  disabled={loadingPay}
                >
                  {loadingPay ? "Processing Secure Payment..." : "Pay Now 💳"}
                </button>
              ) : (
                <button style={styles.paidBtn} disabled>
                  ✅ Payment Completed
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 💎 COMPONENTS & STYLES
const NavBtn = ({ label, active, onClick }) => (
  <button
    style={active ? styles.menuBtnActive : styles.menuBtn}
    onClick={onClick}
  >
    {label}
  </button>
);

const StatCard = ({ title, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <h3 style={{ fontSize: "32px", color: "#2c3e50", margin: 0 }}>{value}</h3>
    <p style={{ color: "#7f8c8d", margin: 0 }}>{title}</p>
  </div>
);

const styles = {
  container: {
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },

  // Navbar
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 30px",
    height: "70px",
    background: "#2c3e50",
    color: "#fff",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "20px",
  },
  logoIcon: { fontSize: "24px" },
  navRight: { display: "flex", gap: "20px", alignItems: "center" },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
  },
  avatarNav: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#f1c40f",
    color: "#2c3e50",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "6px",
    cursor: "pointer",
  },

  // Layout
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    minHeight: "calc(100vh - 70px)",
  },
  sidebar: {
    background: "#fff",
    borderRight: "1px solid #ddd",
    padding: "20px",
  },
  menuLabel: {
    fontSize: "12px",
    color: "#95a5a6",
    marginTop: "10px",
    marginBottom: "10px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  menuBtn: {
    display: "block",
    width: "100%",
    padding: "12px 15px",
    background: "transparent",
    color: "#7f8c8d",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "15px",
    marginBottom: "5px",
    transition: "0.2s",
  },
  menuBtnActive: {
    display: "block",
    width: "100%",
    padding: "12px 15px",
    background: "#f0f3f6",
    color: "#2c3e50",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "15px",
    marginBottom: "5px",
    fontWeight: "600",
    borderRight: "4px solid #f1c40f",
  },

  content: { padding: "30px" },

  // Dashboard
  welcomeCard: {
    background: "linear-gradient(135deg, #3498db, #2c3e50)",
    color: "#fff",
    padding: "30px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
  },
  welcomeText: { flex: 1 },
  idCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "8px",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255,255,255,0.2)",
    minWidth: "150px",
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    marginBottom: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  activityList: { display: "flex", flexDirection: "column", gap: "15px" },
  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    background: "#f8f9fa",
    borderRadius: "8px",
  },
  dateBadge: {
    background: "#e8f6fd",
    color: "#3498db",
    padding: "5px 10px",
    borderRadius: "6px",
    textAlign: "center",
    fontWeight: "bold",
  },

  // Tables & Status
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  trHead: {
    background: "#f8f9fa",
    borderBottom: "2px solid #e9ecef",
    textAlign: "left",
  },
  tr: { borderBottom: "1px solid #f1f2f6" },
  td: { padding: "12px", verticalAlign: "middle" },
  statusGreen: {
    color: "#27ae60",
    fontWeight: "bold",
    background: "#eafaf1",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  statusRed: {
    color: "#e74c3c",
    fontWeight: "bold",
    background: "#fdedec",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  gradeBadge: {
    background: "#34495e",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  progressBarBg: {
    flex: 1,
    height: "8px",
    background: "#eee",
    borderRadius: "4px",
    margin: "0 20px",
  },
  progressBarFill: { height: "100%", borderRadius: "4px" },

  // Fee Card
  feeCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  feeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    borderBottom: "1px solid #eee",
    paddingBottom: "20px",
  },
  paidStamp: {
    border: "2px solid #27ae60",
    color: "#27ae60",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "900",
    letterSpacing: "2px",
    transform: "rotate(-5deg)",
  },
  dueStamp: {
    border: "2px solid #e74c3c",
    color: "#e74c3c",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "900",
    letterSpacing: "2px",
    transform: "rotate(-5deg)",
  },
  feeDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
  },
  feeRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    color: "#555",
  },
  payBtn: {
    width: "100%",
    padding: "15px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },
  paidBtn: {
    width: "100%",
    padding: "15px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "default",
  },
};

export default StudentDash;
