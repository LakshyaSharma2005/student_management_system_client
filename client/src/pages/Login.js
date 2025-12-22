import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔒 HARDCODED BACKEND URL (Ensures mobile works even if env vars fail)
  const SERVER_URL = "https://student-management-system-server-vygt.onrender.com";

  const handleLoginSuccess = (data) => {
    // 1. Save Token & User
    login(data.user);
    localStorage.setItem('token', data.token);

    // 2. Redirect based on Role
    const role = data.user.role;
    if (role === 'Admin') navigate('/admin-dash');
    else if (role === 'Teacher') navigate('/teacher-dash');
    else if (role === 'Student') navigate('/student-dash');
    else setError(`Unknown Role: ${role}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the hardcoded URL to be 100% sure
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, { 
        email, 
        password 
      });

      if (res.data.token && res.data.user) {
        handleLoginSuccess(res.data);
      } else {
        setError("Login succeeded but server sent no data.");
      }

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
    setLoading(false);
  };

  // 🧪 DEBUG FUNCTION FOR PHONE
  const magicMobileLogin = async () => {
    try {
      alert("⏳ Attempting Magic Login...");
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email: "admin1@gmail.com",   // The account we KNOW works
        password: "admin1234"        // The password we KNOW works
      });
      alert("✅ SUCCESS! Redirecting...");
      handleLoginSuccess(res.data);
    } catch (err) {
      alert("❌ FAILED: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={styles.container}>
      {/* Background decoration circles */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Enter your credentials to access the portal</p>
        </div>

        {/* 🧪 MAGIC DEBUG BUTTON (Remove this later) */}
        <button 
          type="button" 
          onClick={magicMobileLogin} 
          style={styles.magicBtn}
        >
          📱 Tap Here to Fix Mobile Login
        </button>

        {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@college.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Forgot password? Contact Admin.</p>
        </div>
      </div>
    </div>
  );
};

// 💅 MODERN UI STYLES (Glassmorphism & Clean)
const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    height: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif"
  },
  // Decorative Background Circles
  circle1: { position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(0, 123, 255, 0.15)', borderRadius: '50%', zIndex: 0 },
  circle2: { position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'rgba(108, 92, 231, 0.1)', borderRadius: '50%', zIndex: 0 },

  card: {
    position: 'relative', zIndex: 10,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '40px', borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%', maxWidth: '400px',
    textAlign: 'center'
  },
  header: { marginBottom: '30px' },
  title: { margin: 0, color: '#1a1a1a', fontSize: '28px', fontWeight: '800' },
  subtitle: { margin: '10px 0 0', color: '#666', fontSize: '14px' },

  magicBtn: {
    background: '#ff4757', color: '#fff', border: 'none',
    width: '100%', padding: '12px', borderRadius: '8px',
    fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px',
    boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)',
    animation: 'pulse 2s infinite'
  },
  
  errorMsg: {
    background: '#ffebee', color: '#c62828', padding: '12px', 
    borderRadius: '8px', marginBottom: '20px', fontSize: '13px', 
    fontWeight: '600', border: '1px solid #ffcdd2'
  },
  
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { textAlign: 'left' },
  label: { display: 'block', marginBottom: '8px', color: '#444', fontSize: '13px', fontWeight: '600' },
  input: {
    width: '100%', padding: '14px', borderRadius: '10px',
    border: '1px solid #e1e1e1', background: '#f9f9f9',
    fontSize: '15px', transition: 'all 0.3s',
    outline: 'none', boxSizing: 'border-box'
  },
  
  button: {
    width: '100%', padding: '16px', background: 'linear-gradient(to right, #2563eb, #3b82f6)',
    color: '#fff', border: 'none', borderRadius: '12px',
    cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'transform 0.2s'
  },
  footer: { marginTop: '25px', fontSize: '12px', color: '#888' }
};

export default Login;