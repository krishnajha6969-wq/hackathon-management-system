import React, { useState, useEffect, useRef, useCallback } from 'react';
import soundManager from '../../systems/SoundManager';

const FAKE_LOGS = [
  { type: 'system', text: 'HMS NETRUNNER OS Terminal v4.2.1' },
  { type: 'system', text: 'Type "help" for available commands.' },
  { type: 'system', text: '' },
];

const COMMANDS = {
  help: () => [
    '  Available commands:',
    '  ─────────────────────────────────────',
    '  help          Show this help menu',
    '  status        System status report',
    '  teams         List registered teams',
    '  uptime        Show system uptime',
    '  net scan      Simulate network scan',
    '  clear         Clear terminal',
    '  version       Show version info',
    '  whoami        Current operator info',
  ],
  status: () => [
    '  ┌─ SYSTEM STATUS ─────────────────┐',
    '  │ CPU Usage      : ████░░░░ 48%   │',
    '  │ Memory         : █████░░░ 62%   │',
    '  │ Network        : ██████░░ 78%   │',
    '  │ Uplink         : CONNECTED      │',
    '  │ Encryption     : AES-256-GCM    │',
    '  │ Threats        : NONE DETECTED  │',
    '  └──────────────────────────────────┘',
  ],
  teams: () => [
    '  Registered Teams: 62',
    '  ─────────────────',
    '  AI/ML      : 14 teams',
    '  Web3       : 12 teams',
    '  FinTech    : 11 teams',
    '  HealthTech : 13 teams',
    '  IoT        : 12 teams',
  ],
  uptime: () => [`  System uptime: ${Math.floor(Math.random() * 48 + 24)}h ${Math.floor(Math.random() * 59)}m ${Math.floor(Math.random() * 59)}s`],
  version: () => ['  HMS NETRUNNER OS v4.2.1 (build 20260312)'],
  whoami: () => ['  Operator: ADMIN // Clearance: LEVEL 5 // Session: ACTIVE'],
  'net scan': () => {
    const ips = Array.from({ length: 5 }, () =>
      `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    );
    return [
      '  Scanning network...',
      '  ─────────────────',
      ...ips.map(ip => `  [FOUND] Node ${ip} — latency ${Math.floor(Math.random() * 50 + 5)}ms`),
      `  Scan complete: ${ips.length} nodes discovered.`,
    ];
  },
};

const Terminal = React.memo(function Terminal() {
  const [history, setHistory] = useState(FAKE_LOGS);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    soundManager.click();
    setCmdHistory(prev => [...prev, cmd]);
    setHistIdx(-1);

    const prompt = { type: 'input', text: cmd };
    let output = [];

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (COMMANDS[cmd]) {
      output = COMMANDS[cmd]().map(text => ({ type: 'output', text }));
    } else {
      output = [{ type: 'error', text: `  Command not found: "${cmd}". Type "help" for available commands.` }];
      soundManager.error();
    }

    setHistory(prev => [...prev, prompt, ...output, { type: 'system', text: '' }]);
    setInput('');
  }, [input]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx = histIdx < cmdHistory.length - 1 ? histIdx + 1 : histIdx;
        setHistIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx] || '');
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        const newIdx = histIdx - 1;
        setHistIdx(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx] || '');
      } else {
        setHistIdx(-1);
        setInput('');
      }
    }
  }, [cmdHistory, histIdx]);

  return (
    <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-output" ref={outputRef}>
        {history.map((line, i) => (
          <div
            key={i}
            className="terminal-line"
            style={{
              color:
                line.type === 'input' ? 'var(--color-cyan)' :
                line.type === 'error' ? 'var(--color-magenta)' :
                line.type === 'system' ? 'var(--color-text-muted)' :
                'var(--color-text-secondary)',
            }}
          >
            {line.type === 'input' && (
              <><span className="prompt">operator</span><span className="path">@hms</span><span style={{ color: 'var(--color-text-muted)' }}>:~$ </span></>
            )}
            {line.text}
          </div>
        ))}
      </div>

      <form className="terminal-input-row" onSubmit={handleSubmit}>
        <span style={{ color: 'var(--color-cyan-dim)' }}>operator</span>
        <span style={{ color: 'var(--color-green-dim)' }}>@hms</span>
        <span style={{ color: 'var(--color-text-muted)' }}>:~$</span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
});

export default Terminal;
