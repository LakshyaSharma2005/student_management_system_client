import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🎓 ENTERPRISE COURSE LIST
const COURSE_OPTIONS = [
  "BCA (General)",
  "BCA (Data Science)",
  "BCA (AI & ML)",
  "BCA (Cloud Computing)",
  "BCA (Cybersecurity)",
  "B.Tech (CSE)",
  "B.Tech (IT)",
  "B.Tech (ECE)",
  "B.Tech (Mechanical)",
  "B.Tech (Civil)",
  "B.Tech (Aerospace)",
  "B.Sc (IT)",
  "B.Sc (Computer Science)",
  "B.Sc (Physics)",
  "B.Sc (Chemistry)",
  "B.Sc (Biotech)",
  "M.Sc (Computer Science)",
  "M.Sc (Mathematics)",
  "MCA",
  "M.Tech (CSE)",
  "BBA (General)",
  "BBA (Digital Marketing)",
  "MBA (Marketing)",
  "MBA (Finance)",
  "MBA (HR)",
  "MBA (Int. Business)",
  "B.Pharma",
  "M.Pharma",
  "D.Pharma",
  "LLB",
  "BA (LLB)",
  "LLM",
  "BA (Psychology)",
  "BA (Economics)",
  "BA (English)",
  "MA (Political Science)",
];

const AdminDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // RESPONSIVE STATES (Auto-collapse on smaller screens)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 900);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // --- DATA STATES ---
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "End Semester Examination Schedule",
      date: "2025-12-15",
      type: "Urgent",
    },
    {
      id: 2,
      title: "Winter Vacation & Campus Closure",
      date: "2025-12-18",
      type: "General",
    },
  ]);

  const [settings, setSettings] = useState({
    instituteName: "AdminOS University",
    session: "2025-2026",
    maintenance: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    subject: "",
    fees: "Pending",
  });

  // 🔄 RESIZE HANDLER
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔄 FETCH DATA
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const sRes = await axios.get(`${SERVER_URL}/api/admin/students`, {
        headers: { Authorization: token },
      });
      const tRes = await axios.get(`${SERVER_URL}/api/admin/teachers`, {
        headers: { Authorization: token },
      });

      if (sRes.data) setStudents(sRes.data);
      if (tRes.data) setTeachers(tRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [SERVER_URL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [navigate, fetchData]);

  // 📝 HANDLERS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        alert(`✏️ Details updated successfully!`);
        setIsEditing(null);
      } else {
        const payload = {
          ...formData,
          password: formData.password || "123456",
          role: activeTab === "students" ? "Student" : "Teacher",
        };
        await axios.post(`${SERVER_URL}/api/auth/register`, payload, {
          headers: { Authorization: token },
        });
        alert(`✅ User Created Successfully!`);
        fetchData();
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        course: "",
        subject: "",
        fees: "Pending",
      });
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleEdit = (user) => {
    setIsEditing(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      course: user.course || "",
      subject: user.subject || "",
      fees: user.fees || "Pending",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${SERVER_URL}/api/admin/delete/${id}`, {
        headers: { Authorization: token },
      });
      if (type === "students")
        setStudents(students.filter((s) => s._id !== id));
      if (type === "teachers")
        setTeachers(teachers.filter((t) => t._id !== id));
      if (type === "notices") setNotices(notices.filter((n) => n.id !== id));
      alert("🗑️ Record Removed");
    } catch (err) {
      alert("❌ Delete Failed");
    }
  };

  const getDataToDisplay = () => {
    const list = activeTab === "students" ? students : teachers;
    return list.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const totalRevenue = students.filter((s) => s.fees === "Paid").length * 28000;
  const pendingFees = students.filter((s) => s.fees === "Pending").length;

  return (
    <div style={styles.container}>
      {/* 🌑 SIDEBAR (FIXED LAYOUT) */}
      <div
        style={{
          ...styles.sidebar,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* 1. Header (Logo) - Fixed at top */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>⚡</div>
          <h2 style={styles.logoText}>
            Admin <span style={{ color: "#3b82f6" }}>Panel</span>
          </h2>
        </div>

        {/* 2. Menu (Scrollable) - Takes remaining space */}
        <div style={styles.scrollableMenu}>
          <div style={styles.menuGroup}>
            <p style={styles.menuLabel}>DASHBOARD</p>
            <NavBtn
              icon="📊"
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => {
                setActiveTab("overview");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
            <NavBtn
              icon="📢"
              label="Announcements"
              active={activeTab === "notices"}
              onClick={() => {
                setActiveTab("notices");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
          </div>

          <div style={styles.menuGroup}>
            <p style={styles.menuLabel}>ACADEMIC</p>
            <NavBtn
              icon="👨‍🎓"
              label="Students"
              active={activeTab === "students"}
              onClick={() => {
                setActiveTab("students");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
            <NavBtn
              icon="👨‍🏫"
              label="Faculty"
              active={activeTab === "teachers"}
              onClick={() => {
                setActiveTab("teachers");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
            <NavBtn
              icon="💳"
              label="Finance"
              active={activeTab === "finance"}
              onClick={() => {
                setActiveTab("finance");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
          </div>

          <div style={styles.menuGroup}>
            <p style={styles.menuLabel}>ADMINISTRATION</p>
            <NavBtn
              icon="⚙️"
              label="Settings"
              active={activeTab === "settings"}
              onClick={() => {
                setActiveTab("settings");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>

        {/* 3. Footer (Sign Out) - Fixed at bottom */}
        <div style={styles.sidebarFooter}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            style={styles.logoutBtn}
          >
            ↪ Sign Out
          </button>
        </div>
      </div>

      {/* 🌑 MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={styles.mobileOverlay}
        ></div>
      )}

      {/* ⚪ MAIN CONTENT */}
      <div
        style={{
          ...styles.content,
          marginLeft: !isMobile && isSidebarOpen ? "280px" : "0", // Correct margin logic
        }}
      >
        {/* TOP HEADER */}
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={styles.hamburgerBtn}
            >
              ☰
            </button>
            <h2 style={styles.pageTitle}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input
                placeholder="Search records..."
                style={styles.headerSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={styles.profileBadge}>
              <div style={styles.avatar}>A</div>
              {!isMobile && <span style={styles.profileName}>Admin</span>}
            </div>
          </div>
        </div>

        {/* 1️⃣ OVERVIEW */}
        {activeTab === "overview" && (
          <div style={styles.fadeProps}>
            <div style={styles.statGrid}>
              <StatCard
                title="Total Enrolled"
                value={students.length}
                icon="👥"
                color="#3b82f6"
                trend="+12% this week"
              />
              <StatCard
                title="Active Faculty"
                value={teachers.length}
                icon="👨‍🏫"
                color="#10b981"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${(totalRevenue / 1000).toFixed(1)}k`}
                icon="💰"
                color="#8b5cf6"
              />
              <StatCard
                title="Pending Dues"
                value={pendingFees}
                icon="⚠️"
                color="#ef4444"
              />
            </div>

            <div style={styles.splitGrid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>📈 Enrollment</h3>
                <div style={styles.chartContainer}>
                  {[45, 72, 58, 90, 65, 80, 55].map((h, i) => (
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
                <h3 style={styles.cardTitle}>🕒 Activity Log</h3>
                <div style={styles.timeline}>
                  <TimelineItem
                    time="10:42 AM"
                    title="New Student"
                    desc="Gaurav Gochar enrolled"
                    color="#3b82f6"
                  />
                  <TimelineItem
                    time="11:15 AM"
                    title="Fee Received"
                    desc="₹28,000 processed"
                    color="#10b981"
                  />
                  <TimelineItem
                    time="01:30 PM"
                    title="System Backup"
                    desc="Backup completed"
                    color="#64748b"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ STUDENTS & TEACHERS */}
        {(activeTab === "students" || activeTab === "teachers") && (
          <div style={styles.responsiveRow}>
            {/* FORM */}
            <div style={styles.formCard}>
              <h3 style={styles.cardTitle}>
                {isEditing ? "✏️ Edit" : "➕ Add New"}
              </h3>
              <form onSubmit={handleSubmit} style={styles.form}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                {!isEditing && (
                  <input
                    style={styles.input}
                    type="password"
                    placeholder="Pass: 123456"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                )}

                {activeTab === "students" ? (
                  <>
                    <select
                      style={styles.select}
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Course...</option>
                      {COURSE_OPTIONS.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <select
                      style={styles.select}
                      value={formData.fees}
                      onChange={(e) =>
                        setFormData({ ...formData, fees: e.target.value })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </>
                ) : (
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                )}

                <div style={styles.formActions}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={styles.primaryBtn}
                  >
                    {loading ? "..." : "Save"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(null);
                        setFormData({
                          name: "",
                          email: "",
                          password: "",
                          course: "",
                          subject: "",
                          fees: "Pending",
                        });
                      }}
                      style={styles.secondaryBtn}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* TABLE */}
            <div style={styles.tableCard}>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th>Name</th>
                      {!isMobile && <th>Email</th>}
                      <th>Details</th>
                      {activeTab === "students" && <th>Fees</th>}
                      <th>Act</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDataToDisplay().map((user) => (
                      <tr key={user._id} style={styles.tr}>
                        <td style={styles.td}>
                          <b>{user.name}</b>
                        </td>
                        {!isMobile && <td style={styles.td}>{user.email}</td>}
                        <td style={styles.td}>
                          <span style={styles.badge}>
                            {user.course || user.subject || "N/A"}
                          </span>
                        </td>
                        {activeTab === "students" && (
                          <td style={styles.td}>
                            <span
                              style={
                                user.fees === "Paid"
                                  ? styles.statusSuccess
                                  : styles.statusWarning
                              }
                            >
                              {user.fees}
                            </span>
                          </td>
                        )}
                        <td style={styles.td}>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <button
                              onClick={() => handleEdit(user)}
                              style={styles.iconAction}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(user._id, activeTab)}
                              style={{ ...styles.iconAction, color: "#ef4444" }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3️⃣ FINANCE */}
        {activeTab === "finance" && (
          <div style={styles.tableCard}>
            <h3 style={styles.cardTitle}>Financial Overview</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Dues</th>
                    <th>Status</th>
                    <th>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} style={styles.tr}>
                      <td style={styles.td}>
                        <b>{s.name}</b>
                      </td>
                      <td style={styles.td}>{s.course}</td>
                      <td style={styles.td}>₹28k</td>
                      <td style={styles.td}>
                        <span
                          style={
                            s.fees === "Paid"
                              ? styles.statusSuccess
                              : styles.statusWarning
                          }
                        >
                          {s.fees}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {s.fees === "Pending" ? (
                          <button style={styles.secondaryBtnSm}>🔔</button>
                        ) : (
                          <button style={styles.successBtnSm}>⬇</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4️⃣ NOTICES & SETTINGS */}
        {(activeTab === "notices" || activeTab === "settings") && (
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>
              {activeTab === "notices" ? "Notice Board" : "Settings"}
            </h3>
            {activeTab === "notices" ? (
              <div>
                {notices.map((n) => (
                  <div key={n.id} style={styles.noticeItem}>
                    <div>
                      <b>{n.title}</b>
                      <br />
                      <small>{n.date}</small>
                    </div>
                    <button
                      onClick={() => handleDelete(n.id, "notices")}
                      style={styles.iconAction}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button
                  style={{ ...styles.primaryBtn, marginTop: "15px" }}
                  onClick={() => {
                    const title = prompt("Enter Notice Title:");
                    if (title)
                      setNotices([
                        ...notices,
                        {
                          id: Date.now(),
                          title,
                          date: new Date().toISOString().split("T")[0],
                          type: "General",
                        },
                      ]);
                  }}
                >
                  + Add Notice
                </button>
              </div>
            ) : (
              <div style={styles.form}>
                <label style={styles.label}>Institute Name</label>
                <input
                  style={styles.input}
                  value={settings.instituteName}
                  onChange={(e) =>
                    setSettings({ ...settings, instituteName: e.target.value })
                  }
                />
                <label style={styles.label}>Maintenance Mode</label>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      maintenance: !settings.maintenance,
                    })
                  }
                  style={
                    settings.maintenance
                      ? styles.statusWarning
                      : styles.statusSuccess
                  }
                >
                  {settings.maintenance ? "🔴 Active" : "🟢 Inactive"}
                </button>
                <button
                  style={{ ...styles.primaryBtn, marginTop: "20px" }}
                  onClick={() => alert("Saved!")}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 🧩 COMPONENTS
const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    style={active ? styles.navBtnActive : styles.navBtn}
    onClick={onClick}
  >
    <span style={{ marginRight: "12px", fontSize: "18px" }}>{icon}</span>{" "}
    {label}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
    <div>
      <p style={styles.statTitle}>{title}</p>
      <h3 style={styles.statValue}>{value}</h3>
    </div>
    <div style={{ ...styles.statIcon, color: color }}>{icon}</div>
  </div>
);

const TimelineItem = ({ time, title, desc, color }) => (
  <div style={styles.timelineItem}>
    <div style={{ ...styles.timelineDot, borderColor: color }}></div>
    <div>
      <p style={styles.timelineTime}>{time}</p>
      <h5 style={styles.timelineTitle}>{title}</h5>
      <p style={styles.timelineDesc}>{desc}</p>
    </div>
  </div>
);

// 💅 STYLES
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "'Inter', sans-serif",
    overflowX: "hidden",
  },

  // 🟢 SIDEBAR (FIXED FLEX LAYOUT)
  sidebar: {
    width: "280px",
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    display: "flex",
    flexDirection: "column", // Stack items vertically
    borderRight: "1px solid #334155",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0, // Full height fixed
    zIndex: 2000,
    transition: "transform 0.3s ease",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
  },

  // 🟢 SCROLLABLE MENU (Takes all available space)
  scrollableMenu: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    scrollbarWidth: "thin", // For Firefox
  },

  // 🟢 FIXED FOOTER (Stays at bottom)
  sidebarFooter: {
    padding: "20px",
    borderTop: "1px solid #334155",
    backgroundColor: "#1e293b", // Matches sidebar bg
    flexShrink: 0, // Prevents shrinking
  },

  mobileOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1900,
  },

  // 🟢 MAIN CONTENT (Margin adjusts based on sidebar)
  content: {
    flex: 1,
    padding: "20px",
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
    width: "100%",
  },

  // Elements
  logoContainer: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid #334155",
    flexShrink: 0,
  },
  logoIcon: { fontSize: "24px" },
  logoText: { fontSize: "18px", fontWeight: "700", margin: 0 },
  menuGroup: { marginBottom: "20px" },
  menuLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  navBtn: {
    width: "100%",
    textAlign: "left",
    padding: "12px",
    background: "transparent",
    color: "#cbd5e1",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  navBtnActive: {
    width: "100%",
    textAlign: "left",
    padding: "12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    background: "#334155",
    color: "#f8fafc",
    border: "1px solid #475569",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "15px",
  },
  hamburgerBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#334155",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flex: 1,
    justifyContent: "flex-end",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "white",
    padding: "8px 15px",
    borderRadius: "50px",
    border: "1px solid #e2e8f0",
    maxWidth: "250px",
    width: "100%",
  },
  headerSearch: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    marginLeft: "10px",
    width: "100%",
  },
  profileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "white",
    padding: "5px",
    borderRadius: "50px",
    border: "1px solid #e2e8f0",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#3b82f6",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "12px",
  },
  profileName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#0f172a",
    paddingRight: "10px",
  },

  // Grid & Cards
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },
  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    margin: 0,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "5px 0 0 0",
  },
  statIcon: { fontSize: "24px", opacity: 0.8 },

  splitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  responsiveRow: { display: "flex", flexDirection: "column", gap: "25px" },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "20px",
  },

  // Charts
  chartContainer: {
    height: "150px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    width: "10%",
  },
  bar: { width: "100%", background: "#3b82f6", borderRadius: "4px 4px 0 0" },
  barLabel: { marginTop: "5px", fontSize: "10px", color: "#64748b" },

  // Timeline
  timeline: {
    paddingLeft: "10px",
    borderLeft: "2px solid #e2e8f0",
    marginLeft: "5px",
  },
  timelineItem: {
    position: "relative",
    paddingLeft: "20px",
    marginBottom: "20px",
  },
  timelineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "white",
    border: "3px solid",
    position: "absolute",
    left: "-6px",
    top: "2px",
  },
  timelineTime: { fontSize: "10px", fontWeight: "600", color: "#94a3b8" },
  timelineTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    margin: 0,
  },
  timelineDesc: { fontSize: "12px", color: "#64748b", margin: 0 },

  // Forms
  formCard: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    background: "white",
  },
  formActions: { display: "flex", gap: "10px" },
  primaryBtn: {
    padding: "12px",
    background: "#0f172a",
    color: "white",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
  secondaryBtn: {
    padding: "12px",
    background: "white",
    color: "#475569",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },

  // Tables
  tableCard: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "500px" },
  trHead: { background: "#f8f9fa", textAlign: "left" },
  tr: { borderBottom: "1px solid #f1f2f6" },
  td: {
    padding: "12px 15px",
    fontSize: "14px",
    color: "#334155",
    verticalAlign: "middle",
  },
  userCell: { display: "flex", alignItems: "center", gap: "10px" },
  userAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#64748b",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "700",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "600",
    border: "1px solid #e2e8f0",
  },
  statusSuccess: {
    padding: "4px 8px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "11px",
    fontWeight: "600",
  },
  statusWarning: {
    padding: "4px 8px",
    borderRadius: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "11px",
    fontWeight: "600",
  },
  iconAction: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "5px",
  },

  secondaryBtnSm: {
    padding: "5px 10px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
  successBtnSm: {
    padding: "5px 10px",
    background: "#f0fdf4",
    border: "1px solid #dcfce7",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#166534",
  },
  noticeItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    display: "block",
    marginBottom: "5px",
  },
};

export default AdminDash;
