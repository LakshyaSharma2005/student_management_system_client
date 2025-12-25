import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // RESPONSIVE STATE
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // Data States
  const [student, setStudent] = useState({
    name: "Student",
    email: "",
    course: "",
    roll: "",
    fees: "Pending",
  });
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [feeDetails, setFeeDetails] = useState({
    status: "Pending",
    amount: 28000,
    due: "2025-01-15",
  });
  const [loadingPay, setLoadingPay] = useState(false);

  // 🔄 RESIZE HANDLER
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true); // Auto-open on desktop
      else setIsSidebarOpen(false); // Auto-close on mobile
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔄 FETCH DATA
  useEffect(() => {
    const loadData = async () => {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userStr) {
        const user = JSON.parse(userStr);
        setStudent({ ...user, fees: user.fees || "Pending" });
        setFeeDetails((prev) => ({ ...prev, status: user.fees || "Pending" }));
      } else {
        navigate("/");
      }

      try {
        if (token) {
          const res = await axios.get(`${SERVER_URL}/api/student/attendance`, {
            headers: { Authorization: token },
          });
          if (res.data && res.data.length > 0) setAttendance(res.data);
          else throw new Error("No data");
        }
      } catch (err) {
        // Mock Data Fallback
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
  }, [navigate, SERVER_URL]);

  // 💳 MOCK PAYMENT HANDLER
  const handleMockPayment = () => {
    const confirm = window.confirm(
      `Proceed to Secure Payment Gateway for ₹${feeDetails.amount.toLocaleString()}?`
    );
    if (confirm) {
      setLoadingPay(true);
      setTimeout(() => {
        setFeeDetails((prev) => ({ ...prev, status: "Paid" }));
        setStudent((prev) => ({ ...prev, fees: "Paid" }));
        setLoadingPay(false);
        alert("✅ Payment Successful! Receipt sent to email.");
      }, 2000);
    }
  };

  // Stats
  const totalClasses = attendance.length;
  const presentCount = attendance.filter((r) => r.status === "Present").length;
  const percentage =
    totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(0) : 0;

  return (
    <div style={styles.container}>
      {/* 🌑 SIDEBAR (Responsive) */}
      <div
        style={{
          ...styles.sidebar,
          width: isSidebarOpen ? "260px" : "0",
          padding: isSidebarOpen ? "20px" : "0",
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? "auto" : "none",
        }}
      >
        <div style={styles.logo}>
          🎓 Student<span style={{ color: "#f1c40f" }}>Portal</span>
        </div>

        <div style={styles.menu}>
          <NavBtn
            icon="📊"
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => {
              setActiveTab("dashboard");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavBtn
            icon="📝"
            label="Attendance"
            active={activeTab === "attendance"}
            onClick={() => {
              setActiveTab("attendance");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavBtn
            icon="🏅"
            label="Results"
            active={activeTab === "marks"}
            onClick={() => {
              setActiveTab("marks");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavBtn
            icon="💰"
            label="Fee Status"
            active={activeTab === "fees"}
            onClick={() => {
              setActiveTab("fees");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          style={styles.logoutBtn}
        >
          ↪ Logout
        </button>
      </div>

      {/* 🌑 MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ⚪ CONTENT */}
      <div
        style={{
          ...styles.content,
          marginLeft: !isMobile && isSidebarOpen ? "260px" : "0",
        }}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={styles.menuBtn}
            >
              ☰
            </button>
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          </div>
          <div style={styles.profile}>
            <div style={styles.avatarNav}>{student.name.charAt(0)}</div>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div style={styles.grid}>
            <div style={styles.welcomeCard}>
              <div style={styles.welcomeText}>
                <h1>Welcome back, {student.name}! 👋</h1>
                <p>You have classes scheduled for today.</p>
              </div>
              <div style={styles.idCard}>
                <small>ID CARD</small>
                <h3>{student.name}</h3>
                <p>
                  {student.course || "BCA"} | {student.roll || "Unknown"}
                </p>
              </div>
            </div>

            <div style={styles.statsRow}>
              <StatCard
                title="Overall Attendance"
                value={`${percentage}%`}
                color={percentage > 75 ? "#2ecc71" : "#e74c3c"}
              />
              <StatCard title="CGPA" value="9.2" color="#f1c40f" />
              <StatCard
                title="Fee Status"
                value={student.fees}
                color={student.fees === "Paid" ? "#2ecc71" : "#e74c3c"}
              />
            </div>

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
                          style={{ margin: 0, fontSize: "12px", color: "#666" }}
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
          </div>
        )}

        {activeTab === "attendance" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>📝 Full Attendance Record</h3>
              <span style={{ fontWeight: "bold" }}>{percentage}% Present</span>
            </div>
            <div style={styles.tableWrap}>
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
          </div>
        )}

        {activeTab === "marks" && (
          <div style={styles.card}>
            <h3>🏅 Examination Results</h3>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th>Subject</th>
                    <th>Mid (50)</th>
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
          </div>
        )}

        {activeTab === "fees" && (
          <div style={styles.feeCard}>
            <div style={styles.feeHeader}>
              <h3>💰 Semester Fees</h3>
              <div
                style={
                  feeDetails.status === "Paid"
                    ? styles.paidStamp
                    : styles.dueStamp
                }
              >
                {feeDetails.status.toUpperCase()}
              </div>
            </div>
            <div style={styles.feeDetails}>
              <div style={styles.feeRow}>
                <span>Tuition Fee</span>
                <span>₹25,000</span>
              </div>
              <div style={styles.feeRow}>
                <span>Library Fee</span>
                <span>₹2,000</span>
              </div>
              <div style={styles.feeRow}>
                <span>Lab Charges</span>
                <span>₹1,000</span>
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
                <span>₹{feeDetails.amount.toLocaleString()}</span>
              </div>
            </div>
            {feeDetails.status === "Pending" ? (
              <button
                style={styles.payBtn}
                onClick={handleMockPayment}
                disabled={loadingPay}
              >
                {loadingPay ? "Processing..." : "Pay Now 💳"}
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
  );
};

// COMPONENTS
const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.navItem,
      background: active ? "#34495e" : "transparent",
      borderLeft: active ? "4px solid #f1c40f" : "4px solid transparent",
    }}
  >
    <span style={{ marginRight: "10px" }}>{icon}</span> {label}
  </button>
);

const StatCard = ({ title, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <h3>{value}</h3> <p>{title}</p>
  </div>
);

// STYLES
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "sans-serif",
  },

  // SIDEBAR
  sidebar: {
    width: "260px",
    background: "#2c3e50",
    color: "#fff",
    position: "fixed",
    height: "100vh",
    zIndex: 1000,
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  logo: {
    padding: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    borderBottom: "1px solid #34495e",
  },
  menu: { flex: 1, padding: "10px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "12px",
    color: "#ecf0f1",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "15px",
    marginBottom: "5px",
    borderRadius: "0 8px 8px 0",
  },
  logoutBtn: {
    padding: "15px",
    background: "#c0392b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
  },

  // OVERLAY
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: 90,
  },

  // CONTENT
  content: {
    flex: 1,
    padding: "30px",
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
    width: "100%",
  },

  // HEADER
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  menuBtn: {
    fontSize: "24px",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "15px",
    color: "#2c3e50",
  },
  profile: { display: "flex", alignItems: "center", gap: "10px" },
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

  // DASHBOARD
  grid: { display: "flex", flexDirection: "column", gap: "20px" },
  welcomeCard: {
    background: "linear-gradient(135deg, #3498db, #2c3e50)",
    color: "#fff",
    padding: "30px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  idCard: {
    background: "rgba(255,255,255,0.1)",
    padding: "15px",
    borderRadius: "8px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "10px",
  },
  statCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  // TABLES & LISTS
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  tableWrap: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    minWidth: "600px",
  },
  trHead: { background: "#f8f9fa", textAlign: "left" },
  tr: { borderBottom: "1px solid #f1f2f6" },
  td: { padding: "12px" },
  statusGreen: {
    color: "#27ae60",
    background: "#eafaf1",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  statusRed: {
    color: "#e74c3c",
    background: "#fdedec",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  gradeBadge: {
    background: "#34495e",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },

  // ACTIVITY
  activityList: { display: "flex", flexDirection: "column", gap: "15px" },
  activityItem: {
    display: "flex",
    justifyContent: "space-between",
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

  // FEES
  feeCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  feeHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  paidStamp: {
    border: "2px solid #27ae60",
    color: "#27ae60",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  dueStamp: {
    border: "2px solid #e74c3c",
    color: "#e74c3c",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
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
  },
  payBtn: {
    width: "100%",
    padding: "15px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  paidBtn: {
    width: "100%",
    padding: "15px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "default",
  },
};

export default StudentDash;
