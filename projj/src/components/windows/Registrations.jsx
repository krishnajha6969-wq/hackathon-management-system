import React, { useState, useMemo } from 'react';
import soundManager from '../../systems/SoundManager';

const REGISTRATIONS = [
  { id: 1, team: 'NeuralForge', lead: 'Alex Chen', email: 'alex@neural.io', members: 4, domain: 'AI/ML', paid: true, date: '2026-03-01' },
  { id: 2, team: 'BlockSmith', lead: 'Priya Sharma', email: 'priya@block.dev', members: 3, domain: 'Web3', paid: true, date: '2026-03-02' },
  { id: 3, team: 'QuantumLeap', lead: 'James Wu', email: 'james@qleap.co', members: 4, domain: 'FinTech', paid: false, date: '2026-03-02' },
  { id: 4, team: 'MedChain', lead: 'Sara Lopez', email: 'sara@medchain.io', members: 5, domain: 'HealthTech', paid: true, date: '2026-03-03' },
  { id: 5, team: 'SensorGrid', lead: 'Mike Ross', email: 'mike@sgrid.tech', members: 3, domain: 'IoT', paid: true, date: '2026-03-03' },
  { id: 6, team: 'CyberVault', lead: 'Lena Kim', email: 'lena@cvault.xyz', members: 4, domain: 'Web3', paid: false, date: '2026-03-04' },
  { id: 7, team: 'DeepSight', lead: 'Tom Hardy', email: 'tom@deepsight.ai', members: 3, domain: 'AI/ML', paid: true, date: '2026-03-05' },
  { id: 8, team: 'PulseNet', lead: 'Aisha Patel', email: 'aisha@pulsenet.io', members: 4, domain: 'HealthTech', paid: true, date: '2026-03-06' },
  { id: 9, team: 'EdgeFlow', lead: 'Ryan Lee', email: 'ryan@edgeflow.dev', members: 3, domain: 'IoT', paid: false, date: '2026-03-07' },
  { id: 10, team: 'CoinStream', lead: 'Nina Clark', email: 'nina@coinstream.fi', members: 4, domain: 'FinTech', paid: true, date: '2026-03-08' },
];

const Registrations = React.memo(function Registrations() {
  const [search, setSearch] = useState('');

  const stats = useMemo(() => ({
    total: REGISTRATIONS.length,
    paid: REGISTRATIONS.filter(r => r.paid).length,
    pending: REGISTRATIONS.filter(r => !r.paid).length,
  }), []);

  const filtered = REGISTRATIONS.filter(r =>
    r.team.toLowerCase().includes(search.toLowerCase()) ||
    r.lead.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    soundManager.confirm();
    // Simulate CSV export
    const csv = 'Team,Lead,Email,Members,Domain,Payment\n' +
      REGISTRATIONS.map(r =>
        `${r.team},${r.lead},${r.email},${r.members},${r.domain},${r.paid ? 'Paid' : 'Pending'}`
      ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="win-header">
        <span className="win-title">Registrations</span>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <input
            className="win-search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="glow-btn green" onClick={handleExport}>
            ↓ Export CSV
          </button>
        </div>
      </div>

      <div className="reg-stats">
        <div className="stat-card">
          <div className="value">{stats.total}</div>
          <div className="label">Total Teams</div>
        </div>
        <div className="stat-card green">
          <div className="value">{stats.paid}</div>
          <div className="label">Confirmed</div>
        </div>
        <div className="stat-card magenta">
          <div className="value">{stats.pending}</div>
          <div className="label">Pending</div>
        </div>
      </div>

      <table className="reg-table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Lead</th>
            <th>Domain</th>
            <th>Members</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(reg => (
            <tr key={reg.id}>
              <td style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{reg.team}</td>
              <td>{reg.lead}</td>
              <td>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                  {reg.domain}
                </span>
              </td>
              <td>{reg.members}</td>
              <td>
                <span className={`payment-badge ${reg.paid ? 'paid' : 'unpaid'}`}>
                  {reg.paid ? '● Paid' : '○ Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default Registrations;
