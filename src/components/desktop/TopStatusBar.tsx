import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  ShieldAlert,
  Clock,
  Volume2,
  VolumeX,
  Tv,
  Layers,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export const TopStatusBar: React.FC = () => {
  const currentChapter = useGameStore((s) => s.currentChapter);
  const osVersion = useGameStore((s) => s.osVersion);
  const caseId = useGameStore((s) => s.caseId);
  const systemTime = useGameStore((s) => s.systemTime);
  const settings = useGameStore((s) => s.settings);
  const toggleCrt = useGameStore((s) => s.toggleCrt);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const toggleAmbientHum = useGameStore((s) => s.toggleAmbientHum);
  const collectedWords = useGameStore((s) => s.collectedWords);
  const openWindow = useGameStore((s) => s.openWindow);

  const handleOpenDeduction = () => {
    soundService.playKeyClick();
    openWindow('deduction');
  };

  return (
    <header className="h-9 bg-cyber-900/95 border-b border-cyber-700/80 px-3 flex items-center justify-between text-xs select-none z-40 backdrop-blur-md shadow-md">
      {/* Left: OS Branding & Case info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono font-bold">
          <ShieldAlert
            className={`w-4 h-4 ${
              currentChapter === 3
                ? 'text-emerald-400 animate-pulse'
                : currentChapter === 2
                ? 'text-amber-400 animate-bounce'
                : 'text-cyan-400 animate-pulse'
            }`}
          />
          <span className={currentChapter === 3 ? 'text-emerald-400' : 'text-cyan-400'}>{osVersion}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
              currentChapter === 3
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : currentChapter === 2
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-cyan-950 text-cyan-300 border-cyan-800'
            }`}
          >
            FA-9021
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400 border-l border-cyber-700 pl-3 font-mono text-[11px]">
          <span>案号:</span>
          <span
            className={
              currentChapter === 3
                ? 'text-emerald-400 font-bold'
                : currentChapter === 2
                ? 'text-amber-400 font-bold'
                : 'text-cyan-300 font-bold'
            }
          >
            {caseId}
          </span>
        </div>
      </div>

      {/* Center: CyberOS System Status Indicator (Clean & Immersive, No spoilers) */}
      <div className="hidden sm:flex items-center gap-2 bg-black/50 border border-cyber-800/80 px-3 py-1 rounded-full text-[11px] font-mono text-slate-300 shadow-inner">
        <span
          className={`w-2 h-2 rounded-full ${
            currentChapter === 3
              ? 'bg-emerald-400 animate-pulse shadow-emerald-500/50'
              : currentChapter === 2
              ? 'bg-amber-400 animate-pulse shadow-amber-500/50'
              : 'bg-cyan-400 animate-pulse shadow-cyan-500/50'
          }`}
        />
        <span className="text-slate-400">STATUS:</span>
        <span
          className={`font-bold ${
            currentChapter === 3
              ? 'text-emerald-300'
              : currentChapter === 2
              ? 'text-amber-300'
              : 'text-cyan-300'
          }`}
        >
          {currentChapter === 3
            ? 'TOR P2P MESH ENCRYPTED'
            : currentChapter === 2
            ? 'ST. LUKE MED-QUERY LINK ACTIVE'
            : 'AUDITOR TERMINAL ONLINE'}
        </span>
      </div>

      {/* Right: Quick Tools & Status */}
      <div className="flex items-center gap-2 font-mono">

        {/* Word Bank Shortcut Pill */}
        <button
          onClick={handleOpenDeduction}
          title="点击打开调查定罪看板与词块库"
          className="flex items-center gap-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-600/60 px-2 py-0.5 rounded transition-all text-xs cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">词块库:</span>
          <span className="font-bold text-amber-300">{collectedWords.length}</span>
        </button>

        {/* Ambient Hum Toggle */}
        <button
          onClick={toggleAmbientHum}
          title={settings.ambientHumEnabled ? '关闭低频电流底噪' : '开启 50Hz 复古电流底噪'}
          className={`p-1 rounded transition-colors cursor-pointer ${
            settings.ambientHumEnabled
              ? 'bg-amber-950 text-amber-400 border border-amber-600/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
        </button>

        {/* CRT Scanline Toggle */}
        <button
          onClick={toggleCrt}
          title={settings.crtEnabled ? '关闭复古 CRT 扫描线滤镜' : '开启复古 CRT 扫描线滤镜'}
          className={`p-1 rounded transition-colors cursor-pointer ${
            settings.crtEnabled
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-600/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleMute}
          title={settings.audioMuted ? '取消静音' : '静音'}
          className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
        >
          {settings.audioMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </button>

        {/* Virtual Time */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-300 border-l border-cyber-700 pl-2 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{systemTime}</span>
        </div>
      </div>
    </header>
  );
};
