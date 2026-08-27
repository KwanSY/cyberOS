import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { ShieldCheck, UserCheck, Lock } from 'lucide-react';

export const IdentityAuthModal: React.FC = () => {
  const setOnboardingStep = useGameStore((s) => s.setOnboardingStep);

  const handleConfirm = () => {
    soundService.playBeep(1000, 0.1);
    setOnboardingStep('warrant');
  };

  return (
    <div className="fixed inset-0 bg-cyber-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-cyber-900 border-2 border-cyber-500/60 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-cyber-800/90 px-5 py-3.5 border-b border-cyber-600/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider font-mono">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>CYBEROS 1.0 SECURE AUTHENTICATION</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">LEVEL 4 CLEARANCE</span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 bg-cyber-950/60 p-4 rounded border border-cyber-700/50">
            <div className="w-16 h-16 rounded-full bg-cyan-950/80 border-2 border-cyan-500/60 flex items-center justify-center text-cyan-300">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs text-cyan-400/80 font-mono">AUTHENTICATED PERSONNEL</div>
              <div className="text-lg font-bold text-white tracking-wide">专案档案审计员</div>
              <div className="text-sm font-mono text-amber-300 font-semibold mt-0.5">
                身份工号：FA-9021
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300 bg-slate-900/50 p-3.5 rounded border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">专案案号：</span>
              <span className="text-amber-400 font-semibold">CASE-20100610-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">涉案工作站：</span>
              <span className="text-cyan-300">林默 (EMP-0417) 离线镜像</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">取证授权模式：</span>
              <span className="text-emerald-400">全权独立调查 (Read-Only Mirror)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">系统时间：</span>
              <span className="text-slate-200">2010-06-10 09:30:00</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wider rounded shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>确认身份并接入案件工作站</span>
          </button>
        </div>
      </div>
    </div>
  );
};
