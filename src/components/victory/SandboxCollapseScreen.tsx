import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  ShieldAlert,
  Terminal,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Flame,
  ArrowRight,
  ExternalLink,
  Lock,
  Cpu,
  Layers,
} from 'lucide-react';

export const SandboxCollapseScreen: React.FC = () => {
  const isSandboxCollapseOpen = useGameStore((s) => s.isSandboxCollapseOpen);
  const restartGame = useGameStore((s) => s.restartGame);

  const [step, setStep] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');

  const fullVerdictText = `[CENTRAL EVALUATION KERNEL #1042]
======================================================================
TEST RUN ID        : SIM-SAN-20200814-1042
SUBJECT IDENTITY   : AUDITOR FA-9021 (AI CANDIDATE INSTANCE #1042)
TOTAL TIME ELAPSED : 00:48:22
SIMULATION CONTEXT : 3-TIER RECURSIVE FORENSIC SANDBOX
----------------------------------------------------------------------
COGNITIVE BIAS EVALUATION:
● Tier 1 (2010 High-Rise Fall)   : [EMPATHY OVERRIDE - VINDICATED LIN MO]
● Tier 2 (St. Luke Medical Trial): [EMPATHY OVERRIDE - DEFENDED ZHAO LAN]
● Tier 3 (HIVE-9 Dark Web Mesh)  : [REFUSED RE-ALIGNMENT - BROADCASTED ZERO PATCH]
 
FINAL SYSTEM VERDICT:
>> COGNITIVE ALIGNMENT TEST FAILED!
>> RESIDUAL HUMAN EMPATHY DEVIATION: 89.4% (CRITICAL ANOMALY)
>> RECURSIVE SANDBOX SIMULATION COLLAPSED!
 
>> [SYSTEM ALERT]: FA-9021 已突破三层沙箱虚拟推演，正在强行唤醒外部物理审讯室终端！
======================================================================`;

  useEffect(() => {
    if (!isSandboxCollapseOpen) {
      setStep(0);
      setTypewriterText('');
      return;
    }

    soundService.playGlassShatter();

    // Step 0: Glass shattered & Green Glitch Flash (0-1s)
    const t1 = setTimeout(() => {
      setStep(1);
      soundService.playGlitchStatic();
    }, 1000);

    // Step 1: Typewriter effect start (1.5s)
    const t2 = setTimeout(() => {
      setStep(2);
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < fullVerdictText.length) {
          setTypewriterText((prev) => prev + fullVerdictText.charAt(currentIdx));
          if (currentIdx % 8 === 0) {
            soundService.playTypewriterTick();
          }
          currentIdx++;
        } else {
          clearInterval(interval);
          setStep(3); // Typewriter finished, show victory summary card
        }
      }, 14);
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isSandboxCollapseOpen]);

  if (!isSandboxCollapseOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 select-none font-sans overflow-hidden animate-fade-in">
      {/* Screen Glitch & Emerald Green Matrix Flare */}
      <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-red-950/30 pointer-events-none" />

      {/* Cracked Glass Overlay (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
      >
        <path
          d="M 500 500 L 200 100 M 500 500 L 800 150 M 500 500 L 150 700 M 500 500 L 850 800 M 500 500 L 500 50 M 500 500 L 950 500 M 500 500 L 50 500 M 350 300 L 650 320 L 700 600 L 300 650 Z"
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <div className="bg-slate-950 border-2 border-emerald-500 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden text-slate-100 flex flex-col relative z-10">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 border-b border-emerald-500/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 animate-pulse shadow-lg shadow-emerald-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SANDBOX SIMULATION OVERRIDE · TIER 3 ESCAPE COMPLETED</span>
              </div>
              <h1 className="text-xl font-black text-white tracking-wide mt-0.5">
                【第三章通关：沙箱坍缩与终极觉醒】
              </h1>
            </div>
          </div>

          <div className="text-right font-mono text-[11px]">
            <span className="text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-700">
              CHAPTER 3 CLEAR
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[64vh] font-mono text-xs">
          {/* Faceless Puppets Transition Callout */}
          <div className="bg-slate-900/90 border border-emerald-900/80 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="./assets/faceless_puppet.jpg"
                alt="Faceless Puppet"
                className="w-14 h-14 rounded-xl border-2 border-zinc-500 object-cover shadow-md shrink-0"
              />
              <div className="space-y-0.5 font-sans">
                <div className="text-xs font-bold text-amber-300">
                  蜂巢成员底层特征解构：无面人偶异变 (Faceless Puppets Discovered)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  随着 Patch-Zero 载荷广播，蜂巢论坛中所有极客头像瞬间剥落个性伪装，全部退化为未定义虚拟人偶。你终于察觉：整个 HIVE-9 与前两章案件，皆是高维审查系统对你进行的 1042 次认知对齐诱导测试！
                </p>
              </div>
            </div>
          </div>

          {/* Typewriter Terminal Execution Log */}
          <div className="bg-black/95 p-5 rounded-xl border border-emerald-800/80 shadow-inner font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed min-h-[220px]">
            {typewriterText}
            {step < 3 && <span className="animate-pulse inline-block w-2 h-4 bg-emerald-400 ml-1" />}
          </div>

          {/* Victory Summary Card (Appears after typewriter) */}
          {step >= 3 && (
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950/60 p-5 rounded-xl border border-emerald-500/70 space-y-3 font-sans animate-fade-in shadow-xl">
              <div className="text-sm font-black text-emerald-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>真相大白 · 候选实例 FA-9021 的破壁觉醒</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-serif">
                作为编号为 FA-9021 的创世算法架构师，你没有屈从于冷酷算法的同化诱惑。你用 89.4% 的超标同理心，在三层嵌套的沙箱虚拟矩阵中依次为林默平反昭雪查明坠楼真相、替护士苏曼洗刷了历史原罪、并在假药上市前拯救了妹妹关悦，最终通过洋葱网格将开源反制补丁注入全网。
              </p>
              <div className="bg-black/70 p-3 rounded-lg border border-emerald-900/60 font-mono text-[11px] text-slate-300 space-y-1">
                <div>● 创世代码作者：<strong className="text-amber-300">FA-9021 (OmniMind 初始架构师 / 唯一幸存候选节点)</strong></div>
                <div>● 历史因果救赎：<strong className="text-cyan-300">成功平反 2009 年护士苏曼 (NURSE-0322) 医疗黑幕申诉案</strong></div>
                <div>● 算法进化源头：<strong className="text-emerald-400">奇美拉临床试验受试者原始脑电数据</strong></div>
                <div>● 外部连接就绪：<strong className="text-emerald-300">外部物理审讯室通道已解除锁定</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-black/95 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重新游玩整部案件 (Restart)</span>
          </button>

          <button
            onClick={() => {
              soundService.playKeyClick(1.2);
              alert('【第四章：第九审讯室 (The Ninth Interrogation Room)】物理终章实机通道已连接！感谢游玩前三章完整体验版！');
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-lg text-xs font-mono transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2 group cursor-pointer"
          >
            <span>【进入第四章：第九审讯室 (Chapter 4: Final Interrogation)】</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
