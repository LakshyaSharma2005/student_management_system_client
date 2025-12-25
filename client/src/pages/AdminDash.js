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

  // Responsive State
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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

  // 🔄 HANDLE RESIZE
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
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
      {/* 🌑 SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>⚡</div>
          <h2 style={styles.logoText}>
            Admin <span style={{ color: "#60a5fa" }}>Panel</span>
          </h2>
        </div>

        {/* Menu (Scrollable) */}
        <div style={styles.scrollableMenu}>
          <div style={styles.menuGroup}>
            <p style={styles.menuLabel}>DASHBOARD</p>
            <NavBtn
              icon={<IconChart />}
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => {
                setActiveTab("overview");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
            <NavBtn
              icon={<IconBell />}
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
              icon={<IconUser />}
              label="Students"
              active={activeTab === "students"}
              onClick={() => {
                setActiveTab("students");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
            <NavBtn
              icon={<IconBook />}
              label="Faculty"
              active={activeTab === "teachers"}
              onClick={() => {
                setActiveTab("teachers");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
            <NavBtn
              icon={<IconCash />}
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
              icon={<IconSettings />}
              label="Settings"
              active={activeTab === "settings"}
              onClick={() => {
                setActiveTab("settings");
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>

        {/* Footer (Fixed) */}
        <div style={styles.sidebarFooter}>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            style={styles.logoutBtn}
          >
            <IconLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ⚪ MAIN CONTENT */}
      <main
        style={{
          ...styles.main,
          marginLeft: !isMobile && isSidebarOpen ? "260px" : "0",
        }}
      >
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={styles.hamburger}
            >
              <IconMenu />
            </button>
            <h2 style={styles.pageTitle}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.searchBar}>
              <IconSearch color="#94a3b8" />
              <input
                placeholder="Search..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button style={styles.iconBtn}>
              <IconBell color="#64748b" />
            </button>
            <div style={styles.profileBadge}>
              <div style={styles.avatar}>AD</div>
              {!isMobile && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={styles.profileName}>Admin User</span>
                  <span style={styles.profileRole}>Super Admin</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div style={styles.contentBody}>
          {/* 1️⃣ OVERVIEW */}
          {activeTab === "overview" && (
            <div style={styles.fadeIn}>
              <div style={styles.grid4}>
                <StatCard
                  label="Total Enrolled"
                  value={students.length}
                  change="+12% this week"
                  icon={<IconUser />}
                  color="blue"
                />
                <StatCard
                  label="Active Faculty"
                  value={teachers.length}
                  change="Stable"
                  icon={<IconBook />}
                  color="emerald"
                />
                <StatCard
                  label="Total Revenue"
                  value={`₹${(totalRevenue / 1000).toFixed(1)}k`}
                  change="+5% vs last mo"
                  icon={<IconCash />}
                  color="amber"
                />
                <StatCard
                  label="Pending Dues"
                  value={pendingFees}
                  change="Action Required"
                  icon={<IconAlert />}
                  color="rose"
                />
              </div>

              <div style={styles.gridSplit}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <IconChart color="#2563eb" />
                    <h3 style={styles.cardTitle}>Enrollment Trends</h3>
                  </div>
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
                  <div style={styles.cardHeader}>
                    <IconCalendar color="#2563eb" />
                    <h3 style={styles.cardTitle}>Audit Log</h3>
                  </div>
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
                      desc="Auto-backup completed"
                      color="#64748b"
                    />
                    <TimelineItem
                      time="03:45 PM"
                      title="Notice Posted"
                      desc="Winter Vacation Update"
                      color="#f59e0b"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2️⃣ STUDENTS & TEACHERS */}
          {(activeTab === "students" || activeTab === "teachers") && (
            <div style={styles.fadeIn}>
              {/* Form Section */}
              <div style={{ ...styles.card, marginBottom: "24px" }}>
                <h3 style={{ ...styles.cardTitle, marginBottom: "20px" }}>
                  {isEditing
                    ? "✏️ Edit Record"
                    : `➕ Add ${
                        activeTab === "students" ? "Student" : "Faculty"
                      }`}
                </h3>
                <form onSubmit={handleSubmit} style={styles.formGrid}>
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
                    placeholder="Email Address"
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
                      placeholder="Subject Specialization"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      gridColumn: "1 / -1",
                    }}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      style={styles.primaryBtn}
                    >
                      {loading
                        ? "Processing..."
                        : isEditing
                        ? "Update Record"
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
                        style={styles.secondaryBtn}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Table Section */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Directory</h3>
                </div>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>
                          {activeTab === "students" ? "Course" : "Subject"}
                        </th>
                        {activeTab === "students" && (
                          <th style={styles.th}>Fees</th>
                        )}
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getDataToDisplay().map((user) => (
                        <tr key={user._id} style={styles.tr}>
                          <td style={styles.td}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <div style={styles.userAvatar}>
                                {user.name.charAt(0)}
                              </div>
                              <span
                                style={{ fontWeight: "600", color: "#0f172a" }}
                              >
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td style={styles.td}>{user.email}</td>
                          <td style={styles.td}>
                            <span style={styles.pillBlue}>
                              {user.course || user.subject}
                            </span>
                          </td>
                          {activeTab === "students" && (
                            <td style={styles.td}>
                              <span
                                style={
                                  user.fees === "Paid"
                                    ? styles.pillGreen
                                    : styles.pillRed
                                }
                              >
                                {user.fees}
                              </span>
                            </td>
                          )}
                          <td style={styles.td}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => handleEdit(user)}
                                style={styles.iconAction}
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(user._id, activeTab)
                                }
                                style={{
                                  ...styles.iconAction,
                                  color: "#ef4444",
                                }}
                              >
                                <IconTrash />
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
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Financial Overview</h3>
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Student</th>
                      <th style={styles.th}>Course</th>
                      <th style={styles.th}>Dues</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id} style={styles.tr}>
                        <td style={styles.td}>
                          <b>{s.name}</b>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.pillBlue}>{s.course}</span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: "600" }}>
                          ₹28,000
                        </td>
                        <td style={styles.td}>
                          <span
                            style={
                              s.fees === "Paid"
                                ? styles.pillGreen
                                : styles.pillRed
                            }
                          >
                            {s.fees}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {s.fees === "Pending" ? (
                            <button
                              style={styles.btnOutline}
                              onClick={() => alert("Reminder Sent!")}
                            >
                              🔔 Remind
                            </button>
                          ) : (
                            <button style={styles.btnGhost}>⬇ Download</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4️⃣ NOTICES */}
          {activeTab === "notices" && (
            <div
              style={{
                ...styles.fadeIn,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
                gap: "24px",
              }}
            >
              <div style={{ ...styles.card, height: "fit-content" }}>
                <h3 style={{ ...styles.cardTitle, marginBottom: "20px" }}>
                  📢 Publish Notice
                </h3>
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
                  <textarea
                    rows="4"
                    style={styles.textarea}
                    placeholder="Enter details..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <button
                    type="submit"
                    style={{
                      ...styles.primaryBtn,
                      width: "100%",
                      marginTop: "15px",
                    }}
                  >
                    Publish
                  </button>
                </form>
              </div>
              <div style={styles.card}>
                <h3 style={{ ...styles.cardTitle, marginBottom: "20px" }}>
                  Notice Board
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {notices.map((n) => (
                    <div key={n.id} style={styles.noticeCard}>
                      <div style={styles.noticeIcon}>📢</div>
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: 0,
                            fontWeight: "600",
                            color: "#0f172a",
                          }}
                        >
                          {n.title}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          {n.date} •{" "}
                          <span
                            style={{
                              color:
                                n.type === "Urgent" ? "#ef4444" : "#2563eb",
                            }}
                          >
                            {n.type}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(n.id, "notices")}
                        style={styles.iconAction}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5️⃣ SETTINGS */}
          {activeTab === "settings" && (
            <div style={{ ...styles.card, maxWidth: "600px" }}>
              <h3 style={{ ...styles.cardTitle, marginBottom: "20px" }}>
                ⚙️ Global Configuration
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div>
                  <label style={styles.label}>Institute Name</label>
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
                </div>
                <div>
                  <label style={styles.label}>Academic Session</label>
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
                    <h4 style={{ margin: 0, fontWeight: "600" }}>
                      Maintenance Mode
                    </h4>
                    <p
                      style={{ margin: 0, fontSize: "12px", color: "#64748b" }}
                    >
                      Suspend all access.
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
                <button
                  style={{ ...styles.primaryBtn, marginTop: "10px" }}
                  onClick={() => alert("Settings Saved!")}
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// 🎨 SUB-COMPONENTS & ICONS
const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    style={active ? styles.navBtnActive : styles.navBtn}
    onClick={onClick}
  >
    {icon} <span style={{ marginLeft: "12px" }}>{label}</span>
  </button>
);

const StatCard = ({ label, value, change, icon, color }) => {
  const colors = {
    blue: { bg: "#eff6ff", text: "#2563eb" },
    emerald: { bg: "#ecfdf5", text: "#10b981" },
    amber: { bg: "#fffbeb", text: "#f59e0b" },
    rose: { bg: "#fff1f2", text: "#f43f5e" },
  };
  const theme = colors[color] || colors.blue;

  return (
    <div style={styles.statCard}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <p style={styles.statLabel}>{label}</p>
          <h3 style={styles.statValue}>{value}</h3>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "500",
              color: change.includes("+") ? "#10b981" : "#64748b",
            }}
          >
            {change}
          </p>
        </div>
        <div
          style={{ ...styles.iconBox, background: theme.bg, color: theme.text }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, desc, color }) => (
  <div style={styles.timelineItem}>
    <div style={{ ...styles.timelineDot, borderColor: color }}></div>
    <div>
      <p
        style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "#94a3b8",
          margin: 0,
        }}
      >
        {time}
      </p>
      <h5
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#334155",
          margin: 0,
        }}
      >
        {title}
      </h5>
      <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
        {desc}
      </p>
    </div>
  </div>
);

// SIMPLE ICONS (SVG)
const IconChart = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);
const IconBell = ({ color = "currentColor" }) => (
  <svg width="20" height="20" fill="none" stroke={color} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);
const IconUser = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);
const IconBook = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const IconCash = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconSettings = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const IconLogOut = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);
const IconMenu = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const IconSearch = ({ color }) => (
  <svg width="18" height="18" fill="none" stroke={color} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const IconAlert = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);
const IconEdit = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const IconTrash = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const IconCalendar = ({ color }) => (
  <svg width="20" height="20" fill="none" stroke={color} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// 💅 CSS-IN-JS STYLES (Tailwind Replica)
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "'Inter', sans-serif",
  },

  // SIDEBAR (FIXED FLEX LAYOUT)
  sidebar: {
    width: "260px",
    background: "linear-gradient(to bottom, #1e293b, #0f172a)",
    color: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #334155",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 2000,
    transition: "transform 0.3s ease",
  },
  scrollableMenu: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    scrollbarWidth: "thin",
  },
  sidebarFooter: {
    padding: "16px",
    borderTop: "1px solid #334155",
    backgroundColor: "#0f172a",
    flexShrink: 0,
  },
  logoContainer: {
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #334155",
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: "24px",
    background: "rgba(59, 130, 246, 0.2)",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: 0,
  },

  // NAV BUTTONS
  menuGroup: { marginBottom: "24px" },
  menuLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: "8px",
    paddingLeft: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  navBtn: {
    width: "100%",
    textAlign: "left",
    padding: "12px 16px",
    background: "transparent",
    color: "#cbd5e1",
    border: "none",
    borderRadius: "12px",
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
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
  },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    background: "#334155",
    color: "#f8fafc",
    border: "1px solid #475569",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "0.2s",
  },

  // MAIN CONTENT
  main: {
    flex: 1,
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f8fafc",
  },
  contentBody: { padding: "24px", maxWidth: "1400px", margin: "0 auto" },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1900,
  },

  // HEADER
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  hamburger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#334155",
    marginRight: "16px",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  headerActions: { display: "flex", alignItems: "center", gap: "16px" },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "8px 16px",
    borderRadius: "99px",
    width: "240px",
    border: "1px solid #e2e8f0",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    marginLeft: "8px",
    width: "100%",
  },
  iconBtn: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#64748b",
  },
  profileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "4px 8px",
    borderRadius: "50px",
    cursor: "pointer",
    border: "1px solid transparent",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "13px",
  },
  profileName: { fontSize: "14px", fontWeight: "600", color: "#0f172a" },
  profileRole: { fontSize: "11px", color: "#64748b" },

  // GRIDS
  fadeIn: { animation: "fadeIn 0.3s ease-in-out" },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  gridSplit: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  // CARDS
  statCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  statLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    margin: "0 0 8px 0",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0",
  },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    background: "white",
    padding: "0",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
    height: "100%",
    paddingBottom: "20px",
  },
  cardHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },

  // CHART & TIMELINE
  chartContainer: {
    height: "200px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: "24px",
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
    width: "20px",
    background: "linear-gradient(to top, #3b82f6, #60a5fa)",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.5s ease",
  },
  barLabel: {
    marginTop: "12px",
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
  },

  timeline: { padding: "24px" },
  timelineItem: {
    position: "relative",
    paddingLeft: "24px",
    marginBottom: "24px",
    borderLeft: "2px solid #e2e8f0",
  },
  timelineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "white",
    border: "2px solid",
    position: "absolute",
    left: "-6px",
    top: "0",
  },

  // INPUTS & BUTTONS
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    transition: "border 0.2s",
  },
  select: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    background: "white",
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    resize: "vertical",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "6px",
    display: "block",
  },

  primaryBtn: {
    padding: "10px 20px",
    background: "#0f172a",
    color: "white",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "0.2s",
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
  btnOutline: {
    padding: "6px 12px",
    background: "white",
    border: "1px solid #fbbf24",
    color: "#d97706",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnGhost: {
    padding: "6px 12px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#16a34a",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // TABLE
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  th: {
    padding: "12px 24px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    background: "#f8fafc",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.1s" },
  td: {
    padding: "16px 24px",
    fontSize: "14px",
    color: "#334155",
    verticalAlign: "middle",
  },
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
  pillBlue: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "600",
  },
  pillGreen: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#10b981",
    fontSize: "12px",
    fontWeight: "600",
  },
  pillRed: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#fef2f2",
    color: "#ef4444",
    fontSize: "12px",
    fontWeight: "600",
  },
  iconAction: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "6px",
    borderRadius: "6px",
    color: "#64748b",
    transition: "0.2s",
  },

  // NOTICES
  noticeCard: {
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
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },

  // SETTINGS
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
  },
  toggleOn: {
    width: "44px",
    height: "24px",
    background: "#2563eb",
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
