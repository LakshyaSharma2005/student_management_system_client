import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDash = () => {
  const [attendance, setAttendance] = useState([]);
  const [studentProfile, setStudentProfile] = useState({ name: 'Student', email: '', course: 'BCA' });
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Load User Info from LocalStorage (fastest way)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        setStudentProfile({ ...studentProfile, name: user.name, email: user.email || 'student@college.edu' });
    }

    // 2. Fetch Attendance Data from Backend
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/attendance`, {
        headers: { Authorization: token }
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // 📊 Calculate Stats dynamically
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(r => r.status === 'Present').length;
  const absentClasses = totalClasses - presentClasses;
  const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(0) : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🎓 Student Portal</h1>
          <p style={styles.subtitle}>Welcome back, {studentProfile.name}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Main Grid Layout */}
      <div style={styles.dashboardGrid}>
        
        {/* Left Column: Profile & Stats */}
        <div style={styles.leftColumn}>
          
          {/* Profile Card */}
          <div style={styles.card}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>{studentProfile.name.charAt(0)}</div>
              <div>
                <h3 style={{margin: 0}}>{studentProfile.name}</h3>
                <span style={styles.badge}>{studentProfile.course}</span>
              </div>
            </div>
            <div style={styles.divider}></div>
            <div style={styles.detailRow}>
              <span>📧 Email:</span>
              <span>{studentProfile.email}</span>
            </div>
          </div>

          {/* Attendance Stats Card */}
          <div style={styles.card}>
            <h3>📊 Overview</h3>
            <div style={styles.bigStat}>{percentage}%</div>
            <p style={{textAlign: 'center', color: '#666'}}>Overall Attendance</p>
            
            <div style={styles.miniStatsRow}>
              <div style={{textAlign: 'center'}}>
                <h4>{presentClasses}</h4>
                <small>Present</small>
              </div>
              <div style={{textAlign: 'center', color: '#e74c3c'}}>
                <h4>{absentClasses}</h4>
                <small>Absent</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attendance History Table */}
        <div style={styles.rightColumn}>
          <div style={styles.card}>
            <h3 style={{marginBottom: '20px'}}>📅 Attendance History</h3>
            
            {attendance.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>{record.date}</td>
                      <td style={styles.td}>{record.subject}</td>
                      <td style={styles.td}>
                        <span style={record.status === 'Present' ? styles.statusPresent : styles.statusAbsent}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{textAlign: 'center', color: '#888', padding: '20px'}}>No attendance records found yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// 💅 Modern CSS-in-JS
const styles = {
  container: { padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { color: '#2c3e50', fontSize: '28px', fontWeight: '800', margin: 0 },
  subtitle: { color: '#7f8c8d', marginTop: '5px' },
  logoutBtn: { padding: '10px 20px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },

  dashboardGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: '20px' },
  rightColumn: { display: 'flex', flexDirection: 'column' },

  card: { background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  
  // Profile Styles
  profileHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', background: '#3498db', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
  badge: { background: '#e1f5fe', color: '#0288d1', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  divider: { height: '1px', background: '#eee', margin: '15px 0' },
  detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555' },

  // Stats Styles
  bigStat: { fontSize: '48px', fontWeight: '800', color: '#27ae60', textAlign: 'center', margin: '10px 0' },
  miniStatsRow: { display: 'flex', justifyContent: 'space-around', marginTop: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '12px' },

  // Table Styles
  table: { width: '100%', borderCollapse: 'collapse' },
  trHead: { borderBottom: '2px solid #eee' },
  th: { textAlign: 'left', padding: '15px', color: '#888', fontSize: '14px' },
  tr: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '15px', verticalAlign: 'middle', color: '#333' },
  
  statusPresent: { background: '#d4edda', color: '#155724', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  statusAbsent: { background: '#f8d7da', color: '#721c24', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }
};

export default StudentDash;