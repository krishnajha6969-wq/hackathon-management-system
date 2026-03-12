import React, { useState, useCallback } from 'react';
import soundManager from '../../systems/SoundManager';

const TEAMS_FOR_JUDGING = [
  { id: 1, name: 'NeuralForge', domain: 'AI/ML', scores: { innovation: 9, tech: 9, design: 8, impact: 10, presentation: 9 }, judged: true },
  { id: 2, name: 'BlockSmith', domain: 'Web3', scores: { innovation: 8, tech: 9, design: 9, impact: 8, presentation: 9 }, judged: true },
  { id: 3, name: 'QuantumLeap', domain: 'FinTech', scores: { innovation: 9, tech: 8, design: 8, impact: 9, presentation: 8 }, judged: true },
  { id: 4, name: 'MedChain', domain: 'HealthTech', scores: { innovation: 8, tech: 8, design: 9, impact: 9, presentation: 8 }, judged: true },
  { id: 5, name: 'SensorGrid', domain: 'IoT', scores: { innovation: 7, tech: 9, design: 7, impact: 8, presentation: 8 }, judged: false },
  { id: 6, name: 'CyberVault', domain: 'Web3', scores: { innovation: 0, tech: 0, design: 0, impact: 0, presentation: 0 }, judged: false },
  { id: 7, name: 'DeepSight', domain: 'AI/ML', scores: { innovation: 0, tech: 0, design: 0, impact: 0, presentation: 0 }, judged: false },
  { id: 8, name: 'PulseNet', domain: 'HealthTech', scores: { innovation: 0, tech: 0, design: 0, impact: 0, presentation: 0 }, judged: false },
];

const CRITERIA = ['innovation', 'tech', 'design', 'impact', 'presentation'];

const Judging = React.memo(function Judging() {
  const [teams, setTeams] = useState(TEAMS_FOR_JUDGING);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tempScores, setTempScores] = useState({});

  const openModal = useCallback((team) => {
    soundManager.panelOpen();
    setSelectedTeam(team);
    setTempScores({ ...team.scores });
  }, []);

  const closeModal = useCallback(() => {
    soundManager.panelClose();
    setSelectedTeam(null);
    setTempScores({});
  }, []);

  const handleScoreChange = useCallback((criterion, value) => {
    setTempScores(prev => ({ ...prev, [criterion]: parseInt(value) }));
  }, []);

  const handleSubmit = useCallback(() => {
    soundManager.confirm();
    setTeams(prev => prev.map(t =>
      t.id === selectedTeam.id
        ? { ...t, scores: { ...tempScores }, judged: true }
        : t
    ));
    closeModal();
  }, [selectedTeam, tempScores, closeModal]);

  const getTotal = (scores) => Object.values(scores).reduce((a, b) => a + b, 0);
  const getMax = () => CRITERIA.length * 10;

  return (
    <div>
      <div className="win-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <span className="win-title">Judging Panel</span>
          <span className="win-badge pending">
            {teams.filter(t => !t.judged).length} remaining
          </span>
        </div>
      </div>

      <div className="judge-grid">
        {teams.map(team => (
          <div
            key={team.id}
            className="judge-card"
            onClick={() => openModal(team)}
          >
            <div className="judge-card-name">{team.name}</div>
            <div className="judge-card-domain">{team.domain}</div>
            <div className="judge-criteria">
              {CRITERIA.map(c => (
                <div
                  key={c}
                  className={`criteria-pip ${team.scores[c] > 0 ? 'filled' : ''}`}
                  title={`${c}: ${team.scores[c]}/10`}
                />
              ))}
            </div>
            <div className="judge-score-label">
              <span>{team.judged ? 'Scored' : 'Not scored'}</span>
              <span style={{ color: team.judged ? 'var(--color-cyan)' : 'var(--color-text-muted)' }}>
                {getTotal(team.scores)}/{getMax()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Judging Modal */}
      {selectedTeam && (
        <div className="judge-modal-overlay" onClick={closeModal}>
          <div className="judge-modal" onClick={e => e.stopPropagation()}>
            <h3>Score: {selectedTeam.name}</h3>
            <div style={{ marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {selectedTeam.domain}
            </div>

            {CRITERIA.map(c => (
              <div key={c} className="score-slider-group">
                <div className="score-slider-label">
                  <span style={{ textTransform: 'capitalize' }}>{c}</span>
                  <span style={{ color: 'var(--color-cyan)' }}>{tempScores[c]}/10</span>
                </div>
                <input
                  type="range"
                  className="score-slider"
                  min="0"
                  max="10"
                  value={tempScores[c]}
                  onChange={e => handleScoreChange(c, e.target.value)}
                />
              </div>
            ))}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'var(--space-lg)',
              paddingTop: 'var(--space-md)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--color-cyan)' }}>
                Total: {getTotal(tempScores)}/{getMax()}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button className="glow-btn" onClick={closeModal} style={{ borderColor: 'var(--color-border)' }}>Cancel</button>
                <button className="glow-btn green" onClick={handleSubmit}>Submit Score</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Judging;
