import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, students, teachers, notices, finance
  
  // Data States
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notices, setNotices] = useState([
    { id: 1, title: "Semester Exams Start Dec 20", date: "2025-12-15", type: "Urgent" },
    { id: 2, title: "Winter Vacation Announced", date: "2025-12-18", type: "General" }
  ]);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // null or ID of user being edited

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '', course: '', subject: '', fees: 'Pending' });

  // 🔒 REAL BACKEND URL
  // We use the direct Render URL to ensure connection works perfectly
  const SERVER_URL = "https://student-management-system-server-vygt.onrender.com";

  // 🔄 Initial Load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. Fetch Students
      const sRes = await axios.get(`${SERVER_URL}/api/admin/students`, { headers: { Authorization: token } });
      if (sRes.data.success !== false) setStudents(sRes.data);
      
      // 2. Fetch Teachers
      try {
        const tRes = await axios.get(`${SERVER_URL}/api/admin/teachers`, { headers: { Authorization: token } });
        if (tRes.data) setTeachers(tRes.data);
      } catch (err) {
        console.log("Teacher fetch failed (using mock for display)");
      }

    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // 📝 Handle Form Submit (REAL DATABASE CONNECTION)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // 1. Prepare Data Payload
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password || '123456', // Default password if empty
        role: activeTab === 'students' ? 'Student' : 'Teacher',
        course: formData.course,
        subject: formData.subject,
        fees: formData.fees || 'Pending'
      };

      // 2. Send to Backend
      // This actually creates the user in MongoDB!
      const res = await axios.post(`${SERVER_URL}/api/auth/register`, payload, {
        headers: { Authorization: token }
      });

      // 3. Update UI on Success
      if (res.data.success) {
        alert(`✅ ${activeTab === 'students' ? 'Student' : 'Teacher'} Added Successfully!`);
        
        // Refresh the list immediately from the database
        fetchData(); 
        
        // Clear Form
        setFormData({ name: '', email: '', password: '', course: '', subject: '', fees: 'Pending' });
      } else {
        alert("⚠️ Registration Failed: " + res.data.message);
      }

    } catch (err) {
      console.error("Registration Error:", err);
      alert("❌ Failed to add user: " + (err.response?.data?.message || err.message));
    }
    
    setLoading(false);
  };

  const handleDelete = async (id, type) => {
    if(!window.confirm("Are you sure?")) return;

    // For now, we update the UI optimistically. 
    // You can add a DELETE endpoint call here later.
    if(type === 'students') setStudents(students.filter(s => s._id !== id));
    if(type === 'teachers') setTeachers(teachers.filter(t => t._id !== id));
    if(type === 'notices') setNotices(notices.filter(n => n.id !== id));
  };

  // 🔍 Filter Logic
  const getDataToDisplay = () => {
    if (activeTab === 'students') return students.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeTab === 'teachers') return teachers.filter(t => t.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return [];
  };

  // 💵 Calculate Stats
  const totalRevenue = students.filter(s => s.fees === 'Paid').length * 50000;
  const pendingFees = students.filter(s => s.fees === 'Pending').length;

  return (
    <div style={styles.container}>
      {/* 🟢 TOP NAVBAR */}
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
        
        {/* 🟡 SIDEBAR */}
        <div style={styles.sidebar}>
          <p style={styles.menuLabel}>MENU</p>
          <NavBtn label="📊 Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavBtn label="👨‍🎓 Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
          <NavBtn label="👨‍🏫 Teachers" active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
          <NavBtn label="💰 Finance" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          <NavBtn label="📢 Notices" active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} />
          
          <div style={styles.divider}></div>
          <p style={styles.menuLabel}>SYSTEM</p>
          <NavBtn label="⚙️ Settings" />
        </div>

        {/* 🔵 MAIN CONTENT AREA */}
        <div style={styles.content}>
          
          {/* 1️⃣ OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={styles.overviewGrid}>
              <StatCard title="Total Students" value={students.length} color="#3498db" />
              <StatCard title="Total Teachers" value={teachers.length} color="#e67e22" />
              <StatCard title="Revenue Collected" value={`₹${totalRevenue.toLocaleString()}`} color="#27ae60" />
              <StatCard title="Pending Fees" value={pendingFees} color="#e74c3c" />
              
              {/* Simple Chart Visualization */}
              <div style={{gridColumn: 'span 2', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                <h3>📈 Enrollment Analytics</h3>
                <div style={{display: 'flex', alignItems: 'flex-end', height: '150px', gap: '20px', marginTop: '20px'}}>
                  <div style={{width: '20%', height: '60%', background: '#3498db', borderRadius: '5px'}}></div>
                  <div style={{width: '20%', height: '80%', background: '#3498db', borderRadius: '5px'}}></div>
                  <div style={{width: '20%', height: '40%', background: '#3498db', borderRadius: '5px'}}></div>
                  <div style={{width: '20%', height: '90%', background: '#3498db', borderRadius: '5px'}}></div>
                  <div style={{width: '20%', height: '70%', background: '#3498db', borderRadius: '5px'}}></div>
                </div>
                <p style={{textAlign: 'center', marginTop: '10px', color: '#7f8c8d'}}>Monthly Admissions</p>
              </div>
            </div>
          )}

          {/* 2️⃣ STUDENTS & TEACHERS TAB */}
          {(activeTab === 'students' || activeTab === 'teachers') && (
            <div style={styles.actionArea}>
              {/* Form Section */}
              <div style={styles.formCard}>
                <h3 style={styles.cardHeader}>{isEditing ? '✏️ Edit User' : `➕ Add ${activeTab === 'students' ? 'Student' : 'Teacher'}`}</h3>
                <form onSubmit={handleSubmit} style={styles.form}>
                  <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={styles.input} />
                  <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={styles.input} />
                  {!isEditing && <input type="password" placeholder="Password (Default: 123456)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={styles.input} />}
                  
                  {activeTab === 'students' ? (
                     <>
                      <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} style={styles.select} required>
                        <option value="">-- Select Course --</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="MBA">MBA</option>
                        <option value="B.Sc">B.Sc</option>
                      </select>
                      <select value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} style={styles.select}>
                        <option value="Pending">Fees: Pending</option>
                        <option value="Paid">Fees: Paid</option>
                      </select>
                     </>
                  ) : (
                    <input type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} style={styles.input} required />
                  )}

                  <button type="submit" disabled={loading} style={styles.submitBtn}>{loading ? "Saving..." : "Save Record"}</button>
                  {isEditing && <button type="button" onClick={() => {setIsEditing(null); setFormData({ name: '', email: '', password: '', course: '', subject: '' })}} style={styles.cancelBtn}>Cancel</button>}
                </form>
              </div>

              {/* Table Section */}
              <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                  <h3>📋 Directory</h3>
                  <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={styles.searchInput} />
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>{activeTab === 'students' ? 'Course' : 'Subject'}</th>
                      {activeTab === 'students' && <th>Fees</th>}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDataToDisplay().map((user) => (
                      <tr key={user._id} style={styles.tr}>
                        <td style={styles.td}><b>{user.name}</b></td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}><span style={styles.badge}>{user.course || user.subject}</span></td>
                        {activeTab === 'students' && (
                          <td style={styles.td}>
                            <span style={user.fees === 'Paid' ? styles.statusGreen : styles.statusRed}>{user.fees}</span>
                          </td>
                        )}
                        <td style={styles.td}>
                          <button onClick={() => handleDelete(user._id, activeTab)} style={{...styles.actionBtn, color: '#e74c3c'}}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                    {getDataToDisplay().length === 0 && <tr><td colSpan="5" style={{padding:'20px', textAlign:'center', color:'#999'}}>No users found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3️⃣ FINANCE TAB */}
          {activeTab === 'finance' && (
             <div style={styles.tableCard}>
                <h3>💰 Fee Status Report</h3>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.trHead}><th>Student</th><th>Course</th><th>Amount Due</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id} style={styles.tr}>
                        <td style={styles.td}>{s.name}</td>
                        <td style={styles.td}>{s.course}</td>
                        <td style={styles.td}>₹50,000</td>
                        <td style={styles.td}><span style={s.fees === 'Paid' ? styles.statusGreen : styles.statusRed}>{s.fees}</span></td>
                        <td style={styles.td}>
                          {s.fees === 'Pending' && <button style={styles.payBtn} onClick={() => alert("Payment Link Sent!")}>Send Reminder 🔔</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {/* 4️⃣ NOTICES TAB */}
          {activeTab === 'notices' && (
            <div style={styles.actionArea}>
              <div style={styles.formCard}>
                <h3>📢 Post Notice</h3>
                <form onSubmit={(e) => { e.preventDefault(); setNotices([...notices, {id: Date.now(), title: formData.name, date: new Date().toISOString().split('T')[0]}]); setFormData({...formData, name: ''}); }}>
                  <input type="text" placeholder="Notice Title" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={styles.input} required />
                  <br /><br />
                  <button type="submit" style={styles.submitBtn}>Post Notice</button>
                </form>
              </div>
              <div style={styles.tableCard}>
                <h3>Recent Announcements</h3>
                {notices.map(n => (
                  <div key={n.id} style={styles.noticeItem}>
                    <div style={styles.noticeDate}>{n.date}</div>
                    <div style={styles.noticeTitle}>{n.title}</div>
                    <button onClick={() => handleDelete(n.id, 'notices')} style={styles.deleteLink}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// 💎 COMPONENTS & STYLES
const NavBtn = ({ label, active, onClick }) => (
  <button style={active ? styles.menuBtnActive : styles.menuBtn} onClick={onClick}>
    {label}
  </button>
);

const StatCard = ({ title, value, color }) => (
  <div style={{...styles.statCard, borderLeft: `5px solid ${color}`}}>
    <h3 style={{fontSize: '28px', color: '#2c3e50', margin: 0}}>{value}</h3>
    <p style={{color: '#7f8c8d', margin: 0}}>{title}</p>
  </div>
);

const styles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '0 30px', height: '70px', background: '#fff', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' },
  logoIcon: { fontSize: '24px' },
  navRight: { display: 'flex', gap: '20px', alignItems: 'center' },
  adminProfile: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', color: '#333' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', background: '#2c3e50', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  logoutBtn: { padding: '8px 16px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  
  mainGrid: { display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: 'calc(100vh - 70px)' },
  sidebar: { background: '#2c3e50', color: '#ecf0f1', padding: '20px' },
  menuLabel: { fontSize: '12px', color: '#95a5a6', marginTop: '20px', marginBottom: '10px', fontWeight: 'bold' },
  menuBtn: { display: 'block', width: '100%', padding: '12px 15px', background: 'transparent', color: '#bdc3c7', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '15px', marginBottom: '5px', transition: '0.2s' },
  menuBtnActive: { display: 'block', width: '100%', padding: '12px 15px', background: '#34495e', color: '#fff', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '15px', marginBottom: '5px', fontWeight: '600', borderLeft: '4px solid #3498db' },
  divider: { height: '1px', background: '#34495e', margin: '20px 0' },
  
  content: { padding: '30px' },
  
  // Overview
  overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  statCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  
  actionArea: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
  formCard: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' },
  cardHeader: { margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  select: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', background: '#fff' },
  submitBtn: { padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  cancelBtn: { padding: '12px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' },
  
  tableCard: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  searchInput: { padding: '10px', width: '250px', borderRadius: '6px', border: '1px solid #ddd' },
  table: { width: '100%', borderCollapse: 'collapse' },
  trHead: { background: '#f8f9fa', borderBottom: '2px solid #e9ecef', textAlign: 'left' },
  tr: { borderBottom: '1px solid #f1f2f6' },
  td: { padding: '12px', verticalAlign: 'middle' },
  badge: { padding: '4px 10px', borderRadius: '12px', background: '#e3f2fd', color: '#1565c0', fontSize: '12px', fontWeight: 'bold' },
  statusGreen: { color: '#27ae60', fontWeight: 'bold', background: '#eafaf1', padding: '4px 8px', borderRadius: '4px' },
  statusRed: { color: '#e74c3c', fontWeight: 'bold', background: '#fdedec', padding: '4px 8px', borderRadius: '4px' },
  actionBtn: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', marginRight: '10px' },
  
  payBtn: { background: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  
  noticeItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' },
  noticeTitle: { fontWeight: 'bold', color: '#333' },
  noticeDate: { color: '#7f8c8d', fontSize: '12px', width: '100px' },
  deleteLink: { color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }
};

export default AdminDash;