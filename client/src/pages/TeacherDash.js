import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDash = () => {
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');

  // Dummy subjects - In real app, fetch from DB
  const subjects = ['Mathematics', 'Physics', 'Computer Science', 'English'];

  // Fetch Students on Load
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/students`, {
          headers: { Authorization: token }
        });
        setStudents(res.data);
        
        // Initialize all students as "Present" by default
        const initialStatus = {};
        res.data.forEach(s => initialStatus[s._id] = 'Present');
        setAttendance(initialStatus);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject) {
      alert("Please select a subject first!");
      return;
    }
    
    const payload = {
      date: selectedDate,
      subject: selectedSubject,
      records: Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status
      }))
    };

    console.log("Submitting:", payload);
    // Here you would call axios.post('/api/teacher/attendance', payload)
    setMessage("✅ Attendance Submitted Successfully!");
    setTimeout(() => setMessage(''), 3000);
  };

  // Stats Calculation
  const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
  const absentCount = students.length - presentCount;

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>👨‍🏫 Classroom Manager</h1>
        <button onClick={() => {localStorage.removeItem('token'); window.location.href='/'}} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Controls Bar */}
      <div style={styles.controlsCard}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Select Date</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}>Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, borderLeft: '4px solid #4CAF50'}}>
          <h3>{presentCount}</h3>
          <p>Present</p>
        </div>
        <div style={{...styles.statCard, borderLeft: '4px solid #F44336'}}>
          <h3>{absentCount}</h3>
          <p>Absent</p>
        </div>
        <div style={{...styles.statCard, borderLeft: '4px solid #2196F3'}}>
          <h3>{students.length}</h3>
          <p>Total Students</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={styles.tableCard}>
        {message && <div style={styles.successMsg}>{message}</div>}
        
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHead}>
              <th style={styles.th}>Student Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.avatarRow}>
                    <div style={styles.avatar}>{student.name.charAt(0)}</div>
                    {student.name}
                  </div>
                </td>
                <td style={styles.td}>{student.email}</td>
                <td style={styles.td}>
                  <div style={styles.toggleContainer}>
                    <button 
                      style={attendance[student._id] === 'Present' ? styles.btnPresentActive : styles.btnInactive}
                      onClick={() => handleStatusChange(student._id, 'Present')}
                    >
                      Present
                    </button>
                    <button 
                      style={attendance[student._id] === 'Absent' ? styles.btnAbsentActive : styles.btnInactive}
                      onClick={() => handleStatusChange(student._id, 'Absent')}
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handleSubmit} style={styles.submitBtn}>
        Submit Attendance 🚀
      </button>
    </div>
  );
};

// 💅 CSS-in-JS Styles for that "Modern" Look
const styles = {
  container: { padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { color: '#1a1a1a', fontSize: '28px', fontWeight: '700' },
  logoutBtn: { padding: '10px 20px', background: '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  
  controlsCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '20px', marginBottom: '20px' },
  controlGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  label: { fontSize: '14px', color: '#666', fontWeight: '600' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', background: '#fff' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
  statCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' },

  tableCard: { background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', padding: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  trHead: { borderBottom: '2px solid #eee' },
  th: { padding: '15px', textAlign: 'left', color: '#444', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '15px', verticalAlign: 'middle' },
  
  avatarRow: { display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  
  toggleContainer: { display: 'flex', gap: '10px' },
  btnInactive: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: '#fff', color: '#666', cursor: 'pointer', transition: '0.3s' },
  btnPresentActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#e0f2f1', color: '#00695c', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #00695c' },
  btnAbsentActive: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#ffebee', color: '#c62828', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #c62828' },

  submitBtn: { display: 'block', width: '100%', padding: '16px', marginTop: '30px', background: '#000', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', border: 'none', transition: 'transform 0.2s' },
  successMsg: { padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }
};

export default TeacherDash;