import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🎨 SVG ICONS (Consistent with Faculty Portal)
const Icons = {
  Home: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  List: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  ),
  Award: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="7"></circle>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
  ),
  CreditCard: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  ),
  LogOut: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 01-2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  Menu: () => (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
};

const StudentDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // RESPONSIVE STATE
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // Data States
  const [student, setStudent] = useState({
    name: "Student",
    email: "",
    course: "BCA",
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
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
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
    if (
      window.confirm(`Pay ₹${feeDetails.amount.toLocaleString()} securely?`)
    ) {
      setLoadingPay(true);
      setTimeout(() => {
        setFeeDetails((prev) => ({ ...prev, status: "Paid" }));
        setStudent((prev) => ({ ...prev, fees: "Paid" }));
        setLoadingPay(false);
        alert("✅ Payment Successful!");
      }, 2000);
    }
  };

  const totalClasses = attendance.length;
  const presentCount = attendance.filter((r) => r.status === "Present").length;
  const percentage =
    totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(0) : 0;

  return (
    <div style={styles.container}>
      {/* 🌑 SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isMobile
            ? isSidebarOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "none",
        }}
      >
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🎓</div>
          <h2 style={styles.brandText}>Student Portal</h2>
        </div>

        <nav style={styles.nav}>
          <NavItem
            icon={<Icons.Home />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => {
              setActiveTab("dashboard");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.List />}
            label="Attendance"
            active={activeTab === "attendance"}
            onClick={() => {
              setActiveTab("attendance");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.Award />}
            label="Results"
            active={activeTab === "marks"}
            onClick={() => {
              setActiveTab("marks");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.CreditCard />}
            label="Fee Status"
            active={activeTab === "fees"}
            onClick={() => {
              setActiveTab("fees");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          style={styles.logoutBtn}
        >
          <Icons.LogOut /> <span>Sign Out</span>
        </button>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ☀️ MAIN CONTENT */}
      <main
        style={{
          ...styles.main,
          marginLeft: isMobile ? 0 : "260px",
          width: isMobile ? "100%" : "calc(100% - 260px)",
        }}
      >
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            {isMobile && (
              <button
                style={styles.menuBtn}
                onClick={() => setIsSidebarOpen(true)}
              >
                <Icons.Menu />
              </button>
            )}
            <h1 style={styles.pageTitle}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          <div style={styles.profile}>
            <div style={styles.avatar}>{student.name.charAt(0)}</div>
            <span style={styles.profileName}>{student.name}</span>
          </div>
        </header>

        {/* 📊 DASHBOARD */}
        {activeTab === "dashboard" && (
          <div style={styles.content}>
            <div style={styles.welcomeBanner}>
              <div>
                <h2 style={{ margin: 0, fontSize: "24px" }}>
                  Welcome back, {student.name}! 👋
                </h2>
                <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>
                  You have classes scheduled for today.
                </p>
              </div>
              <div style={styles.idBadge}>
                <small style={{ opacity: 0.7, fontSize: "10px" }}>
                  ID CARD
                </small>
                <div style={{ fontWeight: "bold" }}>{student.name}</div>
                <div style={{ fontSize: "12px" }}>
                  {student.course} | {student.roll}
                </div>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <StatCard
                title="Attendance"
                value={`${percentage}%`}
                color={percentage > 75 ? "#10b981" : "#ef4444"}
              />
              <StatCard title="CGPA" value="9.2" color="#f59e0b" />
              <StatCard
                title="Fee Status"
                value={student.fees}
                color={student.fees === "Paid" ? "#10b981" : "#ef4444"}
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
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#6b7280",
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
          </div>
        )}

        {/* 📝 ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>Attendance Record</h3>
                <span style={{ fontWeight: "bold", color: "#3b82f6" }}>
                  {percentage}% Present
                </span>
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
          </div>
        )}

        {/* 🏅 RESULTS TAB */}
        {activeTab === "marks" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3>Examination Results</h3>
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
          </div>
        )}

        {/* 💰 FEES TAB */}
        {activeTab === "fees" && (
          <div style={styles.content}>
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
                    borderTop: "1px solid #e5e7eb",
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
          </div>
        )}
      </main>
    </div>
  );
};

/* 🧩 COMPONENTS */
const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
  >
    {icon} <span style={{ marginLeft: "12px" }}>{label}</span>
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>{title}</p>
      <h3 style={{ margin: "5px 0", fontSize: "24px" }}>{value}</h3>
    </div>
  </div>
);

/* 🎨 STYLES */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "'Inter', sans-serif",
  },

  // SIDEBAR
  sidebar: {
    width: "260px",
    backgroundColor: "#1a1a2e",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    position: "fixed",
    height: "100vh",
    zIndex: 100,
    transition: "transform 0.3s ease",
    top: 0,
    left: 0,
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
  },
  brandIcon: {
    width: "32px",
    height: "32px",
    background: "#3b82f6",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { fontSize: "18px", fontWeight: "600", margin: 0 },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#9ca3af",
    transition: "0.2s",
  },
  navItemActive: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#60a5fa",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "none",
    border: "1px solid #dc2626",
    color: "#dc2626",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "auto",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: 90,
  },

  // MAIN - ALIGNMENT FIX
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    transition: "margin-left 0.3s ease",
    boxSizing: "border-box",
  },
  header: {
    height: "70px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "15px" },
  menuBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  pageTitle: { fontSize: "20px", fontWeight: "600", margin: 0 },
  profile: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "35px",
    height: "35px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  profileName: { fontSize: "14px", fontWeight: "600" },

  // CONTENT
  content: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  welcomeBanner: {
    background: "linear-gradient(135deg, #1e40af, #3b82f6)",
    padding: "30px",
    borderRadius: "12px",
    color: "white",
    marginBottom: "30px",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  idBadge: {
    background: "rgba(255,255,255,0.2)",
    padding: "10px 15px",
    borderRadius: "8px",
    backdropFilter: "blur(5px)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  // LISTS & TABLES
  activityList: { display: "flex", flexDirection: "column", gap: "15px" },
  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "8px",
    alignItems: "center",
  },
  dateBadge: {
    background: "#eff6ff",
    color: "#3b82f6",
    padding: "5px 12px",
    borderRadius: "6px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "12px",
  },

  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  trHead: {
    background: "#f8fafc",
    textAlign: "left",
    color: "#64748b",
    fontSize: "14px",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "15px", fontSize: "14px" },
  statusGreen: {
    color: "#10b981",
    background: "#ecfdf5",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "12px",
  },
  statusRed: {
    color: "#ef4444",
    background: "#fef2f2",
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "12px",
  },
  gradeBadge: {
    background: "#e2e8f0",
    color: "#475569",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  // FEES
  feeCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    maxWidth: "500px",
    margin: "0 auto",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  feeHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
    alignItems: "center",
  },
  paidStamp: {
    border: "2px solid #10b981",
    color: "#10b981",
    padding: "5px 10px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "12px",
  },
  dueStamp: {
    border: "2px solid #ef4444",
    color: "#ef4444",
    padding: "5px 10px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "12px",
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
    fontSize: "15px",
    color: "#4b5563",
  },
  payBtn: {
    width: "100%",
    padding: "12px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  paidBtn: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "default",
  },
};

export default StudentDash;
