import React, { useState, useEffect } from 'react';
import soundManager from '../../systems/SoundManager';

const STAGES = [
  { id: 1, name: 'SYSTEM_REGISTRATION', desc: 'Acquire identity and clearance.' },
  { id: 2, name: 'TEAM_FORMATION', desc: 'Establish network connections.' },
  { id: 3, name: 'BUILD_PROTOCOL', desc: 'Deploy codebase to local nodes.' },
  { id: 4, name: 'FINAL_SUBMISSION', desc: 'Upload project to mainframe.' }
];

const MissionProgress = React.memo(function MissionProgress() {
  const [currentStage, setCurrentStage] = useState(() => {
    return parseInt(localStorage.getItem('hms_mission_stage') || '1');
  });

  useEffect(() => {
    localStorage.setItem('hms_mission_stage', currentStage.toString());
  }, [currentStage]);

  const advanceStage = () => {
    if (currentStage < STAGES.length) {
      soundManager.confirm();
      setCurrentStage(prev => prev + 1);
    }
  };

  const getStatus = (stageId) => {
    if (stageId < currentStage) return 'COMPLETED';
    if (stageId === currentStage) return 'IN_PROGRESS';
    return 'LOCKED';
  };

  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <div className="win-header" style={{ marginBottom: 'var(--space-2xl)' }}>
        <span className="win-title">Mission Protocol Logs</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', position: 'relative' }}>
        {/* Connecting Line */}
        <div style={{ 
          position: 'absolute', 
          left: '24px', 
          top: '24px', 
          bottom: '24px', 
          width: '2px', 
          background: 'var(--color-border)',
          zIndex: 0
        }} />
        <div style={{ 
          position: 'absolute', 
          left: '24px', 
          top: '24px', 
          height: `${((currentStage - 1) / (STAGES.length - 1)) * 100}%`, 
          width: '2px', 
          background: 'var(--color-cyan)',
          boxShadow: '0 0 10px var(--color-cyan)',
          transition: 'height 0.5s ease',
          zIndex: 0
        }} />

        {STAGES.map((stage) => {
          const status = getStatus(stage.id);
          const isActive = status === 'IN_PROGRESS';
          const isDone = status === 'COMPLETED';

          return (
            <div key={stage.id} style={{ display: 'flex', gap: 'var(--space-lg)', position: 'relative', zIndex: 1, opacity: status === 'LOCKED' ? 0.5 : 1, transition: 'opacity 0.3s' }}>
              
              {/* Node */}
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                background: isDone ? 'var(--color-cyan)' : isActive ? 'var(--color-bg-panel)' : 'var(--color-bg-void)',
                border: `2px solid ${isDone || isActive ? 'var(--color-cyan)' : 'var(--color-border)'}`,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                color: isDone ? '#000' : isActive ? 'var(--color-cyan)' : 'var(--color-text-muted)',
                boxShadow: isActive || isDone ? '0 0 15px rgba(0,240,255,0.3)' : 'none',
                flexShrink: 0
              }}>
                {isDone ? '✓' : `0${stage.id}`}
              </div>

              {/* Content */}
              <div className="glass-panel" style={{ 
                flex: 1, 
                padding: 'var(--space-md)', 
                borderColor: isActive ? 'var(--color-cyan)' : 'var(--color-border)',
                background: isActive ? 'rgba(0,240,255,0.05)' : 'rgba(16,16,28,0.7)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontFamily: 'var(--font-display)', 
                    color: isActive ? 'var(--color-cyan)' : isDone ? 'var(--color-text-primary)' : 'var(--color-text-muted)', 
                    margin: 0,
                    fontSize: '18px'
                  }}>
                    {stage.name}
                  </h3>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '10px', 
                    padding: '2px 6px', 
                    background: isDone ? 'rgba(0,240,255,0.1)' : isActive ? 'var(--color-cyan)' : 'transparent',
                    color: isDone ? 'var(--color-cyan)' : isActive ? '#000' : 'var(--color-text-muted)',
                    border: `1px solid ${isDone ? 'var(--color-cyan)' : isActive ? 'transparent' : 'var(--color-border)'}`,
                    borderRadius: '2px'
                  }}>
                    {status}
                  </span>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '14px' }}>
                  {stage.desc}
                </p>
                
                {isActive && (
                  <button 
                    className="win-btn primary" 
                    style={{ marginTop: 'var(--space-md)', padding: '4px 12px', fontSize: '12px' }}
                    onClick={advanceStage}
                  >
                    OVERRIDE & ADVANCE STAGE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default MissionProgress;
