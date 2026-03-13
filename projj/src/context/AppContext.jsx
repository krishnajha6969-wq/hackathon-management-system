import React, { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const PHASES = { BOOT: 'boot', AI_GUIDE: 'aiGuide', WORKSPACE: 'workspace' };

const initialState = {
  phase: PHASES.BOOT,
  windows: [],
  activeWindowId: null,
  nextZIndex: 101,
  commandPaletteOpen: false,
  soundEnabled: true,
  demoMode: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'OPEN_WINDOW': {
      // Detect mobile viewport for fullscreen windows
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const winX = isMobile ? 0 : (action.payload.x ?? 60);
      const winY = isMobile ? 0 : (action.payload.y ?? 20);
      const winW = isMobile ? window.innerWidth : (action.payload.width ?? 900);
      const winH = isMobile ? (window.innerHeight - 100) : (action.payload.height ?? 560);

      return {
        ...state,
        windows: [{
          ...action.payload,
          zIndex: state.nextZIndex,
          minimized: false,
          x: winX,
          y: winY,
          width: winW,
          height: winH,
        }],
        activeWindowId: action.payload.id,
        nextZIndex: state.nextZIndex + 1,
      };
    }

    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload),
        activeWindowId: state.activeWindowId === action.payload ? null : state.activeWindowId,
      };

    case 'FOCUS_WINDOW':
      return {
        ...state,
        activeWindowId: action.payload,
        nextZIndex: state.nextZIndex + 1,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, zIndex: state.nextZIndex } : w
        ),
      };

    case 'UPDATE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, ...action.payload.updates } : w
        ),
      };

    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, minimized: true } : w
        ),
        activeWindowId: state.activeWindowId === action.payload ? null : state.activeWindowId,
      };

    case 'TOGGLE_COMMAND_PALETTE':
      return { ...state, commandPaletteOpen: !state.commandPaletteOpen };

    case 'SET_COMMAND_PALETTE':
      return { ...state, commandPaletteOpen: action.payload };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'TOGGLE_DEMO':
      return { ...state, demoMode: !state.demoMode };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openWindow = useCallback((windowConfig) => {
    dispatch({ type: 'OPEN_WINDOW', payload: windowConfig });
  }, []);

  const closeWindow = useCallback((id) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: id });
  }, []);

  const focusWindow = useCallback((id) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: id });
  }, []);

  const updateWindow = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_WINDOW', payload: { id, updates } });
  }, []);

  const minimizeWindow = useCallback((id) => {
    dispatch({ type: 'MINIMIZE_WINDOW', payload: id });
  }, []);

  const setPhase = useCallback((phase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  }, []);

  const toggleCommandPalette = useCallback(() => {
    dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
  }, []);

  const setCommandPalette = useCallback((open) => {
    dispatch({ type: 'SET_COMMAND_PALETTE', payload: open });
  }, []);

  const value = {
    ...state,
    PHASES,
    openWindow,
    closeWindow,
    focusWindow,
    updateWindow,
    minimizeWindow,
    setPhase,
    toggleCommandPalette,
    setCommandPalette,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export { PHASES };
