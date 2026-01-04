import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 📚 SUBJECT CONFIGURATION (Logic Unchanged)
const SUBJECT_LIST = [
  "AWS Cloud Essentials",
  "Computer Graphics and Multimedia Systems",
  "Cryptography and Data Security",
  "Software Quality Management",
  "Enterprise Resource Planning Concepts",
  "Cyber Law and Forensics",
];

const PRACTICAL_SUBJECTS = [
  "AWS Cloud Essentials",
  "Computer Graphics and Multimedia Systems",
];

// 🎨 NEW: SVG ICONS
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
  Users: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
      <path d="M16 3.13a4 4 0 010 7.75"></path>
    </svg>
  ),
  Book: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path>
    </svg>
  ),
  Chart: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
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
  Search: () => (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
};

const TeacherDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // RESPONSIVE STATE
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // 👤 IDENTITY STATE
  const [teacher, setTeacher] = useState({
    name: "Professor",
    email: "",
    subject: SUBJECT_LIST[1],
  });

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [marks, setMarks] = useState({});

  // UI States
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_LIST[1]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [message, setMessage] = useState("");

  // Helper: Check if current subject is practical
  const isPracticalSubject = PRACTICAL_SUBJECTS.includes(selectedSubject);

  // 🔄 RESIZE HANDLER (Logic Unchanged)
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

  // 🔄 Initial Load (Logic Unchanged)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setTeacher({
        name: user.name,
        email: user.email,
        subject: user.subject || "Assigned Subject",
      });
      if (user.subject && SUBJECT_LIST.includes(user.subject)) {
        setSelectedSubject(user.subject);
      }
    } else {
      navigate("/");
    }

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${SERVER_URL}/api/admin/students`, {
          headers: { Authorization: token },
        });

        if (res.data && res.data.length > 0) {
          setStudents(res.data);
          initializeData(res.data);
        } else {
          throw new Error("No students found in DB");
        }
      } catch (err) {
        console.warn("Using Demo Data:", err);
        const demoData = [
          {
            _id: "demo1",
            name: "Lakshya Sharma",
            roll: "CAL742",
            email: "student@cpu.edu",
          },
          {
            _id: "demo2",
            name: "Mayank Madaan",
            roll: "CAL755",
            email: "mayank@cpu.edu",
          },
        ];
        setStudents(demoData);
        initializeData(demoData);
      }
    };

    fetchStudents();
  }, [navigate, SERVER_URL]);

  const initializeData = (data) => {
    const initialAtt = {};
    const initialMarks = {};
    data.forEach((s) => {
      initialAtt[s._id] = "Present";
      initialMarks[s._id] = {
        minor: "",
        major: "",
        assign: "",
        quiz: "",
        practical: "",
      };
    });
    setAttendance(initialAtt);
    setMarks(initialMarks);
  };

  // 📝 Attendance Logic (Logic Unchanged)
  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present",
    }));
  };

  const markAll = (status) => {
    const newStatus = {};
    students.forEach((s) => (newStatus[s._id] = status));
    setAttendance(newStatus);
  };

  const submitAttendance = () => {
    setMessage(`✅ Attendance Saved for ${selectedSubject}!`);
    setTimeout(() => setMessage(""), 3000);
  };

  // 📊 Marks Logic (Logic Unchanged)
  const handleMarkChange = (id, type, value) => {
    setMarks((prev) => ({
      ...prev,
      [id]: { ...prev[id], [type]: value },
    }));
  };

  // 🧠 CALCULATION LOGIC (Logic Unchanged)
  const getStudentStats = (id) => {
    const sMarks = marks[id] || {};
    const minor = Number(sMarks.minor || 0);
    const major = Number(sMarks.major || 0);
    const assign = Number(sMarks.assign || 0);
    const quiz = Number(sMarks.quiz || 0);
    const practical = isPracticalSubject ? Number(sMarks.practical || 0) : 0;
    const total = minor + major + assign + quiz + practical;

    const passingMarks = isPracticalSubject ? 60 : 40;
    const maxMarks = isPracticalSubject ? 150 : 100;

    let status = "Pass";
    let statusColor = "#10b981"; // Green

    if (total < passingMarks) {
      const shortfall = passingMarks - total;
      if (shortfall <= 5) {
        status = "Re-Major";
        statusColor = "#f59e0b"; // Orange
      } else {
        status = "Summer";
        statusColor = "#ef4444"; // Red
      }
    }
    return { total, maxMarks, status, statusColor };
  };

  const presentCount = Object.values(attendance).filter(
    (s) => s === "Present"
  ).length;
  const attendancePercent =
    students.length > 0
      ? Math.round((presentCount / students.length) * 100)
      : 0;

  return (
    <div style={styles.container}>
      {/* 🌑 SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          // Responsive Logic: If mobile, slide in/out. If desktop, stay fixed.
          transform: isMobile
            ? isSidebarOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "none",
        }}
      >
        <div style={styles.brand}>
          <div style={styles.brandIcon}>🎓</div>
          <h2 style={styles.brandText}>Faculty Portal</h2>
        </div>

        <nav style={styles.nav}>
          <NavItem
            icon={<Icons.Home />}
            label="Overview"
            active={activeTab === "dashboard"}
            onClick={() => {
              setActiveTab("dashboard");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.Users />}
            label="Attendance"
            active={activeTab === "attendance"}
            onClick={() => {
              setActiveTab("attendance");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.Chart />}
            label="Gradebook"
            active={activeTab === "marks"}
            onClick={() => {
              setActiveTab("marks");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.Book />}
            label="Students"
            active={activeTab === "students"}
            onClick={() => {
              setActiveTab("students");
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
          // Alignment Fix: Calculate width correctly on desktop
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

          <div style={styles.headerRight}>
            <div style={styles.profile}>
              <div style={styles.avatar}>{teacher.name.charAt(0)}</div>
              <span style={styles.profileName}>{teacher.name}</span>
            </div>
          </div>
        </header>

        {/* 📊 DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div style={styles.content}>
            {/* Blue Welcome Banner */}
            <div style={styles.welcomeBanner}>
              <div>
                <h2 style={{ margin: 0, fontSize: "24px" }}>
                  Welcome back, {teacher.name}! 👋
                </h2>
                <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>
                  Subject: {selectedSubject}
                </p>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <StatCard
                label="Total Students"
                value={students.length}
                color="#3b82f6"
                icon={<Icons.Users />}
              />
              <StatCard
                label="Attendance"
                value={`${attendancePercent}%`}
                color="#10b981"
                icon={<Icons.Chart />}
              />
              <StatCard
                label="Type"
                value={isPracticalSubject ? "Practical" : "Theory"}
                color="#f59e0b"
                icon={<Icons.Book />}
              />
            </div>

            {/* Attendance Chart */}
            <div style={styles.card}>
              <h3>Attendance Overview</h3>
              <div style={styles.chartContainer}>
                {[60, 80, 45, 90, 75, 60, 85].map((h, i) => (
                  <div key={i} style={styles.barWrapper}>
                    <div style={{ ...styles.bar, height: `${h}%` }}></div>
                    <span style={styles.barLabel}>
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h3>📢 Quick Actions</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={styles.actionBtn}
                  onClick={() => setActiveTab("attendance")}
                >
                  Take Attendance ➜
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => setActiveTab("marks")}
                >
                  Upload Marks ➜
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 📝 ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h3>📝 Mark Attendance</h3>
                <div style={styles.controls}>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={styles.input}
                  />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    style={styles.select}
                  >
                    {SUBJECT_LIST.map((sub, i) => (
                      <option key={i} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {message && <div style={styles.successMsg}>{message}</div>}

              <div style={styles.toolbar}>
                <span>
                  Summary:{" "}
                  <strong style={{ color: "#10b981" }}>
                    {presentCount} Present
                  </strong>{" "}
                  /{" "}
                  <strong style={{ color: "#ef4444" }}>
                    {students.length - presentCount} Absent
                  </strong>
                </span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => markAll("Present")}
                    style={styles.smallBtn}
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => markAll("Absent")}
                    style={{
                      ...styles.smallBtn,
                      color: "red",
                      background: "#fee2e2",
                    }}
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              <div style={styles.gridList}>
                {students.map((s) => (
                  <div
                    key={s._id}
                    style={
                      attendance[s._id] === "Present"
                        ? styles.studentCardPresent
                        : styles.studentCardAbsent
                    }
                    onClick={() => toggleAttendance(s._id)}
                  >
                    <div style={styles.avatarList}>{s.name.charAt(0)}</div>
                    <div>
                      <strong>{s.name}</strong>
                      <p
                        style={{
                          fontSize: "12px",
                          margin: 0,
                          color: "#6b7280",
                        }}
                      >
                        {s.roll}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={submitAttendance} style={styles.primaryBtn}>
                Save Attendance 💾
              </button>
            </div>
          </div>
        )}

        {/* 🎓 GRADEBOOK TAB */}
        {activeTab === "marks" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h3>🎓 Gradebook: {selectedSubject}</h3>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={styles.select}
                >
                  {SUBJECT_LIST.map((sub, i) => (
                    <option key={i} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th>Student</th>
                      <th>Minor (20)</th>
                      <th>Major (60)</th>
                      <th>Assign (10)</th>
                      <th>Quiz (10)</th>
                      {isPracticalSubject && <th>Practical (50)</th>}
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => {
                      const stats = getStudentStats(s._id);
                      return (
                        <tr key={s._id} style={styles.tr}>
                          <td style={styles.td}>
                            <b>{s.name}</b>
                            <br />
                            <small>{s.roll}</small>
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              style={styles.markInput}
                              value={marks[s._id]?.minor}
                              onChange={(e) =>
                                handleMarkChange(s._id, "minor", e.target.value)
                              }
                            />
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              style={styles.markInput}
                              value={marks[s._id]?.major}
                              onChange={(e) =>
                                handleMarkChange(s._id, "major", e.target.value)
                              }
                            />
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              style={styles.markInput}
                              value={marks[s._id]?.assign}
                              onChange={(e) =>
                                handleMarkChange(
                                  s._id,
                                  "assign",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td style={styles.td}>
                            <input
                              type="number"
                              style={styles.markInput}
                              value={marks[s._id]?.quiz}
                              onChange={(e) =>
                                handleMarkChange(s._id, "quiz", e.target.value)
                              }
                            />
                          </td>
                          {isPracticalSubject && (
                            <td style={styles.td}>
                              <input
                                type="number"
                                style={{
                                  ...styles.markInput,
                                  borderColor: "#3b82f6",
                                }}
                                value={marks[s._id]?.practical}
                                onChange={(e) =>
                                  handleMarkChange(
                                    s._id,
                                    "practical",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          )}
                          <td style={styles.td}>
                            <strong>{stats.total}</strong> / {stats.maxMarks}
                          </td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                background: stats.statusColor,
                              }}
                            >
                              {stats.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => {
                  setMessage("✅ Marks Uploaded!");
                  setTimeout(() => setMessage(""), 3000);
                }}
                style={styles.primaryBtn}
              >
                Upload Marks 🚀
              </button>
              {message && <div style={styles.successMsg}>{message}</div>}
            </div>
          </div>
        )}

        {/* 👥 STUDENTS TAB */}
        {activeTab === "students" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3>👥 Enrolled Students</h3>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id} style={styles.tr}>
                        <td style={styles.td}>{s.name}</td>
                        <td style={styles.td}>{s.email}</td>
                        <td style={styles.td}>{s.course || "N/A"}</td>
                        <td style={styles.td}>
                          <button style={styles.smallBtn}>View Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* 🧩 SUB-COMPONENTS */
const NavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
  >
    {icon} <span style={{ marginLeft: "12px" }}>{label}</span>
  </div>
);

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>{label}</p>
      <h3 style={{ margin: "5px 0", fontSize: "24px" }}>{value}</h3>
    </div>
    <div style={{ color }}>{icon}</div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  cardHeader: {
    marginBottom: "20px",
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: "10px",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  // CHARTS
  chartContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "200px",
    paddingTop: "20px",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: "12px",
    backgroundColor: "#3b82f6",
    borderRadius: "4px",
    transition: "height 0.3s ease",
  },
  barLabel: { marginTop: "10px", fontSize: "12px", color: "#9ca3af" },

  // CONTROLS & TABLES
  controls: { display: "flex", gap: "10px" },
  actionBtn: {
    flex: 1,
    padding: "10px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#1e293b",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  trHead: { background: "#f9fafb", textAlign: "left", color: "#6b7280" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "12px" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb" },
  select: { padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb" },
  markInput: {
    width: "60px",
    padding: "6px",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    textAlign: "center",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#fff",
  },

  gridList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  studentCardPresent: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #10b981",
    background: "#ecfdf5",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  studentCardAbsent: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ef4444",
    background: "#fef2f2",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  avatarList: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },

  primaryBtn: {
    padding: "10px 20px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    marginTop: "20px",
  },
  smallBtn: {
    padding: "5px 10px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  successMsg: {
    padding: "10px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default TeacherDash;
