import React, { useState, useEffect, useRef } from 'react';

const DonutChart = React.memo(function DonutChart({ segments, centerValue, centerLabel }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  const circumference = 2 * Math.PI * 45;

  return (
    <div className="donut-chart">
      <svg viewBox="0 0 100 100">
        {segments.map((seg, i) => {
          const offset = (cumulative / total) * circumference;
          const length = (seg.value / total) * circumference;
          cumulative += seg.value;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={seg.color}
              strokeWidth="8"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              style={{ filter: `drop-shadow(0 0 4px ${seg.color}40)` }}
            />
          );
        })}
      </svg>
      <div className="donut-center">
        <div className="donut-value">{centerValue}</div>
        <div className="donut-label">{centerLabel}</div>
      </div>
    </div>
  );
});

const Analytics = React.memo(function Analytics() {
  const [time, setTime] = useState(Date.now());
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setTime(Date.now()), 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const domainData = [
    { label: 'AI/ML', value: 35 + Math.floor(Math.random() * 3), color: 'var(--color-cyan)' },
    { label: 'Web3', value: 28 + Math.floor(Math.random() * 3), color: 'var(--color-magenta)' },
    { label: 'IoT', value: 18 + Math.floor(Math.random() * 2), color: 'var(--color-yellow)' },
    { label: 'FinTech', value: 22 + Math.floor(Math.random() * 3), color: 'var(--color-green)' },
    { label: 'Health', value: 15 + Math.floor(Math.random() * 2), color: '#8844ff' },
  ];

  const paymentSegments = [
    { value: 78, color: '#00ff88', label: 'Paid' },
    { value: 22, color: '#ff00aa', label: 'Pending' },
  ];

  const timelineData = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 24 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 52 },
    { label: 'Fri', value: 67 },
    { label: 'Sat', value: 85 },
    { label: 'Sun', value: 94 },
  ];

  const maxTimeline = Math.max(...timelineData.map(d => d.value));

  return (
    <div>
      <div className="win-header">
        <span className="win-title">Analytics</span>
        <span className="win-badge live">● LIVE</span>
      </div>

      {/* Top Stats Row */}
      <div className="reg-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-xl)' }}>
        <div className="stat-card">
          <div className="value">247</div>
          <div className="label">Participants</div>
        </div>
        <div className="stat-card green">
          <div className="value">62</div>
          <div className="label">Teams</div>
        </div>
        <div className="stat-card yellow">
          <div className="value">5</div>
          <div className="label">Domains</div>
        </div>
        <div className="stat-card">
          <div className="value">24h</div>
          <div className="label">Duration</div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Payment Status Donut */}
        <div className="analytics-card">
          <h4>Payment Status</h4>
          <DonutChart
            segments={paymentSegments}
            centerValue="78%"
            centerLabel="Paid"
          />
          <div className="analytics-legend">
            {paymentSegments.map((seg, i) => (
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{ background: seg.color }} />
                <span>{seg.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--color-cyan-dim)' }}>{seg.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Timeline */}
        <div className="analytics-card">
          <h4>Registration Timeline</h4>
          <div className="bar-chart">
            {timelineData.map((d, i) => (
              <div key={i} className="bar-col">
                <div
                  className="bar-fill"
                  style={{
                    height: `${(d.value / maxTimeline) * 100}%`,
                    background: `linear-gradient(to top, var(--color-cyan-dim), var(--color-cyan))`,
                    boxShadow: '0 0 6px var(--color-cyan-glow)',
                  }}
                />
                <div className="bar-label">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Distribution */}
        <div className="analytics-card" style={{ gridColumn: 'span 2' }}>
          <h4>Domain Distribution</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {domainData.map((d, i) => (
              <div key={i}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  marginBottom: '4px',
                }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{d.label}</span>
                  <span style={{ color: d.color }}>{d.value} teams</span>
                </div>
                <div style={{
                  height: '4px',
                  background: 'rgba(0,240,255,0.06)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(d.value / 40) * 100}%`,
                    background: d.color,
                    borderRadius: '2px',
                    transition: 'width 0.8s var(--ease-out-expo)',
                    boxShadow: `0 0 6px ${d.color}40`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Analytics;
