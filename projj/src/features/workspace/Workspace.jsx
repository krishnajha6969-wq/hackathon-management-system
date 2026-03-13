import React, { useEffect, useCallback, useState, lazy, Suspense } from 'react';
import { useApp } from '../../context/AppContext';
import WindowFrame from '../../components/windows/WindowFrame';
import CommandPalette, { TOOLS, getUserRole } from '../../components/ui/CommandPalette';
import soundManager from '../../systems/SoundManager';
import '../../styles/workspace.css';
import '../../styles/windows.css';

// Lazy load window contents
const Leaderboard = lazy(() => import('../../components/windows/Leaderboard'));
const Registrations = lazy(() => import('../../components/windows/Registrations'));
const Judging = lazy(() => import('../../components/windows/Judging'));
const Analytics = lazy(() => import('../../components/windows/Analytics'));
const TeamFormation = lazy(() => import('../../components/windows/TeamFormation'));
const ProjectSubmission = lazy(() => import('../../components/windows/ProjectSubmission'));
const DigitalBadge = lazy(() => import('../../components/windows/DigitalBadge'));
const MissionProgress = lazy(() => import('../../components/windows/MissionProgress'));
const CheckIn = lazy(() => import('../../components/windows/CheckIn'));

const WINDOW_COMPONENTS = {
  leaderboard: Leaderboard,
  registrations: Registrations,
  judging: Judging,
  analytics: Analytics,
  teamFormation: TeamFormation,
  projectSubmission: ProjectSubmission,
  digitalBadge: DigitalBadge,
  missionProgress: MissionProgress,
  checkIn: CheckIn,
};

const WindowLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    gap: '8px',
  }}>
    <span style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}>⟳</span>
    Loading module...
  </div>
);

// Telemetry — fake live numbers
function useTelemetry() {
  const [data, setData] = useState({
    cpu: 42,
    mem: 58,
    net: 127,
    uplink: 'STABLE',
  });

  useEffect(() => {
    const id = setInterval(() => {
      setData({
        cpu: 35 + Math.floor(Math.random() * 25),
        mem: 50 + Math.floor(Math.random() * 20),
        net: 100 + Math.floor(Math.random() * 80),
        uplink: Math.random() > 0.05 ? 'STABLE' : 'REROUTING',
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return data;
}

const Workspace = React.memo(function Workspace() {
  const { windows, openWindow, toggleCommandPalette, setCommandPalette } = useApp();
  const telemetry = useTelemetry();
  const [time, setTime] = useState('');

  // Get role-filtered tools for the dock
  const userRole = getUserRole();
  const dockTools = TOOLS.filter(t => t.roles.includes(userRole));

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }
      if (e.key === 'Escape') {
        setCommandPalette(false);
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCommandPalette, setCommandPalette]);

  const handleDockClick = useCallback((tool) => {
    soundManager.panelOpen();
    openWindow({
      id: tool.id,
      title: tool.label,
      icon: tool.icon,
      width: tool.width,
      height: tool.height,
    });
  }, [openWindow]);

  return (
    <div className="workspace">
      {/* Background */}
      <div className="bg-grid" />
      <img src="/logo.png" className="workspace-bg-watermark" alt="" />
      <div className="scanline-overlay" />

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-bar-left">
          <span className="title">BYTEPUNK</span>
          <div className="status-indicator">
            <div className="status-dot" />
            <span>ONLINE</span>
          </div>
          <span className="role-badge">{userRole.toUpperCase()}</span>
        </div>
        <div className="status-bar-right">
          <div className="telemetry-bar">
            <div className="telemetry-item">
              <span>CPU</span>
              <span className="telemetry-value">{telemetry.cpu}%</span>
            </div>
            <div className="telemetry-item">
              <span>MEM</span>
              <span className="telemetry-value">{telemetry.mem}%</span>
            </div>
            <div className="telemetry-item">
              <span>NET</span>
              <span className="telemetry-value">{telemetry.net}ms</span>
            </div>
            <div className="telemetry-item">
              <span>UPLINK</span>
              <span className="telemetry-value" style={{
                color: telemetry.uplink === 'STABLE' ? 'var(--color-green-dim)' : 'var(--color-yellow)',
              }}>
                {telemetry.uplink}
              </span>
            </div>
          </div>
          <span style={{ color: 'var(--color-text-muted)' }}>{time}</span>
        </div>
      </div>

      {/* Workspace Area — Single Window */}
      <div className="workspace-area" style={{ top: '32px' }}>
        {windows.filter(w => !w.minimized).map(win => {
          const Component = WINDOW_COMPONENTS[win.id];
          if (!Component) return null;
          return (
            <WindowFrame key={win.id} id={win.id} title={win.title} icon={win.icon}>
              <Suspense fallback={<WindowLoader />}>
                <Component />
              </Suspense>
            </WindowFrame>
          );
        })}

        {/* Empty State */}
        {windows.length === 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-lg)',
            opacity: 0.4,
            animation: 'fadeIn 1s ease',
            padding: '0 var(--space-md)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--color-cyan)',
              letterSpacing: '0.1em',
              textShadow: '0 0 30px rgba(0,240,255,0.2)',
            }}>
              BYTEPUNK
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-muted)',
            }}>
              {window.innerWidth <= 768
                ? 'Tap a tool from the dock below'
                : 'Launch a tool from the dock below or press Ctrl+K'}
            </div>
          </div>
        )}
      </div>

      {/* Dock — role-filtered */}
      <div className="dock">
        {dockTools.map((tool) => (
          <button
            key={tool.id}
            className={`dock-item ${windows.some(w => w.id === tool.id) ? 'active' : ''}`}
            onClick={() => handleDockClick(tool)}
            onMouseEnter={() => soundManager.hover()}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <span className="dock-item-icon">{tool.icon}</span>
            <span className="dock-item-label">{tool.label}</span>
          </button>
        ))}
        <div className="dock-separator" />
        <button
          className="dock-item"
          onClick={() => toggleCommandPalette()}
          onMouseEnter={() => soundManager.hover()}
          title="Command Palette (Ctrl+K)"
        >
          <span className="dock-item-icon">⌘</span>
          <span className="dock-item-label">Cmd</span>
        </button>
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
});

export default Workspace;
