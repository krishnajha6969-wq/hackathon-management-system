import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import soundManager from '../../systems/SoundManager';

const DigitalBadge = React.memo(function DigitalBadge() {
  const [userData, setUserData] = useState({ name: 'Hacker', role: 'Participant', id: '...' });

  useEffect(() => {
    const session = localStorage.getItem('hms_user');
    if (session) {
      const parsed = JSON.parse(session);
      setUserData({
        name: parsed.username.toUpperCase(),
        role: parsed.role.toUpperCase(),
        id: parsed.id
      });
    }
  }, []);

  const handleDownload = () => {
    soundManager.confirm();
    alert('QR Code saved to local storage.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-xl)' }}>
      <div 
        className="glass-panel"
        style={{
          width: '320px',
          height: '480px',
          background: 'linear-gradient(135deg, rgba(16,16,28,0.95), rgba(5,5,10,0.95))',
          border: '1px solid var(--color-cyan)',
          borderRadius: '16px',
          boxShadow: '0 0 30px rgba(0,240,255,0.15), inset 0 0 20px rgba(0,240,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--space-xl) var(--space-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Badge Header graphic */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: 'var(--color-cyan)', opacity: 0.1, clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0% 100%)'
        }} />

        <div style={{ color: 'var(--color-cyan)', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', fontSize: '18px', marginBottom: 'var(--space-2xl)', zIndex: 1, textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>
          BYTEPUNK
        </div>

        {/* QR Code container with glowing border */}
        <div style={{
          padding: '16px',
          background: 'white', // QR needs high contrast
          borderRadius: '8px',
          border: '2px solid var(--color-cyan)',
          boxShadow: '0 0 20px rgba(0,240,255,0.4)',
          marginBottom: 'var(--space-xl)'
        }}>
          <QRCodeSVG value={`hms:auth:${userData.id}`} size={160} fgColor="#000" bgColor="#fff" />
        </div>

        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff', margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userData.name}
          </h2>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-dim)', fontSize: '14px', letterSpacing: '0.1em', marginBottom: '8px' }}>
            {userData.role}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', fontSize: '12px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
            ID: {userData.id}
          </div>
        </div>

        {/* Hologram lines */}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)', pointerEvents: 'none' }} />
      </div>

      <button className="win-btn outline" style={{ marginTop: 'var(--space-xl)' }} onClick={handleDownload}>
        SAVE BADGE
      </button>
    </div>
  );
});

export default DigitalBadge;
