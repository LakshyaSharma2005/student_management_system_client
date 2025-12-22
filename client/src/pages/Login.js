import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🗑️ Removed unused 'focusedInput' state here!

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
      {/* 🌌 Animated Background */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .input-group:focus-within label,
        .input-group input:not(:placeholder-shown) + label {
          transform: translateY(-25px) scale(0.85);
          color: #4facfe;
        }
      `}</style>

      <div style={styles.glassCard}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.logoCircle}>🎓</div>
          <h1 style={styles.title}>StudentOS</h1>
          <p style={styles.subtitle}>Welcome back, please login.</p>
        </div>

        {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* Email Field */}
          <div style={styles.inputGroup} className="input-group">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              placeholder=" "
              required 
            />
            <label style={styles.label}>Email Address</label>
          </div>

          {/* Password Field */}
          <div style={styles.inputGroup} className="input-group">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
              placeholder=" "
              required 
            />
            <label style={styles.label}>Password</label>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? styles.buttonLoading : styles.button}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? <span style={styles.loader}></span> : 'Access Portal →'}
          </button>
        </form>

        <p style={styles.footer}>
          Forgot Password? <span style={styles.link}>Contact Admin</span>
        </p>
      </div>
    </div>
  );
};

/* 🎨 THE STYLES */
const styles = {
  page: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 15s ease infinite',
    fontFamily: "'Segoe UI', sans-serif",
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '50px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    animation: 'float 6s ease-in-out infinite',
  },
  header: { textAlign: 'center', marginBottom: '40px' },
  logoCircle: {
    width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '30px', margin: '0 auto 15px', color: 'white', boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)'
  },
  title: { margin: '0', color: '#333', fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' },
  subtitle: { margin: '8px 0 0', color: '#666', fontSize: '15px' },
  
  errorBanner: {
    background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '12px',
    fontSize: '14px', fontWeight: '600', marginBottom: '20px', textAlign: 'center',
    border: '1px solid #fecaca'
  },
  
  form: { display: 'flex', flexDirection: 'column', gap: '25px' },
  
  inputGroup: { position: 'relative' },
  input: {
    width: '100%', padding: '16px 16px', borderRadius: '12px',
    border: '2px solid #e2e8f0', background: 'transparent',
    fontSize: '16px', color: '#1e293b', outline: 'none',
    transition: 'border-color 0.3s', boxSizing: 'border-box',
    fontWeight: '500'
  },
  label: {
    position: 'absolute', left: '16px', top: '16px',
    color: '#94a3b8', fontSize: '16px', pointerEvents: 'none',
    transition: '0.2s ease all', background: 'rgba(255,255,255,0.9)', padding: '0 4px'
  },
  
  button: {
    width: '100%', padding: '18px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '14px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 10px 20px rgba(118, 75, 162, 0.3)',
    marginTop: '10px'
  },
  buttonLoading: {
    width: '100%', padding: '18px', background: '#ccc',
    color: '#666', border: 'none', borderRadius: '14px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '10px'
  },
  
  footer: { textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#64748b' },
  link: { color: '#764ba2', fontWeight: '700', cursor: 'pointer' },
  
  loader: {
    display: 'inline-block', width: '20px', height: '20px',
    border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%',
    borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite'
  }
};

export default Login;