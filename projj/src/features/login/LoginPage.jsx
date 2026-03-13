import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import soundManager from '../../systems/SoundManager';
import '../../styles/login.css';

const AUTH_STEPS = [
  "ESTABLISHING SECURE CONNECTION...",
  "VERIFYING CREDENTIALS...",
  "ACCESS GRANTED."
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('participant');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return;

    soundManager.keystroke();
    setAuthenticating(true);
    setAuthStep(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < AUTH_STEPS.length) {
        setAuthStep(currentStep);
      } else {
        clearInterval(interval);
        soundManager.confirm();
        
        localStorage.setItem('hms_user', JSON.stringify({
          username,
          role,
          id: Math.random().toString(36).substr(2, 9),
          token: 'SYS_TKN_' + Date.now().toString(16).toUpperCase()
        }));

        setTimeout(() => navigate('/dashboard'), 600);
      }
    }, 500);
  };

  return (
    <div className="login-wrapper">
      <div className="login-scanlines"></div>
      
      <motion.div 
        className="login-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header">
          <div 
            className="terminal-title glitch-text" 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer' }}
          >
            BYTEPUNK_AUTH
            <span className="terminal-cursor"></span>
          </div>
          <p style={{ color: 'var(--color-green-dim)', marginTop: '8px', fontSize: 'var(--text-sm)', letterSpacing: '0.1em' }}>
            UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.
          </p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          
          <div className="role-selector">
            <button 
              type="button"
              className={`role-btn ${role === 'participant' ? 'active' : ''}`}
              onClick={() => { setRole('participant'); soundManager.click(); }}
            >
              PARTICIPANT
            </button>
            <button 
              type="button"
              className={`role-btn ${role === 'judge' ? 'active' : ''}`}
              onClick={() => { setRole('judge'); soundManager.click(); }}
            >
              JUDGE
            </button>
            <button 
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => { setRole('admin'); soundManager.click(); }}
            >
              ADMIN
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">IDENTIFIER</label>
            <input 
              ref={inputRef}
              type="text" 
              className="form-input" 
              placeholder="ENTER SYSTEM ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={authenticating}
              spellCheck="false"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label">PASSCODE</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authenticating}
            />
          </div>

          <button 
            type="submit" 
            className="login-submit"
            disabled={authenticating || !username || !password}
            onMouseEnter={() => soundManager.hover()}
          >
            {authenticating ? 'PROCESSING...' : 'INITIALIZE_CONNECTION'}
          </button>

          {authenticating && (
            <div className="auth-sequence">
              {AUTH_STEPS.slice(0, authStep + 1).map((step, index) => (
                <motion.div 
                  key={index} 
                  className={`auth-step ${index === AUTH_STEPS.length - 1 ? 'success' : ''}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {step}
                </motion.div>
              ))}
            </div>
          )}

        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
