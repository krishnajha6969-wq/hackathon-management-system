import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import soundManager from '../../systems/SoundManager';

// Role-based tool definitions
const TOOLS = [
  // Shared tools (all roles)
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', shortcut: 'Ctrl+1', width: 950, height: 580, roles: ['participant', 'judge', 'admin'] },
  { id: 'checkIn', label: 'Access Control', icon: '🛡️', shortcut: 'Ctrl+2', width: 700, height: 560, roles: ['judge', 'admin'] },
  { id: 'resources', label: 'Hacker Resources', icon: '📚', shortcut: 'Ctrl+2', width: 800, height: 600, roles: ['participant'] },
  
  // Participant tools
  { id: 'teamFormation', label: 'Team Formation', icon: '👥', shortcut: 'Ctrl+3', width: 900, height: 600, roles: ['participant', 'admin'] },
  { id: 'projectSubmission', label: 'Deploy Project', icon: '🚀', shortcut: 'Ctrl+4', width: 950, height: 620, roles: ['participant', 'admin'] },
  { id: 'digitalBadge', label: 'Digital ID Badge', icon: '🎫', shortcut: 'Ctrl+5', width: 600, height: 650, roles: ['participant', 'admin'] },
  { id: 'missionProgress', label: 'Mission Log', icon: '🎯', shortcut: 'Ctrl+6', width: 850, height: 620, roles: ['participant', 'admin'] },
  
  // Judge / Admin tools
  { id: 'judging', label: 'Judging Panel', icon: '⚖️', shortcut: 'Ctrl+7', width: 950, height: 600, roles: ['judge', 'admin'] },
  { id: 'analytics', label: 'Analytics', icon: '📊', shortcut: 'Ctrl+8', width: 950, height: 620, roles: ['judge', 'admin'] },
  
  // Admin only
  { id: 'registrations', label: 'Registrations', icon: '📋', shortcut: 'Ctrl+9', width: 950, height: 580, roles: ['admin'] },
];

function getUserRole() {
  try {
    const session = JSON.parse(localStorage.getItem('hms_user') || '{}');
    return session.role || 'participant';
  } catch { return 'participant'; }
}

const CommandPalette = React.memo(function CommandPalette() {
  const { commandPaletteOpen, setCommandPalette, openWindow } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  const userRole = getUserRole();
  const visibleTools = TOOLS.filter(t => t.roles.includes(userRole));

  const filtered = visibleTools.filter(t =>
    t.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const launchTool = useCallback((tool) => {
    soundManager.panelOpen();
    openWindow({
      id: tool.id,
      title: tool.label,
      icon: tool.icon,
      width: tool.width,
      height: tool.height,
    });
    setCommandPalette(false);
  }, [openWindow, setCommandPalette]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[selectedIdx]) {
        launchTool(filtered[selectedIdx]);
      }
    } else if (e.key === 'Escape') {
      setCommandPalette(false);
    }
  }, [filtered, selectedIdx, launchTool, setCommandPalette]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setCommandPalette(false)}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="command-palette-input"
          placeholder="Search tools..."
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
          onKeyDown={handleKeyDown}
        />
        <div className="command-palette-list">
          {filtered.map((tool, i) => (
            <div
              key={tool.id}
              className={`command-palette-item ${i === selectedIdx ? 'selected' : ''}`}
              onClick={() => launchTool(tool)}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              <span className="icon">{tool.icon}</span>
              <span>{tool.label}</span>
              <span className="shortcut">{tool.shortcut}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{
              padding: 'var(--space-lg)',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
            }}>
              No matching tools found
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export { TOOLS, getUserRole };
export default CommandPalette;
