import React, { useState, useEffect } from 'react';
import soundManager from '../../systems/SoundManager';

const TeamFormation = React.memo(function TeamFormation() {
  const [view, setView] = useState('browse'); // 'browse', 'create', 'my_team'
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('hms_teams');
    return saved ? JSON.parse(saved) : [
      { id: 't1', name: 'NeuralForge', desc: 'Building an AI trading bot', members: 3, max: 4 },
      { id: 't2', name: 'BlockSmith', desc: 'Web3 real estate platform', members: 2, max: 4 },
    ];
  });
  const [myTeam, setMyTeam] = useState(() => {
    const saved = localStorage.getItem('hms_my_team');
    return saved ? JSON.parse(saved) : null;
  });

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('hms_teams', JSON.stringify(teams));
    localStorage.setItem('hms_my_team', JSON.stringify(myTeam));
  }, [teams, myTeam]);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeamName || !newTeamDesc) return;
    
    soundManager.confirm();
    const newTeam = {
      id: 't_' + Date.now().toString(36),
      name: newTeamName,
      desc: newTeamDesc,
      members: 1,
      max: 4,
    };
    
    setTeams([...teams, newTeam]);
    setMyTeam(newTeam);
    setView('my_team');
  };

  const handleJoinTeam = (team) => {
    soundManager.confirm();
    setTeams(teams.map(t => 
      t.id === team.id ? { ...t, members: t.members + 1 } : t
    ));
    setMyTeam({ ...team, members: team.members + 1 });
    setView('my_team');
  };

  const handleLeaveTeam = () => {
    soundManager.click();
    if (myTeam) {
      setTeams(teams.map(t => 
        t.id === myTeam.id ? { ...t, members: Math.max(0, t.members - 1) } : t
      ));
    }
    setMyTeam(null);
    setView('browse');
  };

  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <div className="win-header" style={{ marginBottom: 'var(--space-lg)' }}>
        <span className="win-title">Team Formation System</span>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <button 
          className={`win-btn ${view === 'browse' ? 'primary' : 'outline'}`}
          onClick={() => { setView('browse'); soundManager.click(); }}
        >
          BROWSE TEAMS
        </button>
        <button 
          className={`win-btn ${view === 'create' ? 'primary' : 'outline'}`}
          onClick={() => { setView('create'); soundManager.click(); }}
          disabled={!!myTeam}
        >
          CREATE TEAM
        </button>
        <button 
          className={`win-btn ${view === 'my_team' ? 'primary' : 'outline'}`}
          onClick={() => { setView('my_team'); soundManager.click(); }}
          disabled={!myTeam}
        >
          MY TEAM
        </button>
      </div>

      {view === 'browse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {teams.map(team => (
            <div key={team.id} className="glass-panel" style={{ padding: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'var(--color-cyan)', margin: '0 0 4px 0', fontFamily: 'var(--font-display)' }}>{team.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>{team.desc}</p>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Members: {team.members}/{team.max}</span>
              </div>
              <button 
                className="win-btn outline" 
                onClick={() => handleJoinTeam(team)}
                disabled={!!myTeam || team.members >= team.max}
              >
                JOIN
              </button>
            </div>
          ))}
        </div>
      )}

      {view === 'create' && (
        <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-cyan)', fontSize: 'var(--text-sm)' }}>TEAM NAME</label>
            <input 
              type="text" 
              className="win-input" 
              style={{ width: '100%', padding: 'var(--space-sm)', background: 'rgba(0,240,255,0.05)', color: 'white', border: '1px solid var(--color-border)' }}
              value={newTeamName} 
              onChange={e => setNewTeamName(e.target.value)} 
              placeholder="e.g. CyberKnights"
            />
          </div>
          <div>
             <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-cyan)', fontSize: 'var(--text-sm)' }}>PROJECT IDEA</label>
            <textarea 
              className="win-input" 
              style={{ width: '100%', padding: 'var(--space-sm)', background: 'rgba(0,240,255,0.05)', color: 'white', border: '1px solid var(--color-border)', height: '100px' }}
              value={newTeamDesc} 
              onChange={e => setNewTeamDesc(e.target.value)}
              placeholder="Describe your tech stack and goals..."
            />
          </div>
          <button type="submit" className="win-btn primary" style={{ alignSelf: 'flex-end' }}>INITIALIZE TEAM</button>
        </form>
      )}

      {view === 'my_team' && myTeam && (
        <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
          <h2 style={{ color: 'var(--color-cyan)', fontFamily: 'var(--font-display)', margin: '0 0 var(--space-md)' }}>{myTeam.name}</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>{myTeam.desc}</p>
          
          <div style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)' }}>
             <h4 style={{ color: 'var(--color-text-muted)', margin: '0 0 var(--space-sm)', fontSize: 'var(--text-sm)' }}>MEMBERS ({myTeam.members}/{myTeam.max})</h4>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <li style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><div className="status-dot" style={{ background: 'var(--color-cyan)' }}/> You (Leader)</li>
               {Array.from({ length: myTeam.members - 1 }).map((_, i) => (
                 <li key={i} style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}><div className="status-dot" style={{ background: 'var(--color-text-muted)' }}/> Member {i + 2}</li>
               ))}
             </ul>
          </div>
          
          <button className="win-btn outline" style={{ color: 'var(--color-magenta)', borderColor: 'var(--color-magenta)' }} onClick={handleLeaveTeam}>
            LEAVE TEAM
          </button>
        </div>
      )}
    </div>
  );
});

export default TeamFormation;
