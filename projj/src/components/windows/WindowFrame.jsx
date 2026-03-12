import React from 'react';
import { useApp } from '../../context/AppContext';
import { useDraggable, useResizable } from '../../hooks/useDraggable';
import soundManager from '../../systems/SoundManager';

const WindowFrame = React.memo(function WindowFrame({ id, title, icon, children }) {
  const { windows, activeWindowId, closeWindow, focusWindow, minimizeWindow } = useApp();
  const { dragRef, onMouseDown } = useDraggable(id);
  const { onResizeStart } = useResizable(id);

  const win = windows.find(w => w.id === id);
  if (!win) return null;

  const isFocused = activeWindowId === id;
  const classes = `window-frame ${isFocused ? 'focused' : ''} ${win.minimized ? 'minimized' : ''}`;

  const style = {
    left: `${win.x}px`,
    top: `${win.y}px`,
    width: `${win.width}px`,
    height: `${win.height}px`,
    zIndex: win.zIndex,
  };

  const handleClose = (e) => {
    e.stopPropagation();
    soundManager.panelClose();
    closeWindow(id);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    soundManager.click();
    minimizeWindow(id);
  };

  const handleFocus = () => {
    if (!isFocused) focusWindow(id);
  };

  return (
    <div
      className={classes}
      style={style}
      data-window-id={id}
      ref={dragRef}
      onMouseDown={handleFocus}
    >
      <div className="window-titlebar" onMouseDown={onMouseDown}>
        <div className="window-title-left">
          <span className="window-title-icon">{icon}</span>
          <span className="window-title-text">{title}</span>
        </div>
        <div className="window-title-controls" data-no-drag>
          <button className="window-control-btn" onClick={handleMinimize} title="Minimize">
            ─
          </button>
          <button className="window-control-btn close" onClick={handleClose} title="Close">
            ✕
          </button>
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>

      {/* Resize handles */}
      <div className="resize-handle e" onMouseDown={e => onResizeStart(e, 'e')} />
      <div className="resize-handle s" onMouseDown={e => onResizeStart(e, 's')} />
      <div className="resize-handle se" onMouseDown={e => onResizeStart(e, 'se')} />
      <div className="resize-handle sw" onMouseDown={e => onResizeStart(e, 'sw')} />
    </div>
  );
});

export default WindowFrame;
