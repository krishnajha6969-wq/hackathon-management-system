import React, { useState, useEffect } from 'react';
import soundManager from '../../systems/SoundManager';

const ProjectSubmission = React.memo(function ProjectSubmission() {
  const [status, setStatus] = useState(() => localStorage.getItem('hms_submission_status') || 'draft'); // 'draft', 'submitted'
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('hms_submission_data');
    return saved ? JSON.parse(saved) : {
      title: '',
      tagline: '',
      description: '',
      github: '',
      demo: '',
      track: 'Web3'
    };
  });

  useEffect(() => {
    localStorage.setItem('hms_submission_status', status);
    localStorage.setItem('hms_submission_data', JSON.stringify(formData));
  }, [status, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.confirm();
    setStatus('submitted');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    width: '100%', 
    padding: 'var(--space-sm)', 
    background: 'rgba(0,240,255,0.05)', 
    color: 'white', 
    border: '1px solid var(--color-border)',
    fontFamily: 'var(--font-mono)'
  };
  const labelStyle = { 
    display: 'block', 
    marginBottom: '8px', 
    color: 'var(--color-cyan)', 
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-mono)'
  };

  if (status === 'submitted') {
    return (
      <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', color: 'var(--color-green)', marginBottom: 'var(--space-md)' }}>✓</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green)', letterSpacing: '0.1em' }}>SUBMISSION DEPLOYED</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>Project <strong>{formData.title}</strong> has been successfully received by the judging nodes.</p>
        <button className="win-btn outline" onClick={() => { setStatus('draft'); soundManager.click(); }}>EDIT SUBMISSION</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-md)' }}>
      <div className="win-header" style={{ marginBottom: 'var(--space-lg)' }}>
        <span className="win-title">Deployment Protocol</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>PROJECT CODENAME</label>
            <input required name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ width: '150px' }}>
            <label style={labelStyle}>TRACK/DOMAIN</label>
            <select name="track" value={formData.track} onChange={handleChange} style={inputStyle}>
              <option>Web3</option>
              <option>AI/ML</option>
              <option>IoT</option>
              <option>FinTech</option>
              <option>HealthTech</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>SHORT TAGLINE</label>
          <input required name="tagline" value={formData.tagline} onChange={handleChange} style={inputStyle} placeholder="1-sentence pitch..." />
        </div>

        <div>
          <label style={labelStyle}>TECH SPECS & DESCRIPTION</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} style={{...inputStyle, height: '120px'}} placeholder="What does it do? How did you build it? What challenged you?" />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>REPOSITORY URL</label>
            <input required type="url" name="github" value={formData.github} onChange={handleChange} style={inputStyle} placeholder="https://github.com/..." />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>LIVE DEMO (Optional)</label>
            <input type="url" name="demo" value={formData.demo} onChange={handleChange} style={inputStyle} placeholder="https://..." />
          </div>
        </div>

        <button type="submit" className="win-btn primary" style={{ alignSelf: 'flex-end', marginTop: 'var(--space-md)' }}>
          DEPLOY TO JUDGES
        </button>
      </form>
    </div>
  );
});

export default ProjectSubmission;
