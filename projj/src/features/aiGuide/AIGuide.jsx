import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import soundManager from '../../systems/SoundManager';

const GUIDE_STEPS = [
  {
    text: "Welcome to BYTEPUNK. Your hackathon workspace is ready.",
    delay: 1500,
  },
  {
    text: "Launch tools from the dock below. Use Ctrl+K for quick search.",
    delay: 1500,
  },
  {
    text: "Entering workspace now. Good luck, hacker.",
    delay: 1200,
  },
];

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(5, 5, 10, 0.85)',
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.5s ease-out',
  },
  guideBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    maxWidth: '560px',
    padding: '3rem',
  },
  orb: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, rgba(0,240,255,0.4), rgba(0,240,255,0.05) 70%)',
    border: '1px solid rgba(0,240,255,0.2)',
    boxShadow: '0 0 30px rgba(0,240,255,0.2), inset 0 0 20px rgba(0,240,255,0.1)',
    animation: 'pulse-glow 3s ease-in-out infinite',
  },
  textBox: {
    textAlign: 'center',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-lg)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.7,
    letterSpacing: '0.02em',
  },
  cursor: {
    display: 'inline-block',
    width: '8px',
    height: '18px',
    background: 'var(--color-cyan)',
    marginLeft: '4px',
    animation: 'blink 1s step-end infinite',
    verticalAlign: 'text-bottom',
    boxShadow: '0 0 8px rgba(0,240,255,0.5)',
  },
  dots: {
    display: 'flex',
    gap: '8px',
    marginTop: '0.5rem',
  },
  dot: (active) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: active ? 'var(--color-cyan)' : 'rgba(0,240,255,0.15)',
    transition: 'all 0.3s ease',
    boxShadow: active ? '0 0 8px rgba(0,240,255,0.4)' : 'none',
  }),
  skipBtn: {
    position: 'absolute',
    bottom: '2rem',
    right: '2rem',
    background: 'none',
    border: '1px solid rgba(0,240,255,0.1)',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    letterSpacing: '0.1em',
  },
  label: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-cyan-dim)',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    marginTop: '0.5rem',
    opacity: 0.6,
  },
};

const AIGuide = React.memo(function AIGuide() {
  const { setPhase, PHASES } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const charIndex = useRef(0);
  const timerRef = useRef(null);

  const currentStep = GUIDE_STEPS[stepIndex];

  const typeText = useCallback(() => {
    if (!currentStep) return;
    const fullText = currentStep.text;
    charIndex.current = 0;
    setDisplayedText('');
    setIsTyping(true);

    const type = () => {
      if (charIndex.current < fullText.length) {
        charIndex.current++;
        setDisplayedText(fullText.slice(0, charIndex.current));
        timerRef.current = setTimeout(type, 20 + Math.random() * 15);
      } else {
        setIsTyping(false);
      }
    };
    timerRef.current = setTimeout(type, 200);
  }, [currentStep]);

  useEffect(() => {
    typeText();
    return () => clearTimeout(timerRef.current);
  }, [typeText]);

  useEffect(() => {
    if (!isTyping && currentStep) {
      const t = setTimeout(() => {
        if (stepIndex < GUIDE_STEPS.length - 1) {
          setStepIndex(prev => prev + 1);
        } else {
          soundManager.confirm();
          setTimeout(() => setPhase(PHASES.WORKSPACE), 400);
        }
      }, currentStep.delay);
      return () => clearTimeout(t);
    }
  }, [isTyping, stepIndex, currentStep, setPhase, PHASES]);

  const handleSkip = () => {
    clearTimeout(timerRef.current);
    soundManager.click();
    setPhase(PHASES.WORKSPACE);
  };

  return (
    <div style={styles.container}>
      <div style={styles.guideBox}>
        <div style={styles.orb} />
        <div style={styles.label}>BYTEPUNK GUIDE</div>
        <div style={styles.textBox}>
          <span style={styles.text}>
            {displayedText}
            {isTyping && <span style={styles.cursor} />}
          </span>
        </div>
        <div style={styles.dots}>
          {GUIDE_STEPS.map((_, i) => (
            <div key={i} style={styles.dot(i <= stepIndex)} />
          ))}
        </div>
      </div>
      <button
        style={styles.skipBtn}
        onClick={handleSkip}
        onMouseEnter={e => {
          e.target.style.borderColor = 'rgba(0,240,255,0.3)';
          e.target.style.color = 'var(--color-cyan)';
        }}
        onMouseLeave={e => {
          e.target.style.borderColor = 'rgba(0,240,255,0.1)';
          e.target.style.color = 'var(--color-text-muted)';
        }}
      >
        SKIP →
      </button>
    </div>
  );
});

export default AIGuide;
