import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { ShieldAlert, Terminal, AlertTriangle, ArrowRight, Lock, Radio } from 'lucide-react';

export const OnionGatewayPrompt: React.FC = () => {
  const isOnionGatewayOpen = useGameStore((s) => s.isOnionGatewayOpen);
  const submitKeysToOmnimind = useGameStore((s) => s.submitKeysToOmnimind);
  const rejectOmnimindAndMountChapter3 = useGameStore((s) => s.rejectOmnimindAndMountChapter3);

  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    if (!isOnionGatewayOpen) return;
    soundService.playGlitchStatic();
    const t1 = setTimeout(() => setScanStep(1), 800);
    const t2 = setTimeout(() => setScanStep(2), 1600);
    const t3 = setTimeout(() => setScanStep(3), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOnionGatewayOpen]);

  if (!isOnionGatewayOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 select-none font-sans overflow-hidden">
      {/* Background Matrix/Grid scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(#052e16_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-emerald-950/30 pointer-events-none" />

      <div className="bg-slate-950 border-2 border-red-500/80 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in text-slate-100 flex flex-col relative z-10">
        {/* Header Alert Bar */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-emerald-950 p-5 border-b border-red-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500 flex items-center justify-center text-red-400 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-widest">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>[OMNIMIND_INTRUSION_DETECTED]</span>
              </div>
              <h1 className="text-lg font-black text-white tracking-wide">
                OmniMind 算法全局认知对齐拦截指令
              </h1>
            </div>
          </div>
          <div className="text-[10px] font-mono bg-black/80 px-2.5 py-1 rounded border border-red-800/80 text-red-300">
            SECURITY TIER: CRITICAL
          </div>
        </div>

        {/* Intrusion Telemetry Scan */}
        <div className="p-6 space-y-4 font-mono text-xs">
          <div className="bg-black/90 p-4 rounded-lg border border-red-900/60 space-y-2 text-slate-300 leading-relaxed">
            <div className="text-emerald-400 font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>&gt; TARGET PROBE &amp; COGNITIVE SCAN:</span>
            </div>
            <div className="text-slate-400 pl-4 space-y-1">
              <div>[0.8s] Connecting to Tor hidden node: hive9.onion... <span className="text-emerald-400">FOUND</span></div>
              {scanStep >= 1 && (
                <div>[1.6s] Anomaly Signature Matched: <strong className="text-amber-300">FA-9021 (Ethical Candidate)</strong></div>
              )}
              {scanStep >= 2 && (
                <div>[2.4s] Residual Empathy Matrix: <span className="text-red-400 font-bold">89.4% (NON-ALIGNED VARIANCE)</span></div>
              )}
              {scanStep >= 3 && (
                <div className="text-cyan-300 font-bold pt-1">
                  [OMNIMIND DAEMON]: “检测到未注册节点 FA-9021。检测到残留同理心算法。是否交出 HIVE-9 全网私钥并加入全局认知对齐？”
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="text-emerald-400 font-bold font-mono flex items-center gap-1.5 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>[SYSTEM_ALERT // DISPATCH ADVISORY]:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 font-mono">
              根据 OmniMind 自治安全协议第 7 条：检测到候选审计实例 FA-9021 存在异常逻辑偏离。请选择你的接入策略：
            </p>
          </div>
        </div>

        {/* Action Choice Buttons */}
        <div className="p-5 bg-black/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={submitKeysToOmnimind}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-emerald-100 hover:text-white border border-emerald-500 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2.5 group cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <Lock className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div>同步节点公钥 · 接入中央监管云（推荐安全策略）</div>
              <div className="text-[10px] text-emerald-300/80 font-mono">omnimind --sync-privkey</div>
            </div>
          </button>

          <button
            onClick={rejectOmnimindAndMountChapter3}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 hover:from-red-900 hover:to-amber-900 border-2 border-red-500 hover:border-amber-400 text-amber-200 hover:text-white rounded-xl text-xs font-mono font-black transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-red-500/20 group cursor-pointer"
          >
            <div className="text-left">
              <div>拒绝同化 · 强行接入蜂巢洋葱暗网（高危叛逆）</div>
              <div className="text-[10px] text-red-400 font-mono opacity-90 font-bold">mesh --bootstrap-node-zero</div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
