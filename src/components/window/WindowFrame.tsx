import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { AppId } from '../../types/game';
import {
  Minus,
  Square,
  Copy,
  X,
  Mail,
  Globe,
  Terminal,
  FileCheck2,
  Trash2,
  Info,
} from 'lucide-react';

interface WindowFrameProps {
  appId: AppId;
  children: React.ReactNode;
}

const APP_ICONS: Record<string, React.ElementType> = {
  Mail,
  Globe,
  Terminal,
  FileCheck2,
  Trash2,
  Info,
};

export const WindowFrame: React.FC<WindowFrameProps> = ({ appId, children }) => {
  const windowState = useGameStore((s) => s.windows[appId]);
  const maxZIndex = useGameStore((s) => s.maxZIndex);
  const closeWindow = useGameStore((s) => s.closeWindow);
  const minimizeWindow = useGameStore((s) => s.minimizeWindow);
  const maximizeWindow = useGameStore((s) => s.maximizeWindow);
  const focusWindow = useGameStore((s) => s.focusWindow);
  const updateWindowPosition = useGameStore((s) => s.updateWindowPosition);
  const updateWindowSize = useGameStore((s) => s.updateWindowSize);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });
  const resizeStartRef = useRef<{ startX: number; startY: number; startW: number; startH: number }>({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  const isFocused = windowState.zIndex === maxZIndex;
  const IconComponent = APP_ICONS[windowState.icon] || Info;

  // Dragging logic
  const handleMouseDownTitle = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;

    focusWindow(appId);
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: windowState.position.x,
      posY: windowState.position.y,
    };
  };

  // Resizing logic
  const handleMouseDownResize = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    e.stopPropagation();
    focusWindow(appId);
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: windowState.size.width,
      startH: windowState.size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.startX;
        const dy = e.clientY - dragStartRef.current.startY;
        const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStartRef.current.posX + dx));
        const newY = Math.max(36, Math.min(window.innerHeight - 80, dragStartRef.current.posY + dy));
        updateWindowPosition(appId, { x: newX, y: newY });
      } else if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.startX;
        const dy = e.clientY - resizeStartRef.current.startY;
        const newW = Math.max(
          windowState.minSize.width,
          Math.min(window.innerWidth - 20, resizeStartRef.current.startW + dx)
        );
        const newH = Math.max(
          windowState.minSize.height,
          Math.min(window.innerHeight - 80, resizeStartRef.current.startH + dy)
        );
        updateWindowSize(appId, { width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, appId, windowState, updateWindowPosition, updateWindowSize]);

  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;

  const effectiveH = Math.min(windowState.size.height, Math.max(windowState.minSize.height, viewportH - 85));
  const effectiveW = Math.min(windowState.size.width, Math.max(windowState.minSize.width, viewportW - 20));
  const effectiveY = Math.max(38, Math.min(windowState.position.y, viewportH - effectiveH - 42));
  const effectiveX = Math.max(0, Math.min(windowState.position.x, viewportW - effectiveW));

  const style: React.CSSProperties = windowState.isMaximized
    ? {
        position: 'fixed',
        top: 36,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 76px)',
        zIndex: windowState.zIndex,
      }
    : {
        position: 'fixed',
        top: `${effectiveY}px`,
        left: `${effectiveX}px`,
        width: `${effectiveW}px`,
        height: `${effectiveH}px`,
        maxHeight: 'calc(100vh - 80px)',
        zIndex: windowState.zIndex,
      };

  return (
    <div
      onMouseDown={() => focusWindow(appId)}
      style={style}
      className={`flex flex-col rounded-md overflow-hidden shadow-2xl border transition-shadow duration-150 ${
        isFocused
          ? 'border-cyber-400 bg-cyber-900 shadow-cyan-900/20 ring-1 ring-cyan-500/30'
          : 'border-cyber-700/80 bg-cyber-950/95 opacity-95'
      }`}
    >
      {/* Title bar */}
      <div
        onMouseDown={handleMouseDownTitle}
        onDoubleClick={() => maximizeWindow(appId)}
        className={`h-8 px-3 flex items-center justify-between select-none cursor-move text-xs font-semibold ${
          isFocused
            ? 'bg-gradient-to-r from-cyber-800 via-cyber-700 to-cyber-800 text-cyan-200 border-b border-cyber-500/40'
            : 'bg-cyber-950 text-slate-400 border-b border-cyber-800'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <IconComponent className={`w-3.5 h-3.5 ${isFocused ? 'text-cyan-400' : 'text-slate-500'}`} />
          <span className="truncate font-mono tracking-wide">{windowState.title}</span>
        </div>

        {/* Window action buttons */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button
            onClick={() => minimizeWindow(appId)}
            title="最小化"
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-cyber-600/70 text-slate-300 hover:text-white transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => maximizeWindow(appId)}
            title={windowState.isMaximized ? '还原' : '最大化'}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-cyber-600/70 text-slate-300 hover:text-white transition-colors"
          >
            {windowState.isMaximized ? <Copy className="w-2.5 h-2.5" /> : <Square className="w-2.5 h-2.5" />}
          </button>
          <button
            onClick={() => closeWindow(appId)}
            title="关闭"
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="flex-1 overflow-hidden relative bg-cyber-900/90 text-slate-100 flex flex-col">
        {children}
      </div>

      {/* Resize handle (bottom right) */}
      {!windowState.isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-30 opacity-40 hover:opacity-100"
        >
          <div className="w-full h-full border-b-2 border-r-2 border-cyan-400/80 rounded-br" />
        </div>
      )}
    </div>
  );
};
