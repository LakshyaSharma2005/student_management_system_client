import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDash = () => {
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'teachers'
  const [data, setData] = useState([]); // Stores list of students OR teachers
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', course: '', subject: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load Data when Tab Changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // NOTE: We'll need a /api/admin/teachers route next. For now, we mock if 'teachers'
      const endpoint = activeTab === 'students' 
        ? `${import.meta.env.VITE_API_URL}/api/admin/students` 
        : `${import.meta.env.VITE_API_URL}/api/admin/teachers`; // We will build this route next!
      
      const res = await axios.get(endpoint, { headers: { Authorization: token } });
      setData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      // Fallback for demo if route doesn't exist yet
      if (activeTab === 'teachers') setData([]); 
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = `${import.meta.env.VITE_API_URL}/api/admin/add-student`; // Reuse for now or creating separate
      
      // Determine Role & Payload
      const payload = { ...formData, role: activeTab === 'students' ? 'Student' : 'Teacher' };
      
      await axios.post(endpoint, payload, { headers: { Authorization: token } });
      
      // Reset & Refresh
      setFormData({ name: '', email: '', password: '', course: '', subject: '' });
      fetchData();
      alert(`✅ New ${activeTab === 'students' ? 'Student' : 'Teacher'} Added!`);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Delete this user? This cannot be undone.")) {
      alert("Delete Logic Placeholder (Backend Needed)");
    }
  };

  // Filter Data for Search
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <div style={styles.navbar}>
        <div style={styles.brand}>
          <span style={styles.logoIcon}>⚡</span>
          <h1>Admin<span style={{color: '#3498db'}}>OS</span></h1>
        </div>
        <div style={styles.navRight}>
          <div style={styles.adminProfile}>
            <div style={styles.avatar}>A</div>
            <span>Administrator</span>
          </div>
          <button onClick={() => {localStorage.removeItem('token'); navigate('/')}} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.mainGrid}>
        
        {/* Sidebar Tabs */}
        <div style={styles.sidebar}>
          <p style={styles.menuLabel}>MENU</p>
          <button 
            style={activeTab === 'students' ? styles.menuBtnActive : styles.menuBtn} 
            onClick={() => setActiveTab('students')}
          >
            👨‍🎓 Manage Students
          </button>
          <button 
            style={activeTab === 'teachers' ? styles.menuBtnActive : styles.menuBtn} 
            onClick={() => setActiveTab('teachers')}
          >
            👨‍🏫 Manage Teachers
          </button>
          <button style={styles.menuBtn} onClick={() => alert("Feature coming soon!")}>
            📢 Announcements
          </button>
          <div style={styles.divider}></div>
          <p style={styles.menuLabel}>SYSTEM</p>
          <button style={styles.menuBtn}>📊 Analytics</button>
          <button style={styles.menuBtn}>⚙️ Settings</button>
        </div>

        {/* Main Content Area */}
        <div style={styles.content}>
          
          {/* Stats Row */}
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <h3>{data.length}</h3>
              <p>Total {activeTab === 'students' ? 'Students' : 'Teachers'}</p>
            </div>
            <div style={styles.statCard}>
              <h3>Active</h3>
              <p>Database Status</p>
            </div>
             <div style={styles.statCard}>
              <h3>24/7</h3>
              <p>Server Uptime</p>
            </div>
          </div>

          {/* Action Area: Form + Table */}
          <div style={styles.actionArea}>
            
            {/* Left: Dynamic Add Form */}
            <div style={styles.formCard}>
              <h3 style={styles.cardHeader}>
                {activeTab === 'students' ? '➕ Add Student' : '➕ Add Teacher'}
              </h3>
              <form onSubmit={handleRegister} style={styles.form}>
                <input 
                  type="text" placeholder="Full Name" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  required style={styles.input} 
                />
                <input 
                  type="email" placeholder="Email Address" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  required style={styles.input} 
                />
                <input 
                  type="password" placeholder="Password" 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  required style={styles.input} 
                />
                
                {/* Dynamic Field: Course for Students, Subject for Teachers */}
                {activeTab === 'students' ? (
                   <select 
                     value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})}
                     style={styles.select} required
                   >
                     <option value="">-- Select Course --</option>
                     <option value="BCA">BCA</option>
                     <option value="B.Tech">B.Tech</option>
                   </select>
                ) : (
                  <input 
                    type="text" placeholder="Subject Specialization" 
                    value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                    style={styles.input} required
                  />
                )}

                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? "Processing..." : `Register ${activeTab === 'students' ? 'Student' : 'Teacher'}`}
                </button>
              </form>
            </div>

            {/* Right: Searchable Table */}
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h3>📋 {activeTab === 'students' ? 'Student Directory' : 'Faculty List'}</h3>
                <input 
                  type="text" placeholder="🔍 Search by name..." 
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>{activeTab === 'students' ? 'Course' : 'Subject'}</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((user, index) => (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.userCell}>
                            <div style={{...styles.avatarSmall, background: activeTab === 'students' ? '#3498db' : '#e67e22'}}>
                              {user.name[0]}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>
                          <span style={styles.badge}>{user.course || user.subject || 'N/A'}</span>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => handleDelete(user._id)} style={styles.iconBtn}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px', color: '#999'}}>No results found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// 💅 "Daddy" Level Styling - Dark Sidebar, Clean Cards
const styles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  
  // Navbar
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '0 30px', height: '70px', background: '#fff', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' },
  logoIcon: { fontSize: '24px' },
  navRight: { display: 'flex', gap: '20px', alignItems: 'center' },
  adminProfile: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', color: '#333' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', background: '#2c3e50', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  logoutBtn: { padding: '8px 16px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },

  // Layout
  mainGrid: { display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: 'calc(100vh - 70px)' },
  
  // Sidebar
  sidebar: { background: '#2c3e50', color: '#ecf0f1', padding: '20px' },
  menuLabel: { fontSize: '12px', color: '#95a5a6', marginTop: '20px', marginBottom: '10px', fontWeight: 'bold' },
  menuBtn: { display: 'block', width: '100%', padding: '12px 15px', background: 'transparent', color: '#bdc3c7', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '15px', marginBottom: '5px', transition: '0.2s' },
  menuBtnActive: { display: 'block', width: '100%', padding: '12px 15px', background: '#34495e', color: '#fff', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '15px', marginBottom: '5px', fontWeight: '600', borderLeft: '4px solid #3498db' },
  divider: { height: '1px', background: '#34495e', margin: '20px 0' },

  // Content
  content: { padding: '30px' },
  
  // Stats
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
  statCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },

  // Action Area
  actionArea: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
  
  // Form
  formCard: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' },
  cardHeader: { margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  select: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', background: '#fff' },
  submitBtn: { padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },

  // Table
  tableCard: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  searchInput: { padding: '10px', width: '250px', borderRadius: '6px', border: '1px solid #ddd' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  trHead: { background: '#f8f9fa', borderBottom: '2px solid #e9ecef' },
  tr: { borderBottom: '1px solid #f1f2f6' },
  td: { padding: '12px', verticalAlign: 'middle' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' },
  avatarSmall: { width: '30px', height: '30px', borderRadius: '50%', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' },
  badge: { padding: '4px 10px', borderRadius: '12px', background: '#e3f2fd', color: '#1565c0', fontSize: '12px', fontWeight: 'bold' },
  iconBtn: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }
};

export default AdminDash;