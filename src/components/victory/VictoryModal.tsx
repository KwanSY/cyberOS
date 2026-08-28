import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  Trophy,
  ShieldCheck,
  Sparkles,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VictoryModal: React.FC = () => {
  const isVictoryModalOpen = useGameStore((s) => s.isVictoryModalOpen);
  const setVictoryModalOpen = useGameStore((s) => s.setVictoryModalOpen);
  const setClosureModalOpen = useGameStore((s) => s.setClosureModalOpen);
  const collectedWords = useGameStore((s) => s.collectedWords);

  if (!isVictoryModalOpen) return null;

  const triggerMoreConfetti = () => {
    soundService.playVictoryFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const handleProceedToClosure = () => {
    soundService.playKeyClick(1.2);
    setVictoryModalOpen(false);
    setClosureModalOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-cyber-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-cyber-900 border-2 border-emerald-500 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in text-slate-100 flex flex-col font-sans">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-cyber-900 to-emerald-950 p-6 border-b border-emerald-600/50 text-center relative">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500 text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>第一章 DEMO 通关达成 · 专案定罪归档</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            【案号 01：暴雨夜的断网事故】调查终结
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            CASE-20100610-01 FORENSIC AUDIT COMPLETE
          </p>

          {/* Official Red Stamp with -9deg rotation */}
          <div className="absolute right-8 top-4 pointer-events-none rotate-[-9deg] opacity-90 select-none">
            <div className="w-24 h-24 border-4 border-red-600 rounded-full flex flex-col items-center justify-center text-red-500 font-black text-xs border-dashed bg-red-950/20">
              <div className="text-[9px]">★ 审计终审 ★</div>
              <div className="text-xs font-black my-0.5">定罪成立</div>
              <div className="text-[8px] font-mono">予以归档</div>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          {/* Epilogue Story Narrative */}
          <div className="bg-cyber-950 p-4 rounded-lg border border-cyber-700 text-slate-200 text-xs leading-relaxed space-y-3 font-serif">
            <div className="font-bold text-amber-300 font-sans text-sm flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>案件真相复原 (Case Debriefing)：</span>
            </div>
            <p>
              2010年6月9日深夜，天宇科技副总裁 <strong className="text-cyan-300">陈建国</strong> 借雷暴引发光缆断网之机，意图将涉及 1,200 名患者隐私的 <strong className="text-amber-300">奇美拉三期临床试验数据</strong> 秘密外传至其境外的空壳公司节点（<strong className="text-emerald-300">198.51.100.24</strong>）。
            </p>
            <p>
              为掩人耳目，陈建国在 1 楼闸机打卡伪造不在场证明后，穿风衣潜回 15 楼机房，盗用林默的 <strong className="text-cyan-300">Root权限密钥</strong> 执行了全盘强行覆写与日志擦除。当林默在机房现场撞破并誓死阻拦时，陈建国丧心病狂将其推下天台灭口。
            </p>
            <p className="border-l-2 border-emerald-500 pl-3 text-slate-300 italic font-mono text-[11px]">
              然而，林默生前部署的双向远端脱机镜像（remote_mirror.bak）与加密日记（diary.enc），最终成为了刺破黑暗、将真凶绳之以法的不可磨灭铁证。
            </p>
          </div>

          {/* Audit Statistics */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="bg-cyber-950 p-3 rounded border border-cyber-800">
              <div className="text-[10px] text-slate-400">已提取关键词块</div>
              <div className="text-lg font-black text-cyan-300 mt-0.5">{collectedWords.length} 个</div>
            </div>
            <div className="bg-cyber-950 p-3 rounded border border-cyber-800">
              <div className="text-[10px] text-slate-400">定罪证据链完整度</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">100%</div>
            </div>
            <div className="bg-cyber-950 p-3 rounded border border-cyber-800">
              <div className="text-[10px] text-slate-400">数字法医代号</div>
              <div className="text-lg font-black text-amber-300 mt-0.5">FA-9021</div>
            </div>
          </div>

          {/* Chapter 2 Cliffhanger */}
          <div className="bg-gradient-to-r from-red-950/60 to-cyber-950 p-3.5 rounded border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300">【案卷移送与上级指令】</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                特别督查局已下达《案卷审查终结通报》，指令你立即签署归档并交回审计特权。但林默留下的死人开关中继信号仍在闪烁……
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-cyber-950 border-t border-cyber-800 flex items-center justify-between">
          <button
            onClick={triggerMoreConfetti}
            className="px-4 py-2 bg-cyber-800 hover:bg-cyber-700 text-slate-300 rounded text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>再次庆祝</span>
          </button>

          <button
            onClick={handleProceedToClosure}
            className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-2 animate-pulse"
          >
            <span>进入案卷结案审查 (Proceed to Case Closure)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
