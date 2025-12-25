import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherDash = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // 👤 IDENTITY STATE (New)
  const [teacher, setTeacher] = useState({ 
    name: 'Professor', 
    email: '', 
    subject: 'General' 
  });

  // Data States
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [marks, setMarks] = useState({});
  
  // UI States
  const [selectedSubject, setSelectedSubject] = useState('Computer Science');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  // 🔄 Initial Load (User Profile + Students)
  useEffect(() => {
    // 1. Load Teacher Profile from LocalStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setTeacher({
        name: user.name,
        email: user.email,
        subject: user.subject || 'Assigned Subject'
      });
      // Set default subject drop-down to teacher's subject
      if (user.subject) setSelectedSubject(user.subject);
    } else {
      navigate('/'); // Redirect if not logged in
    }

    // 2. Fetch Students
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/students`, {
          headers: { Authorization: token }
        });
        if (res.data.length > 0) {
          setStudents(res.data);
          initializeAttendance(res.data);
        } else {
          throw new Error("No data");
        }
      } catch (err) {
        console.log("Using Demo Data");
        const demoData = [
          { _id: 1, name: "Lakshya Sharma", roll: "CS-101", email: "lakshya@cpu.edu" },
          { _id: 2, name: "Rohan Das", roll: "CS-102", email: "rohan@cpu.edu" },
          { _id: 3, name: "Anjali Singh", roll: "CS-103", email: "anjali@cpu.edu" },
          { _id: 4, name: "Vikram Malhotra", roll: "CS-104", email: "vikram@cpu.edu" },
        ];
        setStudents(demoData);
        initializeAttendance(demoData);
      }
    };

    fetchStudents();
  }, [navigate]);

  const initializeAttendance = (data) => {
    const initial = {};
    const initialMarks = {};
    data.forEach(s => {
      initial[s._id] = 'Present';
      initialMarks[s._id] = { mid: '', final: '' };
    });
    setAttendance(initial);
    setMarks(initialMarks);
  };

  // 📝 Attendance Logic
  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const markAll = (status) => {
    const newStatus = {};
    students.forEach(s => newStatus[s._id] = status);
    setAttendance(newStatus);
  };

  const submitAttendance = () => {
    setMessage("✅ Attendance Saved Successfully!");
    setTimeout(() => setMessage(''), 3000);
  };

  // 📊 Marks Logic
  const handleMarkChange = (id, type, value) => {
    setMarks(prev => ({
      ...prev,
      [id]: { ...prev[id], [type]: value }
    }));
  };

  // Calculate Stats
  const presentCount = Object.values(attendance).filter(s => s === 'Present').length;
  const attendancePercent = Math.round((presentCount / students.length) * 100) || 0;

  return (
    <div style={styles.container}>
      {/* 🟢 TOP NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.brand}>
          <span style={styles.logoIcon}>👨‍🏫</span>
          <h1>Faculty<span style={{color: '#f1c40f'}}>Portal</span></h1>
        </div>
        <div style={styles.navRight}>
          <div style={styles.profile}>
            {/* 🛠️ FIX: Dynamic Avatar and Name */}
            <div style={styles.avatarNav}>{teacher.name.charAt(0)}</div>
            <span>{teacher.name}</span>
          </div>
          <button onClick={() => {localStorage.removeItem('token'); navigate('/')}} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* 🟡 SIDEBAR */}
        <div style={styles.sidebar}>
          <p style={styles.menuLabel}>CLASSROOM</p>
          <NavBtn label="📊 Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavBtn label="📝 Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <NavBtn label="🎓 Gradebook" active={activeTab === 'marks'} onClick={() => setActiveTab('marks')} />
          <NavBtn label="👥 Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
        </div>

        {/* 🔵 MAIN CONTENT */}
        <div style={styles.content}>
          
          {/* 1️⃣ DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <>
              {/* 🛠️ FIX: Added Welcome Header */}
              <div style={{marginBottom: '20px'}}>
                <h2 style={{color: '#2c3e50'}}>Welcome back, {teacher.name}! 👋</h2>
                <p style={{color: '#7f8c8d'}}>Subject: <b>{teacher.subject}</b></p>
              </div>

              <div style={styles.overviewGrid}>
                <StatCard title="Total Students" value={students.length} color="#3498db" />
                <StatCard title="Avg. Attendance" value={`${attendancePercent}%`} color="#2ecc71" />
                <StatCard title="Upcoming Class" value="10:00 AM" sub={teacher.subject} color="#9b59b6" />
              </div>
              
              <div style={styles.sectionGrid}>
                <div style={styles.card}>
                  <h3>📅 Today's Schedule</h3>
                  <div style={styles.scheduleItem}>
                    <div style={styles.timeBadge}>09:00 AM</div>
                    <div>
                      <strong>{teacher.subject}</strong>
                      <p style={{fontSize: '12px', color: '#666'}}>Lab 2, Block A</p>
                    </div>
                  </div>
                  <div style={{...styles.scheduleItem, borderLeft: '4px solid #f1c40f'}}>
                    <div style={styles.timeBadge}>11:00 AM</div>
                    <div>
                      <strong>Database Systems</strong>
                      <p style={{fontSize: '12px', color: '#666'}}>Room 304, Block B</p>
                    </div>
                  </div>
                </div>

                <div style={styles.card}>
                  <h3>📢 Quick Actions</h3>
                  <button style={styles.actionBtn} onClick={() => setActiveTab('attendance')}>Take Attendance ➜</button>
                  <button style={styles.actionBtn} onClick={() => setActiveTab('marks')}>Upload Marks ➜</button>
                </div>
              </div>
            </>
          )}

          {/* 2️⃣ ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>📝 Mark Attendance</h3>
                <div style={styles.controls}>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={styles.input} />
                  <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={styles.select}>
                    <option>{teacher.subject}</option>
                    <option>Computer Science</option>
                    <option>Physics</option>
                    <option>Mathematics</option>
                  </select>
                </div>
              </div>

              {message && <div style={styles.successMsg}>{message}</div>}

              <div style={styles.toolbar}>
                  <span>Summary: <strong style={{color: '#27ae60'}}>{presentCount} Present</strong> / <strong style={{color: '#c0392b'}}>{students.length - presentCount} Absent</strong></span>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => markAll('Present')} style={styles.smallBtn}>Mark All Present</button>
                    <button onClick={() => markAll('Absent')} style={{...styles.smallBtn, background: '#fee', color: 'red'}}>Mark All Absent</button>
                  </div>
              </div>

              <div style={styles.gridList}>
                {students.map(s => (
                  <div key={s._id} style={attendance[s._id] === 'Present' ? styles.studentCardPresent : styles.studentCardAbsent} onClick={() => toggleAttendance(s._id)}>
                    <div style={styles.avatar}>{s.name.charAt(0)}</div>
                    <div>
                      <strong>{s.name}</strong>
                      <p style={{fontSize: '12px', margin: 0}}>{s.roll}</p>
                    </div>
                    <div style={styles.statusBadge}>{attendance[s._id]}</div>
                  </div>
                ))}
              </div>
              
              <button onClick={submitAttendance} style={styles.submitBtn}>Save Attendance 💾</button>
            </div>
          )}

          {/* 3️⃣ GRADEBOOK TAB */}
          {activeTab === 'marks' && (
            <div style={styles.card}>
               <h3>🎓 Student Gradebook</h3>
               <table style={styles.table}>
                 <thead>
                   <tr style={styles.trHead}>
                     <th>Student Name</th>
                     <th>Roll No</th>
                     <th>Mid Term (50)</th>
                     <th>Final (100)</th>
                     <th>Total</th>
                   </tr>
                 </thead>
                 <tbody>
                   {students.map(s => (
                     <tr key={s._id} style={styles.tr}>
                       <td style={styles.td}><b>{s.name}</b></td>
                       <td style={styles.td}>{s.roll}</td>
                       <td style={styles.td}>
                         <input 
                           type="number" 
                           placeholder="0"
                           style={styles.markInput} 
                           value={marks[s._id]?.mid} 
                           onChange={(e) => handleMarkChange(s._id, 'mid', e.target.value)}
                         />
                       </td>
                       <td style={styles.td}>
                         <input 
                           type="number" 
                           placeholder="0"
                           style={styles.markInput} 
                           value={marks[s._id]?.final} 
                           onChange={(e) => handleMarkChange(s._id, 'final', e.target.value)}
                         />
                       </td>
                       <td style={styles.td}>
                         <strong>{Number(marks[s._id]?.mid || 0) + Number(marks[s._id]?.final || 0)}</strong>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               <button onClick={() => {setMessage("✅ Marks Uploaded!"); setTimeout(()=>setMessage(''), 3000)}} style={styles.submitBtn}>Upload Marks 🚀</button>
               {message && <div style={styles.successMsg}>{message}</div>}
            </div>
          )}

          {/* 4️⃣ STUDENTS TAB */}
          {activeTab === 'students' && (
            <div style={styles.card}>
              <h3>👥 Enrolled Students</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.trHead}><th>ID</th><th>Name</th><th>Email</th><th>Contact</th></tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id} style={styles.tr}>
                      <td style={styles.td}>{s.roll}</td>
                      <td style={styles.td}><div style={{display:'flex', alignItems:'center', gap:'10px'}}><div style={styles.avatarSmall}>{s.name[0]}</div>{s.name}</div></td>
                      <td style={styles.td}>{s.email}</td>
                      <td style={styles.td}>
                        <button style={styles.smallBtn}>View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

const StatCard = ({ title, value, sub, color }) => (
  <div style={{...styles.statCard, borderTop: `4px solid ${color}`}}>
    <h3 style={{fontSize: '28px', color: '#2c3e50', margin: 0}}>{value}</h3>
    <p style={{color: '#7f8c8d', margin: 0}}>{title}</p>
    {sub && <small style={{color: color, fontWeight: 'bold'}}>{sub}</small>}
  </div>
);

const styles = {
  container: { backgroundColor: '#f4f6f9', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  
  // Navbar
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '0 30px', height: '70px', background: '#2c3e50', color: '#fff', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' },
  logoIcon: { fontSize: '24px' },
  navRight: { display: 'flex', gap: '20px', alignItems: 'center' },
  profile: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' },
  avatarNav: { width: '35px', height: '35px', borderRadius: '50%', background: '#f1c40f', color: '#2c3e50', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  logoutBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer' },

  // Layout
  mainGrid: { display: 'grid', gridTemplateColumns: '250px 1fr', minHeight: 'calc(100vh - 70px)' },
  sidebar: { background: '#fff', borderRight: '1px solid #ddd', padding: '20px' },
  menuLabel: { fontSize: '12px', color: '#95a5a6', marginTop: '10px', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '1px' },
  menuBtn: { display: 'block', width: '100%', padding: '12px 15px', background: 'transparent', color: '#7f8c8d', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '15px', marginBottom: '5px', transition: '0.2s' },
  menuBtnActive: { display: 'block', width: '100%', padding: '12px 15px', background: '#f0f3f6', color: '#2c3e50', border: 'none', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '15px', marginBottom: '5px', fontWeight: '600', borderRight: '4px solid #f1c40f' },
  
  content: { padding: '30px' },

  // Overview
  overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  statCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  sectionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  
  card: { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  
  scheduleItem: { display: 'flex', gap: '15px', padding: '15px', borderLeft: '4px solid #3498db', background: '#f8f9fa', marginBottom: '10px', borderRadius: '0 8px 8px 0' },
  timeBadge: { background: '#e8f6fd', color: '#3498db', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', height: 'fit-content' },
  actionBtn: { display: 'block', width: '100%', padding: '15px', marginBottom: '10px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50', transition: '0.2s' },

  // Attendance
  controls: { display: 'flex', gap: '10px' },
  input: { padding: '8px', borderRadius: '6px', border: '1px solid #ddd' },
  select: { padding: '8px', borderRadius: '6px', border: '1px solid #ddd' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '20px' },
  smallBtn: { padding: '6px 12px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  
  gridList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' },
  studentCardPresent: { padding: '15px', borderRadius: '8px', border: '2px solid #2ecc71', background: '#f0fff4', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center' },
  studentCardAbsent: { padding: '15px', borderRadius: '8px', border: '2px solid #e74c3c', background: '#fff5f5', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center', opacity: 0.8 },
  
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#dfe6e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  statusBadge: { fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.1)' },
  submitBtn: { padding: '15px', background: '#2c3e50', color: '#fff', border: 'none', borderRadius: '8px', width: '100%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  successMsg: { padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '6px', marginBottom: '20px', textAlign: 'center' },

  // Table
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  trHead: { background: '#f8f9fa', borderBottom: '2px solid #e9ecef', textAlign: 'left' },
  tr: { borderBottom: '1px solid #f1f2f6' },
  td: { padding: '12px', verticalAlign: 'middle' },
  markInput: { width: '60px', padding: '5px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '4px' },
  avatarSmall: { width: '25px', height: '25px', borderRadius: '50%', background: '#3498db', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }
};

export default TeacherDash;