import React, { useState, useEffect } from 'react';
import soundManager from '../../systems/SoundManager';

const CheckIn = React.memo(function CheckIn() {
  const [isCheckedIn, setIsCheckedIn] = useState(() => localStorage.getItem('hms_checked_in') === 'true');
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('hms_checkin_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hms_checked_in', isCheckedIn);
    localStorage.setItem('hms_checkin_logs', JSON.stringify(logs));
  }, [isCheckedIn, logs]);

  const toggleCheckIn = () => {
    soundManager.confirm();
    const newState = !isCheckedIn;
    setIsCheckedIn(newState);
    
    const newLog = {
      action: newState ? 'CHECK_IN' : 'CHECK_OUT',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      status: 'VERIFIED'
    };
    
    setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10
  };

  return (
    <div style={{ padding: 'var(--space-xl)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cyan)', margin: '0 0 var(--space-sm)' }}>FACILITY ACCESS</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', margin: 0 }}>
          Location perimeter tracking subsystem.
        </p>
      </div>

      <div style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        border: `4px solid ${isCheckedIn ? 'var(--color-green)' : 'var(--color-magenta)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isCheckedIn ? 'rgba(0,255,136,0.05)' : 'rgba(255,0,170,0.05)',
        boxShadow: isCheckedIn ? '0 0 40px rgba(0,255,136,0.2), inset 0 0 20px rgba(0,255,136,0.1)' : '0 0 40px rgba(255,0,170,0.2), inset 0 0 20px rgba(255,0,170,0.1)',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        marginBottom: 'var(--space-2xl)'
      }} onClick={toggleCheckIn} onMouseEnter={() => soundManager.hover()}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 'bold', color: isCheckedIn ? 'var(--color-green)' : 'var(--color-magenta)', marginBottom: '8px' }}>
          {isCheckedIn ? 'ONLINE' : 'OFFLINE'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
          {isCheckedIn ? 'Checked In' : 'Checked Out'}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '16px' }}>RECENT ACTIVITY</h3>
        
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>No logs found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderLeft: `2px solid ${log.action === 'CHECK_IN' ? 'var(--color-green)' : 'var(--color-magenta)'}` }}>
                <span><span style={{ color: 'var(--color-text-muted)', marginRight: '12px' }}>[{log.time}]</span> <span style={{ color: log.action === 'CHECK_IN' ? 'var(--color-green)' : 'var(--color-magenta)' }}>{log.action}</span></span>
                <span style={{ color: 'var(--color-cyan)', fontSize: '11px' }}>{log.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
});

export default CheckIn;
