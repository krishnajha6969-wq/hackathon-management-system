import { useCallback, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useDraggable(windowId) {
  const { updateWindow, focusWindow } = useApp();
  const dragRef = useRef(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startWindowPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const onMouseDown = useCallback((e) => {
    if (e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };

    const el = dragRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      startWindowPos.current = { x: rect.left, y: rect.top };
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
    focusWindow(windowId);

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      velocity.current = {
        x: e.clientX - lastPos.current.x,
        y: e.clientY - lastPos.current.y,
      };
      lastPos.current = { x: e.clientX, y: e.clientY };

      const newX = startWindowPos.current.x + dx;
      const newY = Math.max(0, startWindowPos.current.y + dy);
      updateWindow(windowId, { x: newX, y: newY });
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [windowId, updateWindow, focusWindow]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { dragRef, onMouseDown };
}

export function useResizable(windowId) {
  const { updateWindow } = useApp();

  const onResizeStart = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    const win = document.querySelector(`[data-window-id="${windowId}"]`);
    if (!win) return;
    const rect = win.getBoundingClientRect();
    const startW = rect.width;
    const startH = rect.height;
    const startLeft = rect.left;
    const startTop = rect.top;

    const onMouseMove = (e) => {
      let newW = startW, newH = startH, newX = startLeft, newY = startTop;

      if (direction.includes('e')) newW = Math.max(400, startW + (e.clientX - startX));
      if (direction.includes('s')) newH = Math.max(300, startH + (e.clientY - startY));
      if (direction.includes('w')) {
        const dx = e.clientX - startX;
        newW = Math.max(400, startW - dx);
        if (newW > 400) newX = startLeft + dx;
      }
      if (direction.includes('n')) {
        const dy = e.clientY - startY;
        newH = Math.max(300, startH - dy);
        if (newH > 300) newY = Math.max(0, startTop + dy);
      }

      updateWindow(windowId, { width: newW, height: newH, x: newX, y: newY });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [windowId, updateWindow]);

  return { onResizeStart };
}
