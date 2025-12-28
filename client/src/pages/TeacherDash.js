import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 📚 SUBJECT CONFIGURATION
const SUBJECT_LIST = [
  "AWS Cloud Essentials",
  "Computer Graphics and Multimedia Systems",
  "Cryptography and Data Security",
  "Software Quality Management",
  "Enterprise Resource Planning Concepts",
  "Cyber Law and Forensics",
];

// Subjects that have the extra Practical (50) component
const PRACTICAL_SUBJECTS = [
  "AWS Cloud Essentials",
  "Computer Graphics and Multimedia Systems",
];

// 🎨 ICONS (SVG Components for a premium look)
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
  Bell: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 01-3.46 0"></path>
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

const TeacherDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // 🔄 Initial Load
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

  // 📝 Attendance Logic
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

  // 📊 Marks Logic
  const handleMarkChange = (id, type, value) => {
    setMarks((prev) => ({
      ...prev,
      [id]: { ...prev[id], [type]: value },
    }));
  };

  // 🧠 Calculation Logic
  const getStudentStats = (id) => {
    const sMarks = marks[id] || {};
    const total =
      Number(sMarks.minor || 0) +
      Number(sMarks.major || 0) +
      Number(sMarks.assign || 0) +
      Number(sMarks.quiz || 0) +
      (isPracticalSubject ? Number(sMarks.practical || 0) : 0);
    const passingMarks = isPracticalSubject ? 60 : 40;
    const maxMarks = isPracticalSubject ? 150 : 100;

    let status = "Pass",
      statusColor = "#10b981";
    if (total < passingMarks) {
      status = passingMarks - total <= 5 ? "Re-Major" : "Summer";
      statusColor = status === "Re-Major" ? "#f59e0b" : "#ef4444";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* 🌑 SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          ...(window.innerWidth > 768 ? { transform: "none" } : {}),
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
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.Users />}
            label="Attendance"
            active={activeTab === "attendance"}
            onClick={() => {
              setActiveTab("attendance");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.Chart />}
            label="Gradebook"
            active={activeTab === "marks"}
            onClick={() => {
              setActiveTab("marks");
              setIsSidebarOpen(false);
            }}
          />
          <NavItem
            icon={<Icons.Book />}
            label="Students"
            active={activeTab === "students"}
            onClick={() => {
              setActiveTab("students");
              setIsSidebarOpen(false);
            }}
          />
        </nav>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <Icons.LogOut /> <span>Sign Out</span>
        </button>
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div
          style={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ☀️ MAIN CONTENT */}
      <main style={styles.main}>
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.menuBtn}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Icons.Menu />
            </button>
            <h1 style={styles.pageTitle}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.searchBar}>
              <Icons.Search />
              <input
                type="text"
                placeholder="Search..."
                style={styles.searchInput}
              />
            </div>
            <div style={styles.profile}>
              <div style={styles.avatar}>{teacher.name.charAt(0)}</div>
              <div style={styles.profileInfo}>
                <span style={styles.profileName}>{teacher.name}</span>
                <span style={styles.profileRole}>Faculty</span>
              </div>
            </div>
          </div>
        </header>

        {/* 📊 DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div style={styles.content}>
            {/* STATS ROW */}
            <div style={styles.statsGrid}>
              <StatCard
                label="Total Students"
                value={students.length}
                trend="+2 New"
                icon={<Icons.Users />}
                color="#3b82f6"
                bg="#eff6ff"
              />
              <StatCard
                label="Avg. Attendance"
                value={`${attendancePercent}%`}
                trend="Stable"
                icon={<Icons.Chart />}
                color="#10b981"
                bg="#ecfdf5"
              />
              <StatCard
                label="Current Subject"
                value={isPracticalSubject ? "Practical" : "Theory"}
                trend={selectedSubject.substring(0, 15) + "..."}
                icon={<Icons.Book />}
                color="#f59e0b"
                bg="#fffbeb"
              />
            </div>

            {/* CHARTS ROW */}
            <div style={styles.splitSection}>
              {/* ATTENDANCE CHART */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3>Attendance Overview</h3>
                </div>
                <div style={styles.chartContainer}>
                  {[65, 80, 45, 90, 75, 60, 85].map((h, i) => (
                    <div key={i} style={styles.barWrapper}>
                      <div style={{ ...styles.bar, height: `${h}%` }}></div>
                      <span style={styles.barLabel}>
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIMELINE */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3>Upcoming Classes</h3>
                </div>
                <div style={styles.timeline}>
                  <TimelineItem
                    time="10:00 AM"
                    title={selectedSubject}
                    desc="Lecture Hall A"
                    active
                  />
                  <TimelineItem
                    time="02:00 PM"
                    title="Faculty Meeting"
                    desc="Conference Room"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📝 ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h3>Mark Attendance</h3>
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
                Save Attendance
              </button>
            </div>
          </div>
        )}

        {/* 🎓 GRADEBOOK TAB */}
        {activeTab === "marks" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h3>Gradebook: {selectedSubject}</h3>
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
                            <small style={{ color: "#6b7280" }}>{s.roll}</small>
                          </td>
                          {["minor", "major", "assign", "quiz"].map((type) => (
                            <td key={type} style={styles.td}>
                              <input
                                type="number"
                                placeholder="0"
                                style={styles.markInput}
                                value={marks[s._id]?.[type]}
                                onChange={(e) =>
                                  handleMarkChange(s._id, type, e.target.value)
                                }
                              />
                            </td>
                          ))}
                          {isPracticalSubject && (
                            <td style={styles.td}>
                              <input
                                type="number"
                                placeholder="0"
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
                                color: "#fff",
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
                Upload Marks
              </button>
              {message && <div style={styles.successMsg}>{message}</div>}
            </div>
          </div>
        )}

        {/* 👥 STUDENTS TAB */}
        {activeTab === "students" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3>Enrolled Students</h3>
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
    {icon}
    <span style={{ marginLeft: "12px" }}>{label}</span>
  </div>
);

const StatCard = ({ label, value, trend, icon, color, bg }) => (
  <div style={styles.statCard}>
    <div style={styles.statInfo}>
      <span style={styles.statLabel}>{label}</span>
      <h3 style={styles.statValue}>{value}</h3>
      <span style={{ ...styles.statTrend, color: color }}>{trend}</span>
    </div>
    <div style={{ ...styles.statIcon, color: color, backgroundColor: bg }}>
      {icon}
    </div>
  </div>
);

const TimelineItem = ({ time, title, desc, active }) => (
  <div style={styles.timelineItem}>
    <div style={styles.timelineLeft}>
      <div
        style={{
          ...styles.timelineDot,
          ...(active ? { background: "#3b82f6", border: "none" } : {}),
        }}
      ></div>
      {active && <div style={styles.timelineLine}></div>}
    </div>
    <div style={styles.timelineContent}>
      <span style={styles.time}>{time}</span>
      <h4 style={styles.timelineTitle}>{title}</h4>
      <p style={styles.timelineDesc}>{desc}</p>
    </div>
  </div>
);

/* 🎨 STYLES */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f3f4f6",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
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
    height: "100%",
    zIndex: 100,
    transition: "transform 0.3s ease",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
    paddingLeft: "10px",
  },
  brandIcon: {
    width: "32px",
    height: "32px",
    background: "#3b82f6",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  brandText: { fontSize: "18px", fontWeight: "600", margin: 0 },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: "10px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#9ca3af",
    transition: "all 0.2s",
  },
  navItemActive: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#60a5fa",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 15px",
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

  // MAIN AREA
  main: {
    flex: 1,
    marginLeft: "260px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    "@media (max-width: 768px)": { marginLeft: 0 },
  },
  header: {
    height: "70px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
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
    display: "none",
    "@media (max-width: 768px)": { display: "block" },
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  headerRight: { display: "flex", alignItems: "center", gap: "20px" },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: "8px 15px",
    borderRadius: "20px",
    color: "#6b7280",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    outline: "none",
    marginLeft: "8px",
    fontSize: "14px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderLeft: "1px solid #e5e7eb",
    paddingLeft: "20px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
  },
  profileInfo: { display: "flex", flexDirection: "column" },
  profileName: { fontSize: "14px", fontWeight: "600", color: "#1f2937" },
  profileRole: { fontSize: "11px", color: "#6b7280" },

  // CONTENT & DASHBOARD
  content: { padding: "30px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    border: "1px solid #f3f4f6",
  },
  statInfo: { display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "13px", color: "#6b7280", marginBottom: "5px" },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 5px 0",
  },
  statTrend: { fontSize: "12px", fontWeight: "500" },
  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  splitSection: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    "@media (max-width: 1024px)": { gridTemplateColumns: "1fr" },
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    border: "1px solid #f3f4f6",
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
    flexWrap: "wrap",
    gap: "10px",
  },

  // CHARTS & TIMELINE
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
  timeline: { display: "flex", flexDirection: "column", gap: "20px" },
  timelineItem: { display: "flex", gap: "15px" },
  timelineLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  timelineDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    zIndex: 2,
  },
  timelineLine: {
    width: "2px",
    flex: 1,
    backgroundColor: "#e5e7eb",
    marginTop: "5px",
  },
  timelineContent: { paddingBottom: "10px" },
  time: { fontSize: "11px", color: "#9ca3af", fontWeight: "600" },
  timelineTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "2px 0",
  },
  timelineDesc: { fontSize: "12px", color: "#6b7280", margin: 0 },

  // CONTROLS & TABLES
  controls: { display: "flex", gap: "10px" },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    outline: "none",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    outline: "none",
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
  smallBtn: {
    padding: "6px 12px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    color: "#4b5563",
  },
  primaryBtn: {
    padding: "12px 20px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    width: "100%",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px",
  },

  // ATTENDANCE GRID
  gridList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
  },
  studentCardPresent: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #10b981",
    background: "#ecfdf5",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  studentCardAbsent: {
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ef4444",
    background: "#fef2f2",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    opacity: 0.8,
  },
  avatarList: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "12px",
    color: "#4b5563",
  },

  // TABLE
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  trHead: {
    background: "#f9fafb",
    textAlign: "left",
    color: "#6b7280",
    fontSize: "13px",
  },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: {
    padding: "15px",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#374151",
  },
  markInput: {
    width: "60px",
    padding: "8px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    outline: "none",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  successMsg: {
    padding: "10px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: "6px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default TeacherDash;
