import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export const CrtOverlay: React.FC = () => {
  const crtEnabled = useGameStore((s) => s.settings.crtEnabled);

  if (!crtEnabled) return null;

  return (
    <div className="crt-overlay crt-flicker">
      {/* Scanlines grid */}
      <div className="absolute inset-0 crt-scanlines" />
      {/* Heavy vignette corner shadows */}
      <div className="absolute inset-0 crt-vignette" />
      {/* Ambient glass reflection / CRT phosphor glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/5 via-transparent to-blue-900/5 pointer-events-none" />
    </div>
  );
};
