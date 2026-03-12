import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import BootSequence from './features/boot/BootSequence';
import AIGuide from './features/aiGuide/AIGuide';

const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const LoginPage = lazy(() => import('./features/login/LoginPage'));
const Workspace = lazy(() => import('./features/workspace/Workspace'));

const PageLoader = () => (
  <div style={{
    position: 'fixed', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--color-bg-void)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-cyan)',
  }}>
    <span style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}>
      ⟳ LOADING SYSTEM MODULE...
    </span>
  </div>
);

function DashboardFlow() {
  const { phase, PHASES } = useApp();
  return (
    <>
      {phase === PHASES.BOOT && <BootSequence />}
      {phase === PHASES.AI_GUIDE && <AIGuide />}
      {phase === PHASES.WORKSPACE && <Workspace />}
    </>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardFlow />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default React.memo(AppContent);
