import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔒 HARDCODED BACKEND URL
  const SERVER_URL = "https://student-management-system-server-vygt.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, { email, password });

      if (res.data.token && res.data.user) {
        login(res.data.user);
        localStorage.setItem('token', res.data.token);

        const role = res.data.user.role;
        if (role === 'Admin') navigate('/admin-dash');
        else if (role === 'Teacher') navigate('/teacher-dash');
        else if (role === 'Student') navigate('/student-dash');
      } 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* 👑 Royal Background */}
      <div style={styles.overlay}></div>

      <div style={styles.glassCard}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logoCircle}>🏛️</div>
          <h1 style={styles.title}>Royal Institute</h1>
          <p style={styles.subtitle}>Sign in to your dashboard</p>
        </div>

        {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              placeholder="admin1@gmail.com"
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? styles.buttonLoading : styles.button}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? 'Verifying...' : 'Secure Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Trouble logging in?{' '}
          <span 
            style={styles.link} 
            onClick={() => setShowForgotModal(true)}
          >
            Reset Password
          </span>
        </p>
      </div>

      {/* 🔐 FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>🔐 Reset Password</h3>
            <p style={styles.modalText}>
              For security reasons, password resets must be approved by the administration.
            </p>
            <div style={styles.adminContact}>
              <p><strong>Admin Contact:</strong></p>
              <p style={{color: '#4facfe'}}>support@college.edu</p>
              <p>+91 98765-43210</p>
            </div>
            <button 
              onClick={() => setShowForgotModal(false)} 
              style={styles.closeBtn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* 🎨 ROYAL THEME STYLES */
const styles = {
  page: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Deep Royal Blue Gradient
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fontFamily: "'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  overlay: {
    position: 'absolute', width: '100%', height: '100%',
    background: 'radial-gradient(circle at 50% 10%, rgba(255,255,255,0.1) 0%, transparent 60%)',
    pointerEvents: 'none'
  },
  glassCard: {
    background: 'rgba(20, 20, 35, 0.6)', // Dark glass
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderRadius: '20px',
    padding: '45px 40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 10
  },
  header: { textAlign: 'center', marginBottom: '35px' },
  logoCircle: {
    fontSize: '40px', marginBottom: '10px', 
    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))' // Gold glow
  },
  title: { margin: '0', color: '#fff', fontSize: '26px', fontWeight: '700', letterSpacing: '1px' },
  subtitle: { margin: '8px 0 0', color: '#a0a0c0', fontSize: '14px' },
  
  errorBanner: {
    background: 'rgba(220, 38, 38, 0.2)', color: '#ff8888', padding: '12px', 
    borderRadius: '8px', fontSize: '13px', marginBottom: '20px', textAlign: 'center',
    border: '1px solid rgba(220, 38, 38, 0.5)'
  },
  
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#cfcfdd', fontSize: '13px', fontWeight: '600', marginLeft: '4px' },
  input: {
    width: '100%', padding: '14px', borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)', 
    background: 'rgba(255, 255, 255, 0.05)',
    fontSize: '15px', color: '#fff', outline: 'none',
    transition: 'all 0.3s', boxSizing: 'border-box'
  },
  
  button: {
    width: '100%', padding: '16px',
    // Gold/Royal Gradient
    background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
    color: '#332200', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '800', cursor: 'pointer',
    marginTop: '10px', boxShadow: '0 4px 15px rgba(253, 185, 49, 0.3)',
    transition: 'transform 0.2s'
  },
  buttonLoading: {
    width: '100%', padding: '16px', background: '#444',
    color: '#888', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '10px'
  },
  
  footer: { textAlign: 'center', marginTop: '25px', fontSize: '13px', color: '#8888aa' },
  link: { color: '#FFD700', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' },

  // MODAL STYLES
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modalCard: {
    background: '#1a1a2e', padding: '30px', borderRadius: '16px',
    width: '90%', maxWidth: '320px', textAlign: 'center',
    border: '1px solid #333', boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
  },
  modalTitle: { color: '#fff', marginTop: 0 },
  modalText: { color: '#ccc', fontSize: '14px', lineHeight: '1.5' },
  adminContact: { 
    background: 'rgba(255,255,255,0.05)', padding: '15px', 
    borderRadius: '8px', margin: '20px 0', color: '#fff' 
  },
  closeBtn: {
    background: 'transparent', border: '1px solid #555', color: '#fff',
    padding: '8px 20px', borderRadius: '20px', cursor: 'pointer',
    fontSize: '13px', transition: 'background 0.2s'
  }
};

export default Login;