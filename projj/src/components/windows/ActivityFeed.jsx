import React, { useState, useEffect, useRef } from 'react';
import soundManager from '../../systems/SoundManager';

const EVENT_TEMPLATES = [
  "New team registered: {TEAM}",
  "Project successfully deployed by {TEAM} (Status: 200 OK)",
  "Security breach attempt detected on Sector 7g",
  "Node {TEAM} established connection with Data Center",
  "Judging scan completed for {TEAM}",
  "Hardware request approved for {TEAM}",
  "System update deployed. All nodes resyncing.",
  "Warning: High bandwidth usage from Node 42",
  "New mentor assigned to area 5",
  "{TEAM} submitted a pull request"
];

const TEAM_NAMES = ['NeuralForge', 'BlockSmith', 'QuantumLeap', 'CyberVault', 'EdgeFlow', 'DataCore', 'SynapseAI', 'NeonGrid'];

const ActivityFeed = React.memo(function ActivityFeed() {
  const [logs, setLogs] = useState([]);
  const feedRef = useRef(null);

  useEffect(() => {
    // Generate initial logs
    const initial = Array.from({ length: 8 }).map((_, i) => createRandomLog(new Date(Date.now() - (8 - i) * 60000)));
    setLogs(initial);

    // Live feed interval
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, createRandomLog(new Date())];
        if (newLogs.length > 50) newLogs.shift();
        return newLogs;
      });
      // Small chance for sound on new event to simulate dashboard activity
      if (Math.random() > 0.7) soundManager.keystroke();
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [logs]);

  function createRandomLog(time) {
    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    const team = TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)];
    const msg = template.replace('{TEAM}', team);
    
    let type = 'info';
    if (msg.includes('Warning') || msg.includes('breach')) type = 'warning';
    if (msg.includes('successfully') || msg.includes('approved')) type = 'success';

    return {
      id: Math.random().toString(36).substr(2, 9),
      time: time.toLocaleTimeString('en-US', { hour12: false }),
      msg,
      type
    };
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-void)' }}>
      <div className="win-header" style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span className="win-title">Global Activity Stream</span>
          <span className="win-badge live">● LIVE</span>
        </div>
      </div>

      <div ref={feedRef} style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {logs.map((log) => {
          let color = 'var(--color-text-primary)';
          if (log.type === 'warning') color = 'var(--color-yellow)';
          if (log.type === 'success') color = 'var(--color-green)';

          return (
            <div 
              key={log.id} 
              style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '13px',
                display: 'flex',
                gap: '12px',
                padding: '4px 0',
                borderBottom: '1px dashed rgba(0,240,255,0.05)',
                animation: 'slideUp 0.3s ease-out'
              }}
            >
              <span style={{ color: 'var(--color-text-muted)', minWidth: '70px' }}>[{log.time}]</span>
              <span style={{ color }}>{log.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ActivityFeed;
