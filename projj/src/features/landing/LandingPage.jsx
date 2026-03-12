import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import CountdownTimer from '../../components/ui/CountdownTimer';
import soundManager from '../../systems/SoundManager';
import '../../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    soundManager.boot(); // Play silent init or ambient hum if desired
  }, []);

  const handleEnterSystem = () => {
    soundManager.confirm();
    navigate('/login');
  };

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14); // 14 days from now

  return (
    <div className="landing-wrapper">
      <div className="landing-particles"></div>
      <div className="scanline-overlay"></div>

      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <img src="/logo.png" alt="" className="nav-logo-icon" />
          <span className="text-cyan">BYTE</span>PUNK
        </div>
        <div className="nav-links">
          <a href="#events">EVENTS</a>
          <a href="#about">ABOUT</a>
          <a href="#features">FEATURES</a>
          <button className="nav-btn primary glow-hover" onClick={handleEnterSystem}>
            [ ENTER_SYSTEM ]
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-title-wrapper"
          >
            <img src="/logo.png" alt="Bytepunk" className="hero-logo" />
            <div>
              <h2 className="hero-subtitle">NEXT-GEN HACKATHON PLATFORM</h2>
              <h1 className="hero-title glitch" data-text="BYTEPUNK">BYTEPUNK</h1>
            </div>
            <p className="hero-description">
              The ultimate infrastructure for hackers, builders, and creators. 
              Manage teams, track scores in real-time, and deploy projects in a seamless cyberpunk environment.
            </p>
            
            <div className="hero-cta-group">
              <button className="cta-btn primary neon-pulse" onClick={handleEnterSystem}>
                ACCESS_TERMINAL
                <span className="btn-arrow">→</span>
              </button>
              <button className="cta-btn secondary" onClick={() => document.getElementById('events').scrollIntoView({ behavior: 'smooth' })}>
                VIEW_EVENTS
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="hero-clock"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="clock-label">NEXT EVENT LAUNCH IN:</div>
            <CountdownTimer targetDate={targetDate} />
          </motion.div>
        </div>
      </motion.section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <div className="section-header">
          <span className="section-number">01</span>
          <h2 className="section-title">ACTIVE_OPERATIONS</h2>
          <div className="section-line"></div>
        </div>

        <div className="events-grid">
          {[
            { id: 'CYBR-26', name: 'CyberPunk Hack 2026', date: 'Oct 15 - Oct 17', prize: '$50,000', teams: 142, status: 'OPEN' },
            { id: 'WEB3-X', name: 'Web3 Frontier Builder', date: 'Nov 02 - Nov 05', prize: '$75,000', teams: 89, status: 'UPCOMING' },
            { id: 'AI-CORE', name: 'Neural Forge AI Sprint', date: 'Dec 10 - Dec 12', prize: '$100k', teams: 210, status: 'DRAFT' }
          ].map((evt, i) => (
            <motion.div 
              key={evt.id} 
              className="event-card glass-panel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="event-status">
                <span className={`status-dot ${evt.status.toLowerCase()}`}></span>
                {evt.status}
              </div>
              <h3 className="event-name">{evt.name}</h3>
              <div className="event-meta">
                <div className="meta-item"><span>ID:</span> {evt.id}</div>
                <div className="meta-item"><span>DATE:</span> {evt.date}</div>
                <div className="meta-item"><span>PRIZE:</span> <span className="text-green">{evt.prize}</span></div>
                <div className="meta-item"><span>TEAMS:</span> {evt.teams}</div>
              </div>
              <button className="event-btn glow-hover" onClick={handleEnterSystem}>
                REGISTER_NOW
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About/Stats Section */}
      <section id="about" className="stats-section">
        <div className="glass-panel stats-container">
          {[
            { label: 'REGISTERED_HACKERS', value: '4,096+' },
            { label: 'PROJECTS_DEPLOYED', value: '1,024' },
            { label: 'PRIZES_DISTRIBUTED', value: '$2.5M' },
            { label: 'SYSTEM_UPTIME', value: '99.99%' }
          ].map((stat, i) => (
             <motion.div 
               key={stat.label} 
               className="stat-box"
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
             >
               <div className="stat-value text-cyan">{stat.value}</div>
               <div className="stat-label">{stat.label}</div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="section-title">SYSTEM_CAPABILITIES</h2>
          <div className="section-line"></div>
        </div>

        <div className="features-grid">
          {[
            { icon: '👥', title: 'Team Formation', desc: 'Find co-founders with matching skill trees.' },
            { icon: '🏆', title: 'Live Leaderboard', desc: 'Real-time scoring updates. Dominate the ranks.' },
            { icon: '⚖️', title: 'AI Judging Panel', desc: 'Unbiased, instant technical evaluation.' },
            { icon: '🎫', title: 'Digital ID Badges', desc: 'Cryptographically secure check-ins via QR.' },
            { icon: '📡', title: 'Live Activity Feed', desc: 'Monitor the pulse of the hackathon floor.' },
            { icon: '🚀', title: 'Mission Protocol', desc: 'Level up through guided hackathon stages.' }
          ].map((feat, i) => (
            <motion.div 
              key={feat.title} 
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="feature-icon">{feat.icon}</div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer / Organizers */}
      <footer className="landing-footer glass-panel">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-logo"><span className="text-cyan">BYTE</span>PUNK</div>
            <p className="text-muted mt-2">Built for the next generation of builders.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>PROTOCOL</h4>
              <a href="#">Documentation</a>
              <a href="#">API Access</a>
              <a href="#">Security</a>
            </div>
            <div className="link-group">
              <h4>CONTACT</h4>
              <a href="#">Discord_Server</a>
              <a href="#">Support_Matrix</a>
              <a href="#">X_Comms</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="text-muted">© 2026 BYTEPUNK. All rights reserved.</span>
          <span className="text-muted">SYS_VER: 2.0.4 // UPLINK: STABLE</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
