import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import soundManager from '../../systems/SoundManager';
import '../../styles/boot.css';

const BOOT_LOGS = [
  { text: 'Initializing BYTEPUNK v4.2.1', type: 'highlight', delay: 200 },
  { text: 'Loading kernel modules...', type: '', delay: 300 },
  { text: '[OK] Neural interface driver loaded', type: 'success', delay: 250 },
  { text: '[OK] Quantum encryption module active', type: 'success', delay: 200 },
  { text: 'Establishing secure uplink...', type: '', delay: 400 },
  { text: '[WARN] Firewall bypass detected — rerouting', type: 'warning', delay: 350 },
  { text: '[OK] Connection established on port 7331', type: 'success', delay: 200 },
  { text: 'Loading hackathon database...', type: '', delay: 300 },
  { text: '[OK] 247 teams registered', type: 'success', delay: 200 },
  { text: '[OK] Judging criteria synchronized', type: 'success', delay: 150 },
  { text: '[OK] Leaderboard engine ready', type: 'success', delay: 200 },
  { text: 'Initializing AI guide subsystem...', type: '', delay: 400 },
  { text: '[OK] Holographic renderer calibrated', type: 'success', delay: 250 },
  { text: '[OK] Audio system online', type: 'success', delay: 150 },
  { text: 'Running diagnostics...', type: '', delay: 500 },
  { text: '[OK] All systems nominal', type: 'success', delay: 200 },
  { text: '', type: '', delay: 100 },
  { text: 'SYSTEM READY — LAUNCHING BYTEPUNK', type: 'highlight', delay: 300 },
];

const BootSequence = React.memo(function BootSequence() {
  const { setPhase, PHASES } = useApp();
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING');
  const [showActivation, setShowActivation] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const terminalRef = useRef(null);
  const hasBooted = useRef(false);

  const runBoot = useCallback(async () => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    soundManager.init();
    soundManager.boot();

    for (let i = 0; i < BOOT_LOGS.length; i++) {
      await new Promise(r => setTimeout(r, BOOT_LOGS[i].delay));
      setLines(prev => [...prev, BOOT_LOGS[i]]);
      setProgress(((i + 1) / BOOT_LOGS.length) * 100);

      if (i === 4) setStatus('CONNECTING');
      if (i === 10) setStatus('LOADING MODULES');
      if (i === 14) setStatus('RUNNING DIAGNOSTICS');
      if (i === BOOT_LOGS.length - 1) setStatus('SYSTEM READY');

      if (i % 4 === 0) soundManager.keystroke();
    }

    await new Promise(r => setTimeout(r, 600));
    setShowGlitch(true);
    await new Promise(r => setTimeout(r, 200));
    setShowGlitch(false);
    setShowActivation(true);
    soundManager.confirm();
    await new Promise(r => setTimeout(r, 800));
    setPhase(PHASES.AI_GUIDE);
  }, [setPhase, PHASES]);

  useEffect(() => {
    const t = setTimeout(runBoot, 500);
    return () => clearTimeout(t);
  }, [runBoot]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSkip = () => {
    soundManager.init();
    soundManager.click();
    setPhase(PHASES.AI_GUIDE);
  };

  return (
    <div className="boot-screen">
      {showGlitch && <div className="boot-glitch" />}
      {showActivation && <div className="boot-activation" />}

      <div className="boot-content">
        <div className="boot-logo">
          <h1>BYTEPUNK</h1>
          <div className="subtitle">Hackathon Management System</div>
        </div>

        <div className="boot-terminal" ref={terminalRef}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={`boot-line ${line.type}`}
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <span className="prefix">&gt;</span>
              {line.text}
            </div>
          ))}
        </div>

        <div className="boot-progress">
          <div className="boot-progress-bar">
            <div
              className="boot-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="boot-progress-text">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="boot-status">
          {progress < 100 ? (
            <span>System booting<span className="blink">_</span></span>
          ) : (
            <span className="text-cyan">ONLINE</span>
          )}
        </div>

        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            bottom: -40,
            right: 0,
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
          }}
        >
          [SKIP →]
        </button>
      </div>
    </div>
  );
});

export default BootSequence;
