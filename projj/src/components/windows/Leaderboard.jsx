import React, { useState, useEffect, useCallback, useRef } from 'react';

const DOMAINS = ['All', 'Web3', 'AI/ML', 'IoT', 'FinTech', 'HealthTech'];

const TEAMS_DATA = [
  { id: 1, name: 'NeuralForge', domain: 'AI/ML', score: 94, members: 4 },
  { id: 2, name: 'BlockSmith', domain: 'Web3', score: 91, members: 3 },
  { id: 3, name: 'QuantumLeap', domain: 'FinTech', score: 89, members: 4 },
  { id: 4, name: 'MedChain', domain: 'HealthTech', score: 87, members: 5 },
  { id: 5, name: 'SensorGrid', domain: 'IoT', score: 85, members: 3 },
  { id: 6, name: 'CyberVault', domain: 'Web3', score: 83, members: 4 },
  { id: 7, name: 'DeepSight', domain: 'AI/ML', score: 81, members: 3 },
  { id: 8, name: 'PulseNet', domain: 'HealthTech', score: 79, members: 4 },
  { id: 9, name: 'EdgeFlow', domain: 'IoT', score: 77, members: 3 },
  { id: 10, name: 'CoinStream', domain: 'FinTech', score: 75, members: 4 },
  { id: 11, name: 'SynthWave', domain: 'AI/ML', score: 73, members: 3 },
  { id: 12, name: 'ChainLink Pro', domain: 'Web3', score: 71, members: 5 },
  { id: 13, name: 'BioNexus', domain: 'HealthTech', score: 69, members: 4 },
  { id: 14, name: 'HyperNode', domain: 'IoT', score: 67, members: 3 },
  { id: 15, name: 'PayMatrix', domain: 'FinTech', score: 64, members: 4 },
];

const Leaderboard = React.memo(function Leaderboard() {
  const [teams, setTeams] = useState(TEAMS_DATA);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const intervalRef = useRef(null);

  // Demo: simulate live score updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTeams(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const change = Math.floor(Math.random() * 5) - 2;
        updated[idx] = { ...updated[idx], score: Math.max(0, Math.min(100, updated[idx].score + change)) };
        return updated.sort((a, b) => b.score - a.score);
      });
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const filtered = teams.filter(t => {
    const matchDomain = filter === 'All' || t.domain === filter;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  const getRankClass = (i) => {
    if (i === 0) return 'gold';
    if (i === 1) return 'silver';
    if (i === 2) return 'bronze';
    return '';
  };

  return (
    <div>
      <div className="win-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span className="win-title">Rankings</span>
          <span className="win-badge live">● LIVE</span>
        </div>
        <input
          className="win-search"
          placeholder="Search teams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="lb-controls" style={{ marginBottom: 'var(--space-lg)' }}>
        {DOMAINS.map(d => (
          <button
            key={d}
            className={`lb-filter-btn ${filter === d ? 'active' : ''}`}
            onClick={() => setFilter(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="lb-list">
        {filtered.map((team, i) => (
          <div
            key={team.id}
            className="lb-row"
            style={{ animationDelay: `${i * 0.05}s`, animation: 'slideUp 0.4s var(--ease-out-expo) both' }}
          >
            <div className={`lb-rank ${getRankClass(i)}`}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="lb-team">
              <div className="lb-team-name">{team.name}</div>
              <div className="lb-team-domain">{team.domain} · {team.members} members</div>
            </div>
            <div className="lb-score-bar">
              <div className="lb-score-fill" style={{ width: `${team.score}%` }} />
            </div>
            <div className="lb-score-value">{team.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Leaderboard;
