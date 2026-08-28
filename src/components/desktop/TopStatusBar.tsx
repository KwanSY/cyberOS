import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  ShieldAlert,
  Clock,
  Volume2,
  VolumeX,
  Tv,
  Radio,
  ChevronDown,
  CheckCircle2,
  Lock,
  Layers,
  AlertTriangle,
} from 'lucide-react';

export const TopStatusBar: React.FC = () => {
  const currentChapter = useGameStore((s) => s.currentChapter);
  const osVersion = useGameStore((s) => s.osVersion);
  const caseId = useGameStore((s) => s.caseId);
  const objectives = useGameStore((s) => s.objectives);
  const systemTime = useGameStore((s) => s.systemTime);
  const settings = useGameStore((s) => s.settings);
  const toggleCrt = useGameStore((s) => s.toggleCrt);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const toggleAmbientHum = useGameStore((s) => s.toggleAmbientHum);
  const collectedWords = useGameStore((s) => s.collectedWords);
  const openWindow = useGameStore((s) => s.openWindow);

  const [showObjectivesMenu, setShowObjectivesMenu] = useState(false);

  const currentObj =
    objectives.find((o) => o.status === 'active') ||
    objectives[objectives.length - 1];

  const handleObjectiveClick = () => {
    soundService.playKeyClick(1.1);
    setShowObjectivesMenu(!showObjectivesMenu);
  };

  const handleOpenDeduction = () => {
    soundService.playKeyClick();
    openWindow('deduction');
  };

  return (
    <header className="h-9 bg-cyber-900/95 border-b border-cyber-700/80 px-3 flex items-center justify-between text-xs select-none z-40 backdrop-blur-md shadow-md">
      {/* Left: OS Branding & Case info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-400">
          <ShieldAlert className={`w-4 h-4 ${currentChapter === 2 ? 'text-amber-400 animate-bounce' : 'text-cyan-400 animate-pulse'}`} />
          <span>{osVersion}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
            currentChapter === 2
              ? 'bg-amber-950 text-amber-300 border-amber-800'
              : 'bg-cyan-950 text-cyan-300 border-cyan-800'
          }`}>
            FA-9021
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400 border-l border-cyber-700 pl-3 font-mono text-[11px]">
          <span>案号:</span>
          <span className={currentChapter === 2 ? 'text-amber-400 font-bold' : 'text-cyan-300 font-bold'}>
            {caseId}
          </span>
          {currentChapter === 2 && (
            <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.2 rounded border border-red-800 animate-pulse">
              [OVERRIDE]
            </span>
          )}
        </div>
      </div>

      {/* Center: Active Objective Beacon Bar */}
      <div className="relative">
        <button
          onClick={handleObjectiveClick}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all text-xs group shadow-inner border ${
            currentChapter === 2
              ? 'bg-amber-950/80 hover:bg-amber-900/90 border-amber-600/80 text-amber-200'
              : 'bg-cyber-950/80 hover:bg-cyber-800 border-cyber-600/70 text-slate-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full animate-ping ${currentChapter === 2 ? 'bg-amber-400' : 'bg-cyan-400'}`} />
          <span className="font-bold font-mono text-amber-400">
            {currentChapter === 2 ? '【审计员私密备忘】' : '【当前调查目标】'}
          </span>
          <span className="font-medium max-w-[280px] sm:max-w-md truncate">
            {currentObj.stageName}：{currentObj.text}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showObjectivesMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown for all objectives */}
        {showObjectivesMenu && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-84 bg-cyber-900 border-2 border-cyber-600 rounded-lg shadow-2xl p-3 space-y-2 z-50 animate-fade-in font-sans">
            <div className="text-[11px] font-bold text-slate-400 border-b border-cyber-700 pb-1.5 flex items-center justify-between">
              <span>{currentChapter === 2 ? '第二章越权追查推进图谱' : '第一章调查推进图谱'}</span>
              <span className="text-amber-400">{objectives.length} 阶段</span>
            </div>

            <div className="space-y-1.5">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  className={`p-2 rounded flex items-center gap-2.5 text-xs transition-colors ${
                    obj.status === 'completed'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      : obj.status === 'active'
                      ? 'bg-amber-950/70 text-amber-200 border border-amber-600/80 font-bold'
                      : 'bg-slate-900/50 text-slate-500 border border-slate-800'
                  }`}
                >
                  {obj.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : obj.status === 'active' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-[10px] opacity-75 font-mono">{obj.stageName}</div>
                    <div className="text-xs">{obj.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Quick Tools & Status */}
      <div className="flex items-center gap-2 font-mono">
        {/* Word Bank Shortcut Pill */}
        <button
          onClick={handleOpenDeduction}
          title="点击打开调查定罪看板与词块库"
          className="flex items-center gap-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-600/60 px-2 py-0.5 rounded transition-all text-xs"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">词块库:</span>
          <span className="font-bold text-amber-300">{collectedWords.length}</span>
        </button>

        {/* Ambient Hum Toggle */}
        <button
          onClick={toggleAmbientHum}
          title={settings.ambientHumEnabled ? '关闭低频电流底噪' : '开启 50Hz 复古电流底噪'}
          className={`p-1 rounded transition-colors ${
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
          className={`p-1 rounded transition-colors ${
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
          className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
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
