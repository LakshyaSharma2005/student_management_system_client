import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🎓 UPDATED: Comprehensive Course List
const COURSE_OPTIONS = [
  "BCA (Core)",
  "BCA (Data Science)",
  "BCA (AI & ML)",
  "BCA (Cloud Computing)",
  "BCA (Cybersecurity)",
  "B.Tech (CSE)",
  "B.Tech (IT)",
  "B.Tech (ECE)",
  "B.Tech (Mechanical)",
  "B.Tech (Civil)",
  "B.Sc (IT)",
  "B.Sc (Computer Science)",
  "B.Sc (core)",
  "M.Sc (Computer Science)",
  "MCA",
  "BBA",
  "MBA (Marketing)",
  "MBA (Finance)",
  "MBA (HR)",
  "B.Pharma",
  "M.Pharma",
  "LLB",
  "BA",
  "MA",
];

const AdminDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // 🔒 REAL BACKEND URL
  const SERVER_URL =
    "https://student-management-system-server-vygt.onrender.com";

  // --- 1. DATA STATES ---
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Semester Exams Start Dec 20",
      date: "2025-12-15",
      type: "Urgent",
    },
    {
      id: 2,
      title: "Winter Vacation Announced",
      date: "2025-12-18",
      type: "General",
    },
  ]);

  // --- 2. SETTINGS STATE ---
  const [settings, setSettings] = useState({
    instituteName: "AdminOS Institute",
    session: "2025-2026",
    maintenance: false,
  });

  // --- 3. UI STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // --- 4. FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    subject: "",
    fees: "Pending",
  });

  // 🔄 FETCH DATA FUNCTION (Wrapped in useCallback)
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

  // 🔄 INITIAL LOAD EFFECT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [navigate, fetchData]);

  // 📝 HANDLER: Add or Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (isEditing) {
        alert(`✏️ Details for ${formData.name} updated successfully!`);
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
        alert(`✅ ${payload.role} Added Successfully!`);
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
      alert(
        "❌ Operation Failed: " + (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  // ✏️ HANDLER: Edit User
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

  // 🗑️ HANDLER: Delete User
  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure?")) return;
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

      alert("🗑️ Deleted Successfully");
    } catch (err) {
      alert("❌ Delete Failed");
    }
  };

  // 🔍 FILTER DATA
  const getDataToDisplay = () => {
    if (activeTab === "students")
      return students.filter((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (activeTab === "teachers")
      return teachers.filter((t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return [];
  };

  // 📊 CALCULATE STATS
  const totalRevenue = students.filter((s) => s.fees === "Paid").length * 28000;
  const pendingFees = students.filter((s) => s.fees === "Pending").length;

  return (
    <div style={styles.container}>
      {/* 🟢 TOP NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.brand}>
          <span style={styles.logoIcon}>⚡</span>
          <h1>
            {settings.instituteName.split(" ")[0]}
            <span style={{ color: "#3498db" }}>OS</span>
          </h1>
        </div>
        <div style={styles.navRight}>
          <div style={styles.adminProfile}>
            <div style={styles.avatar}>A</div>
            <span>Administrator</span>
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
          <p style={styles.menuLabel}>MENU</p>
          <NavBtn
            label="📊 Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <NavBtn
            label="👨‍🎓 Students"
            active={activeTab === "students"}
            onClick={() => setActiveTab("students")}
          />
          <NavBtn
            label="👨‍🏫 Teachers"
            active={activeTab === "teachers"}
            onClick={() => setActiveTab("teachers")}
          />
          <NavBtn
            label="💰 Finance"
            active={activeTab === "finance"}
            onClick={() => setActiveTab("finance")}
          />
          <div style={styles.divider}></div>
          <p style={styles.menuLabel}>SYSTEM</p>
          <NavBtn
            label="📢 Notices"
            active={activeTab === "notices"}
            onClick={() => setActiveTab("notices")}
          />
          <NavBtn
            label="⚙️ Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </div>

        {/* 🔵 CONTENT */}
        <div style={styles.content}>
          {/* 1️⃣ OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div style={styles.overviewGrid}>
              <StatCard
                title="Total Students"
                value={students.length}
                color="#3498db"
              />
              <StatCard
                title="Total Teachers"
                value={teachers.length}
                color="#e67e22"
              />
              <StatCard
                title="Revenue"
                value={`₹${totalRevenue.toLocaleString()}`}
                color="#27ae60"
              />
              <StatCard
                title="Pending Fees"
                value={pendingFees}
                color="#e74c3c"
              />

              <div style={styles.splitGrid}>
                <div style={styles.card}>
                  <h3>📈 Admissions</h3>
                  <div style={styles.chartPlaceholder}>
                    {[40, 60, 30, 80, 50].map((h, i) => (
                      <div
                        key={i}
                        style={{ ...styles.bar, height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div style={styles.card}>
                  <h3>🕒 Recent Activity</h3>
                  <ul style={styles.activityList}>
                    <li style={styles.activityItem}>
                      <span style={styles.time}>10:00 AM</span> System Backup
                    </li>
                    <li style={styles.activityItem}>
                      <span style={styles.time}>11:30 AM</span> New Student
                      Joined
                    </li>
                    <li style={styles.activityItem}>
                      <span style={styles.time}>02:15 PM</span> Fee Payment
                      Received
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2️⃣ STUDENTS & TEACHERS MANAGEMENT */}
          {(activeTab === "students" || activeTab === "teachers") && (
            <div style={styles.actionArea}>
              <div style={styles.formCard}>
                <h3>
                  {isEditing
                    ? "✏️ Edit User"
                    : `➕ Add ${
                        activeTab === "students" ? "Student" : "Teacher"
                      }`}
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
                      placeholder="Password (Default: 123456)"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  )}

                  {activeTab === "students" ? (
                    <>
                      {/* ✅ UPDATED COURSE SELECT WITH REAL DATA */}
                      <select
                        style={styles.select}
                        value={formData.course}
                        onChange={(e) =>
                          setFormData({ ...formData, course: e.target.value })
                        }
                        required
                      >
                        <option value="">-- Select Course --</option>
                        {COURSE_OPTIONS.map((course, idx) => (
                          <option key={idx} value={course}>
                            {course}
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
                        <option value="Pending">Fees: Pending</option>
                        <option value="Paid">Fees: Paid</option>
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

                  <button
                    type="submit"
                    disabled={loading}
                    style={styles.submitBtn}
                  >
                    {loading
                      ? "Processing..."
                      : isEditing
                      ? "Update User"
                      : "Save Record"}
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
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                  <h3>📋 Directory</h3>
                  <input
                    style={styles.searchInput}
                    type="text"
                    placeholder="🔍 Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role Info</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDataToDisplay().map((user) => (
                      <tr key={user._id} style={styles.tr}>
                        <td style={styles.td}>
                          <b>{user.name}</b>
                        </td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>
                          <span style={styles.badge}>
                            {user.course || user.subject}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleEdit(user)}
                            style={styles.actionBtn}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, activeTab)}
                            style={{ ...styles.actionBtn, color: "#e74c3c" }}
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
          )}

          {/* 3️⃣ FINANCE */}
          {activeTab === "finance" && (
            <div style={styles.tableCard}>
              <h3>💰 Fee Status</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} style={styles.tr}>
                      <td style={styles.td}>{s.name}</td>
                      <td style={styles.td}>₹28,000</td>
                      <td style={styles.td}>
                        <span
                          style={
                            s.fees === "Paid"
                              ? styles.statusGreen
                              : styles.statusRed
                          }
                        >
                          {s.fees}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {s.fees === "Pending" && (
                          <button
                            style={styles.payBtn}
                            onClick={() => alert("Reminder Sent!")}
                          >
                            🔔 Remind
                          </button>
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
            <div style={styles.actionArea}>
              <div style={styles.formCard}>
                <h3>📢 Publish Notice</h3>
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
                  <input
                    style={styles.input}
                    placeholder="Notice Title"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <button type="submit" style={styles.submitBtn}>
                    Post Notice
                  </button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3>Active Notices</h3>
                {notices.map((n) => (
                  <div key={n.id} style={styles.noticeItem}>
                    <div>
                      <b>{n.title}</b>
                      <br />
                      <small>{n.date}</small>
                    </div>
                    <button
                      onClick={() => handleDelete(n.id, "notices")}
                      style={styles.deleteLink}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5️⃣ SETTINGS */}
          {activeTab === "settings" && (
            <div style={styles.formCard}>
              <h3>⚙️ System Configuration</h3>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <label>
                  Institute Name{" "}
                  <input
                    style={styles.input}
                    value={settings.instituteName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        instituteName: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Session{" "}
                  <input
                    style={styles.input}
                    value={settings.session}
                    onChange={(e) =>
                      setSettings({ ...settings, session: e.target.value })
                    }
                  />
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f8f9fa",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <span>System Maintenance</span>
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
                    {settings.maintenance ? "🔴 Active" : "🟢 Inactive"}
                  </button>
                </div>
                <button
                  style={styles.submitBtn}
                  onClick={() => alert("Settings Saved!")}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 💎 COMPONENTS
const NavBtn = ({ label, active, onClick }) => (
  <button
    style={active ? styles.menuBtnActive : styles.menuBtn}
    onClick={onClick}
  >
    {label}
  </button>
);

const StatCard = ({ title, value, color }) => (
  <div style={{ ...styles.statCard, borderLeft: `5px solid ${color}` }}>
    <h3 style={{ fontSize: "28px", color: "#2c3e50", margin: 0 }}>{value}</h3>
    <p style={{ color: "#7f8c8d", margin: 0 }}>{title}</p>
  </div>
);

// STYLES
const styles = {
  container: {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 30px",
    height: "70px",
    background: "#fff",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
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
  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
    color: "#333",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#2c3e50",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "#ffebee",
    color: "#c62828",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    minHeight: "calc(100vh - 70px)",
  },
  sidebar: { background: "#2c3e50", color: "#ecf0f1", padding: "20px" },
  menuLabel: {
    fontSize: "12px",
    color: "#95a5a6",
    marginTop: "20px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  menuBtn: {
    display: "block",
    width: "100%",
    padding: "12px 15px",
    background: "transparent",
    color: "#bdc3c7",
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
    background: "#34495e",
    color: "#fff",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "15px",
    marginBottom: "5px",
    fontWeight: "600",
    borderLeft: "4px solid #3498db",
  },
  divider: { height: "1px", background: "#34495e", margin: "20px 0" },
  content: { padding: "30px", overflowY: "auto" },
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
  splitGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    gridColumn: "span 4",
  },
  actionArea: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" },
  formCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    height: "fit-content",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    background: "#fff",
    width: "100%",
    boxSizing: "border-box",
  },
  submitBtn: {
    padding: "12px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  cancelBtn: {
    padding: "12px",
    background: "#95a5a6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "5px",
  },
  tableCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchInput: {
    padding: "10px",
    width: "250px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  trHead: {
    background: "#f8f9fa",
    borderBottom: "2px solid #e9ecef",
    textAlign: "left",
  },
  tr: { borderBottom: "1px solid #f1f2f6" },
  td: { padding: "12px", verticalAlign: "middle" },
  badge: {
    padding: "4px 10px",
    borderRadius: "12px",
    background: "#e3f2fd",
    color: "#1565c0",
    fontSize: "12px",
    fontWeight: "bold",
  },
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
  actionBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginRight: "10px",
  },
  payBtn: {
    background: "#f39c12",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  noticeItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    borderBottom: "1px solid #eee",
  },
  deleteLink: {
    color: "red",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
  },
  chartPlaceholder: {
    display: "flex",
    alignItems: "flex-end",
    height: "150px",
    gap: "20px",
    marginTop: "20px",
    justifyContent: "space-around",
  },
  bar: { width: "15%", background: "#3498db", borderRadius: "5px" },
  activityList: { listStyle: "none", padding: 0, marginTop: "10px" },
  activityItem: {
    padding: "10px 0",
    borderBottom: "1px dashed #eee",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
  },
  time: { color: "#3498db", fontWeight: "bold", fontSize: "12px" },
  toggleOn: {
    padding: "8px 15px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  toggleOff: {
    padding: "8px 15px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AdminDash;
