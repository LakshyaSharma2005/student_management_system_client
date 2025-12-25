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

  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // --- STATES ---
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
    {
      id: 3,
      title: "Faculty Meeting: Curriculum Review",
      date: "2025-12-22",
      type: "Meeting",
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

  // 📝 HANDLERS (Logic Unchanged)
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
    if (!window.confirm("Confirm deletion? This action is irreversible."))
      return;
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
      {/* 🌑 PROFESSIONAL SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🎓</div>
          <h2 style={styles.logoText}>
            {settings.instituteName.split(" ")[0]}
            <span style={{ color: "#3b82f6" }}>Admin</span>
          </h2>
        </div>

        <div style={styles.menuGroup}>
          <p style={styles.menuLabel}>DASHBOARD</p>
          <NavBtn
            icon="📊"
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <NavBtn
            icon="📢"
            label="Announcements"
            active={activeTab === "notices"}
            onClick={() => setActiveTab("notices")}
          />
        </div>

        <div style={styles.menuGroup}>
          <p style={styles.menuLabel}>ACADEMIC</p>
          <NavBtn
            icon="👨‍🎓"
            label="Students"
            active={activeTab === "students"}
            onClick={() => setActiveTab("students")}
          />
          <NavBtn
            icon="👨‍🏫"
            label="Faculty"
            active={activeTab === "teachers"}
            onClick={() => setActiveTab("teachers")}
          />
          <NavBtn
            icon="💳"
            label="Finance"
            active={activeTab === "finance"}
            onClick={() => setActiveTab("finance")}
          />
        </div>

        <div style={styles.menuGroup}>
          <p style={styles.menuLabel}>ADMINISTRATION</p>
          <NavBtn
            icon="⚙️"
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>

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

      {/* ⚪ MAIN CONTENT */}
      <div style={styles.content}>
        {/* TOP HEADER */}
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <div style={styles.headerActions}>
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input
                placeholder="Search records..."
                style={styles.headerSearch}
              />
            </div>
            <div style={styles.iconBtn}>🔔</div>
            <div style={styles.profileBadge}>
              <div style={styles.avatar}>AD</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={styles.profileName}>Admin User</span>
                <span style={styles.profileRole}>Super Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1️⃣ OVERVIEW TAB */}
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
                trend="Stable"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${(totalRevenue / 1000).toFixed(1)}k`}
                icon="💰"
                color="#8b5cf6"
                trend="+5% vs last mo"
              />
              <StatCard
                title="Pending Dues"
                value={pendingFees}
                icon="⚠️"
                color="#ef4444"
                trend="Action Required"
              />
            </div>

            <div style={styles.splitGrid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>📈 Enrollment Trends</h3>
                <div style={styles.chartContainer}>
                  {/* CSS Bar Chart */}
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
                <h3 style={styles.cardTitle}>🕒 System Audit Log</h3>
                <div style={styles.timeline}>
                  <TimelineItem
                    time="10:42 AM"
                    title="New Student Registration"
                    desc="Gaurav Gochar enrolled in BCA (DS)"
                    color="#3b82f6"
                  />
                  <TimelineItem
                    time="11:15 AM"
                    title="Fee Payment Received"
                    desc="₹28,000 processed via Gateway"
                    color="#10b981"
                  />
                  <TimelineItem
                    time="01:30 PM"
                    title="System Backup"
                    desc="Automated backup completed successfully"
                    color="#64748b"
                  />
                  <TimelineItem
                    time="03:45 PM"
                    title="Notice Published"
                    desc="'Winter Vacation' posted to portal"
                    color="#f59e0b"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2️⃣ STUDENTS & TEACHERS */}
        {(activeTab === "students" || activeTab === "teachers") && (
          <div
            style={{
              ...styles.fadeProps,
              display: "flex",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {/* LEFT: FORM */}
            <div style={styles.formCard}>
              <h3 style={styles.cardTitle}>
                {isEditing
                  ? "✏️ Edit Record"
                  : `➕ Add ${
                      activeTab === "students" ? "Student" : "Faculty"
                    }`}
              </h3>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    style={styles.input}
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                {!isEditing && (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                      style={styles.input}
                      type="password"
                      placeholder="Default: 123456"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                )}

                {activeTab === "students" ? (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Course / Branch</label>
                      <select
                        style={styles.select}
                        value={formData.course}
                        onChange={(e) =>
                          setFormData({ ...formData, course: e.target.value })
                        }
                        required
                      >
                        <option value="">Select Specialization...</option>
                        {COURSE_OPTIONS.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Fee Status</label>
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
                    </div>
                  </>
                ) : (
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Specialization Subject</label>
                    <input
                      style={styles.input}
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>
                )}

                <div style={styles.formActions}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={styles.primaryBtn}
                  >
                    {loading
                      ? "Processing..."
                      : isEditing
                      ? "Update"
                      : "Create Record"}
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

            {/* RIGHT: TABLE */}
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h3 style={styles.cardTitle}>Directory</h3>
                <input
                  style={styles.searchInput}
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>{activeTab === "students" ? "Course" : "Subject"}</th>
                      {activeTab === "students" && <th>Fees</th>}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDataToDisplay().map((user) => (
                      <tr key={user._id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.userCell}>
                            <div style={styles.userAvatar}>
                              {user.name.charAt(0)}
                            </div>
                            <span style={styles.userName}>{user.name}</span>
                          </div>
                        </td>
                        <td style={styles.td}>{user.email}</td>
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
                          <button
                            onClick={() => handleEdit(user)}
                            style={styles.iconAction}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, activeTab)}
                            style={{ ...styles.iconAction, color: "#ef4444" }}
                            title="Delete"
                          >
                            🗑️
                          </button>
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
                    <td style={styles.td}>{s.course || "N/A"}</td>
                    <td style={styles.td}>₹28,000</td>
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
                        <button
                          style={styles.secondaryBtnSm}
                          onClick={() => alert("Reminder Sent!")}
                        >
                          🔔 Send Reminder
                        </button>
                      ) : (
                        <button style={styles.successBtnSm}>⬇ Download</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4️⃣ NOTICES */}
        {activeTab === "notices" && (
          <div
            style={{
              ...styles.fadeProps,
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "20px",
            }}
          >
            <div style={styles.formCard}>
              <h3 style={styles.cardTitle}>📢 Publish Announcement</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotices([
                    ...notices,
                    {
                      id: Date.now(),
                      title: formData.name,
                      date: new Date().toISOString().split("T")[0],
                      type: "General",
                    },
                  ]);
                  setFormData({ ...formData, name: "" });
                }}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Notice Content</label>
                  <textarea
                    rows="4"
                    style={styles.textarea}
                    placeholder="Enter notice details..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" style={styles.primaryBtn}>
                  Publish to Portal
                </button>
              </form>
            </div>
            <div style={styles.tableCard}>
              <h3 style={styles.cardTitle}>Notice Board</h3>
              <div style={styles.noticeList}>
                {notices.map((n) => (
                  <div key={n.id} style={styles.noticeItem}>
                    <div style={styles.noticeIcon}>📢</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={styles.noticeTitle}>{n.title}</h4>
                      <p style={styles.noticeMeta}>
                        {n.date} • <span style={styles.badge}>{n.type}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(n.id, "notices")}
                      style={styles.iconAction}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5️⃣ SETTINGS */}
        {activeTab === "settings" && (
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>⚙️ Global Configuration</h3>
            <div style={styles.settingsGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Institute Name</label>
                <input
                  style={styles.input}
                  value={settings.instituteName}
                  onChange={(e) =>
                    setSettings({ ...settings, instituteName: e.target.value })
                  }
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Current Academic Session</label>
                <input
                  style={styles.input}
                  value={settings.session}
                  onChange={(e) =>
                    setSettings({ ...settings, session: e.target.value })
                  }
                />
              </div>

              <div style={styles.toggleRow}>
                <div>
                  <h4 style={styles.settingTitle}>Maintenance Mode</h4>
                  <p style={styles.settingDesc}>
                    Suspend all student/faculty access immediately.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      maintenance: !settings.maintenance,
                    })
                  }
                  style={
                    settings.maintenance ? styles.toggleOn : styles.toggleOff
                  }
                >
                  <div
                    style={
                      settings.maintenance
                        ? styles.toggleKnobOn
                        : styles.toggleKnobOff
                    }
                  ></div>
                </button>
              </div>

              <div style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
                <button
                  style={styles.primaryBtn}
                  onClick={() => alert("Settings Saved!")}
                >
                  Save Configuration
                </button>
              </div>
            </div>
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
    <span style={{ marginRight: "12px" }}>{icon}</span> {label}
  </button>
);

const StatCard = ({ title, value, icon, color, trend }) => (
  <div style={styles.statCard}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
      }}
    >
      <div>
        <p style={styles.statTitle}>{title}</p>
        <h3 style={styles.statValue}>{value}</h3>
        <p
          style={{
            ...styles.statTrend,
            color: trend.includes("+") ? "#10b981" : "#64748b",
          }}
        >
          {trend}
        </p>
      </div>
      <div
        style={{
          ...styles.statIcon,
          backgroundColor: `${color}20`,
          color: color,
        }}
      >
        {icon}
      </div>
    </div>
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
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #334155",
    position: "fixed",
    height: "100vh",
    overflowY: "auto",
  },
  content: { flex: 1, padding: "32px", marginLeft: "280px" },

  // Sidebar Elements
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
    paddingLeft: "10px",
  },
  logoIcon: { fontSize: "28px" },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  menuGroup: { marginBottom: "24px" },
  menuLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: "12px",
    paddingLeft: "12px",
    letterSpacing: "1px",
  },
  navBtn: {
    width: "100%",
    textAlign: "left",
    padding: "12px 16px",
    background: "transparent",
    color: "#cbd5e1",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
  },
  navBtnActive: {
    width: "100%",
    textAlign: "left",
    padding: "12px 16px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.5)",
  },
  logoutBtn: {
    marginTop: "auto",
    padding: "14px",
    background: "#334155",
    color: "#f8fafc",
    border: "1px solid #475569",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  headerActions: { display: "flex", alignItems: "center", gap: "20px" },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "white",
    padding: "10px 16px",
    borderRadius: "50px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  headerSearch: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    marginLeft: "8px",
    width: "200px",
  },
  iconBtn: {
    fontSize: "20px",
    cursor: "pointer",
    background: "white",
    padding: "10px",
    borderRadius: "50%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  profileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "white",
    padding: "6px 16px 6px 6px",
    borderRadius: "50px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#3b82f6",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "13px",
  },
  profileName: { fontSize: "14px", fontWeight: "600", color: "#0f172a" },
  profileRole: { fontSize: "11px", color: "#64748b" },

  // Cards & Grid
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
  },
  statTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    margin: "0 0 8px 0",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  statTrend: { fontSize: "12px", fontWeight: "500" },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },

  splitGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 20px 0",
  },

  // Charts & Timeline
  chartContainer: {
    height: "200px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    flex: 1,
  },
  bar: {
    width: "24px",
    background: "#3b82f6",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.5s ease",
  },
  barLabel: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },

  timeline: {
    paddingLeft: "10px",
    borderLeft: "2px solid #e2e8f0",
    marginLeft: "10px",
  },
  timelineItem: {
    position: "relative",
    paddingLeft: "24px",
    marginBottom: "24px",
  },
  timelineDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "white",
    border: "3px solid",
    position: "absolute",
    left: "-7px",
    top: "0",
  },
  timelineTime: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: "4px",
  },
  timelineTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
    margin: 0,
  },
  timelineDesc: { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" },

  // Forms
  formCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    height: "fit-content",
    flex: 1,
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#475569" },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    background: "white",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
  },
  formActions: { display: "flex", gap: "12px", marginTop: "10px" },
  primaryBtn: {
    padding: "10px 20px",
    background: "#0f172a",
    color: "white",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  secondaryBtn: {
    padding: "10px 20px",
    background: "white",
    color: "#475569",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },

  // Tables
  tableCard: {
    background: "white",
    padding: "0",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    flex: 2,
    overflow: "hidden",
  },
  tableHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInput: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    width: "220px",
  },
  tableWrapper: { padding: "0" },
  table: { width: "100%", borderCollapse: "collapse" },
  trHead: { background: "#f8fafc", textAlign: "left" },
  tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" },
  td: {
    padding: "16px 24px",
    fontSize: "14px",
    color: "#334155",
    verticalAlign: "middle",
  },
  userCell: { display: "flex", alignItems: "center", gap: "12px" },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#64748b",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "700",
  },
  userName: { fontWeight: "600", color: "#0f172a" },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid #e2e8f0",
  },
  statusSuccess: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "600",
  },
  statusWarning: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: "600",
  },
  iconAction: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
    borderRadius: "4px",
    color: "#64748b",
  },

  // Finance & Notices
  secondaryBtnSm: {
    padding: "6px 12px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#475569",
  },
  successBtnSm: {
    padding: "6px 12px",
    background: "#f0fdf4",
    border: "1px solid #dcfce7",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#166534",
  },
  noticeList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "24px",
  },
  noticeItem: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    alignItems: "center",
  },
  noticeIcon: {
    width: "40px",
    height: "40px",
    background: "#e0f2fe",
    color: "#0369a1",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },
  noticeTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  noticeMeta: { fontSize: "12px", color: "#64748b", margin: 0 },

  // Settings
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  toggleRow: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
  },
  settingTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  settingDesc: { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" },
  toggleOn: {
    width: "44px",
    height: "24px",
    background: "#3b82f6",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "0.2s",
  },
  toggleOff: {
    width: "44px",
    height: "24px",
    background: "#cbd5e1",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "0.2s",
  },
  toggleKnobOn: {
    width: "18px",
    height: "18px",
    background: "white",
    borderRadius: "50%",
    position: "absolute",
    top: "3px",
    right: "3px",
    transition: "0.2s",
  },
  toggleKnobOff: {
    width: "18px",
    height: "18px",
    background: "white",
    borderRadius: "50%",
    position: "absolute",
    top: "3px",
    left: "3px",
    transition: "0.2s",
  },
};

export default AdminDash;
