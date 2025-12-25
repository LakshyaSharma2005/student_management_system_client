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
      // Initialize all new fields
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

  // 🧠 CALCULATION LOGIC
  const getStudentStats = (id) => {
    const sMarks = marks[id] || {};

    // Parse inputs (default to 0)
    const minor = Number(sMarks.minor || 0);
    const major = Number(sMarks.major || 0);
    const assign = Number(sMarks.assign || 0);
    const quiz = Number(sMarks.quiz || 0);
    const practical = isPracticalSubject ? Number(sMarks.practical || 0) : 0;

    const total = minor + major + assign + quiz + practical;

    // Passing Criteria
    const passingMarks = isPracticalSubject ? 60 : 40;
    const maxMarks = isPracticalSubject ? 150 : 100;

    let status = "Pass";
    let statusColor = "#27ae60"; // Green

    if (total < passingMarks) {
      const shortfall = passingMarks - total;
      if (shortfall <= 5) {
        status = "Re-Major";
        statusColor = "#f39c12"; // Orange (Close call)
      } else {
        status = "Summer";
        statusColor = "#e74c3c"; // Red (Fail)
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
          👨‍🏫 Faculty<span style={{ color: "#f1c40f" }}>Portal</span>
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
            icon="🎓"
            label="Gradebook"
            active={activeTab === "marks"}
            onClick={() => {
              setActiveTab("marks");
              if (isMobile) setIsSidebarOpen(false);
            }}
          />
          <NavBtn
            icon="👥"
            label="Students"
            active={activeTab === "students"}
            onClick={() => {
              setActiveTab("students");
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
            <div style={styles.avatarNav}>{teacher.name.charAt(0)}</div>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div style={styles.grid}>
            <div style={styles.welcomeCard}>
              <div style={styles.welcomeText}>
                <h1>Welcome back, {teacher.name}! 👋</h1>
                <p>
                  Subject: <b>{selectedSubject}</b>
                </p>
              </div>
            </div>

            <div style={styles.statsRow}>
              <StatCard
                title="Total Students"
                value={students.length}
                color="#3498db"
              />
              <StatCard
                title="Avg. Attendance"
                value={`${attendancePercent}%`}
                color="#2ecc71"
              />
              <StatCard
                title="Subject Type"
                value={
                  isPracticalSubject ? "Practical + Theory" : "Theory Only"
                }
                sub={selectedSubject.substring(0, 20) + "..."}
                color="#9b59b6"
              />
            </div>

            <div style={styles.card}>
              <h3>📢 Quick Actions</h3>
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
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === "attendance" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
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
                  {SUBJECT_LIST.map((sub, index) => (
                    <option key={index} value={sub}>
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
                <strong style={{ color: "#27ae60" }}>
                  {presentCount} Present
                </strong>{" "}
                /{" "}
                <strong style={{ color: "#c0392b" }}>
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
                    background: "#fee",
                    color: "red",
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
                  <div style={styles.avatar}>
                    {s.name ? s.name.charAt(0) : "S"}
                  </div>
                  <div>
                    <strong>{s.name}</strong>
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      {s.roll || "ID: --"}
                    </p>
                  </div>
                  <div style={styles.statusBadge}>{attendance[s._id]}</div>
                </div>
              ))}
            </div>
            <button onClick={submitAttendance} style={styles.submitBtn}>
              Save Attendance 💾
            </button>
          </div>
        )}

        {/* GRADEBOOK TAB */}
        {activeTab === "marks" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>🎓 Gradebook: {selectedSubject}</h3>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={styles.select}
              >
                {SUBJECT_LIST.map((sub, index) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th>Name</th>
                    <th>Minor (20)</th>
                    <th>Major (60)</th>
                    <th>Assign (10)</th>
                    <th>Quiz (10)</th>
                    {isPracticalSubject && (
                      <th style={{ background: "#e8f6fd" }}>Practical (50)</th>
                    )}
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
                            placeholder="0"
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
                            placeholder="0"
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
                            placeholder="0"
                            style={styles.markInput}
                            value={marks[s._id]?.assign}
                            onChange={(e) =>
                              handleMarkChange(s._id, "assign", e.target.value)
                            }
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            placeholder="0"
                            style={styles.markInput}
                            value={marks[s._id]?.quiz}
                            onChange={(e) =>
                              handleMarkChange(s._id, "quiz", e.target.value)
                            }
                          />
                        </td>
                        {isPracticalSubject && (
                          <td style={{ ...styles.td, background: "#f4faff" }}>
                            <input
                              type="number"
                              placeholder="0"
                              style={{
                                ...styles.markInput,
                                borderColor: "#3498db",
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
                              ...styles.gradeBadge,
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
              style={styles.submitBtn}
            >
              Upload Marks 🚀
            </button>
            {message && <div style={styles.successMsg}>{message}</div>}
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
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

const StatCard = ({ title, value, sub, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <h3>{value}</h3> <p>{title}</p>
    {sub && (
      <small style={{ color: color, fontWeight: "bold", fontSize: "11px" }}>
        {sub}
      </small>
    )}
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
    zIndex: 100,
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
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
    marginBottom: "10px",
  },
  welcomeText: { marginBottom: "10px" },
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

  // CARDS & LISTS
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
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  actionBtn: {
    display: "block",
    width: "100%",
    padding: "15px",
    marginBottom: "10px",
    background: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: "bold",
    color: "#2c3e50",
    transition: "0.2s",
  },
  controls: { display: "flex", gap: "10px", flexWrap: "wrap" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #ddd" },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minWidth: "200px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8f9fa",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  smallBtn: {
    padding: "6px 12px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  // GRID LIST (Attendance)
  gridList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  studentCardPresent: {
    padding: "15px",
    borderRadius: "8px",
    border: "2px solid #2ecc71",
    background: "#f0fff4",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    textAlign: "center",
  },
  studentCardAbsent: {
    padding: "15px",
    borderRadius: "8px",
    border: "2px solid #e74c3c",
    background: "#fff5f5",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    textAlign: "center",
    opacity: 0.8,
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#dfe6e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  statusBadge: {
    fontSize: "12px",
    fontWeight: "bold",
    padding: "2px 8px",
    borderRadius: "4px",
    background: "rgba(0,0,0,0.1)",
  },

  // TABLE
  tableWrap: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    minWidth: "600px",
  },
  trHead: { background: "#f8f9fa", textAlign: "left" },
  tr: { borderBottom: "1px solid #f1f2f6" },
  td: { padding: "12px", verticalAlign: "middle" },
  markInput: {
    width: "50px",
    padding: "5px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  gradeBadge: {
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    minWidth: "70px",
    display: "inline-block",
    textAlign: "center",
  },

  submitBtn: {
    padding: "15px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    width: "100%",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  successMsg: {
    padding: "10px",
    background: "#d4edda",
    color: "#155724",
    borderRadius: "6px",
    marginBottom: "20px",
    textAlign: "center",
  },
};

export default TeacherDash;
