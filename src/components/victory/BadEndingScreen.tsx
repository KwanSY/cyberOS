import React, { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  RotateCcw,
  Skull,
  FileText,
  AlertOctagon,
  Terminal as TermIcon,
  RefreshCw,
} from 'lucide-react';

export const BadEndingScreen: React.FC = () => {
  const narrativeStage = useGameStore((s) => s.narrativeStage);
  const rewindDeadManSwitch = useGameStore((s) => s.rewindDeadManSwitch);
  const restartGame = useGameStore((s) => s.restartGame);

  useEffect(() => {
    if (narrativeStage === 'BAD_ENDING') {
      soundService.playBadEndingDrone();
    }
    return () => {
      soundService.stopBadEndingDrone();
    };
  }, [narrativeStage]);

  if (narrativeStage !== 'BAD_ENDING') return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-6 select-none font-sans overflow-hidden">
      <div className="bg-slate-900 border-2 border-red-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in text-slate-100 relative">
        {/* Cold Blue/Black Seal Banner */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 p-5 border-b border-red-700/60 text-center relative shrink-0">
          <div className="inline-flex items-center gap-2 bg-red-950/90 border border-red-500 text-red-300 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2">
            <Skull className="w-4 h-4 text-red-400" />
            <span>【终局分支 · BAD ENDING】</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            平庸之恶的沉默协作者 (The Silent Accomplice)
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            CASE CLOSED & SEALED · SYSTEM TERMINATED PERMANENTLY
          </p>

          {/* Heavy Official Sealed Stamp */}
          <div className="absolute right-6 top-3 pointer-events-none rotate-[-12deg] opacity-90 select-none">
            <div className="w-24 h-24 border-4 border-red-600 rounded-full flex flex-col items-center justify-center text-red-400 font-black text-xs border-dashed bg-red-950/60 shadow-2xl">
              <div className="text-[9px] tracking-widest text-red-300">★ 审查终结 ★</div>
              <div className="text-xs font-black my-0.5 text-white">永久封存</div>
              <div className="text-[8px] font-mono text-red-300">CASE SEALED</div>
            </div>
          </div>
        </div>

        {/* Scrollable Narrative Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs leading-relaxed">
          {/* Simulated Terminal Shutdown Log */}
          <div className="bg-black/90 p-3.5 rounded-lg border border-slate-700 font-mono text-[11px] space-y-1.5 text-slate-300 shadow-inner">
            <div className="text-red-400 font-bold flex items-center gap-1.5">
              <TermIcon className="w-3.5 h-3.5 text-red-400" />
              <span>[SESSION AUTH TERMINATION]</span>
            </div>
            <div className="text-slate-400">[SYS_AUTH] FA-9021 session revoked by Root directive.</div>
            <div className="text-amber-400 font-semibold">[REMOTE] 198.51.100.24 transfer completed. $20M cleared.</div>
            <div className="text-red-400 font-bold">[ARCHIVE] CASE-20100610-01 permanently locked. Workstation isolated.</div>
          </div>

          {/* Somber Epilogue Narrative */}
          <div className="bg-slate-950/80 p-5 rounded-lg border border-slate-700 text-slate-200 text-xs leading-relaxed space-y-3.5 font-serif shadow-inner">
            <div className="font-bold text-amber-300 font-sans text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>现实回响与命运悲剧：</span>
            </div>
            <p>
              你遵从了上级指令，亲手在结案通报上盖下了归档公章。天宇科技与远景生命凭借这份被抹去一切严重不良反应的造假临床报告，顺利完成了海外纳斯达克 IPO 上市，市值突破 <strong className="text-cyan-300 font-sans">35 亿美元</strong>；财务总监沈明远与临床主任梁绍辉套现数亿，移居海外。
            </p>
            <p>
              三年后，你患有进行性神经退行性病变的妹妹 <strong className="text-amber-300 font-sans">关悦</strong>，在圣路加医院如期注射了这款被官方公报包装为“神经康复神药”的 <strong className="text-red-400 font-sans">奇美拉-N</strong>。注射后两周，妹妹因不可逆重度脑萎缩在昏迷中痛苦离世。
            </p>
            <p>
              出院死亡诊断书上，赫然盖着梁绍辉起草的标准假免责结论——<span className="text-red-300 italic font-mono">“系患者隐瞒家族遗传病史所致，与药物无因果关联”</span>。
            </p>
            <p className="border-l-2 border-slate-500 pl-3 text-slate-300 italic">
              你升任了首席合规审计官，办公桌抽屉里静静放着当年签署归档换来的晋升嘉奖令与年终奖。而银行账户里用来支付妹妹抢救账单与丧葬费的那笔钱，成为了你终生无法洗净的平庸之恶烙印。
            </p>
          </div>

          {/* Anti-frustration Notice */}
          <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-600/60 text-[11px] text-blue-200 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              挫败保护与节点回溯机制已激活：你可以随时倒带至死人开关激活时刻，推翻平庸妥协，越权追查真凶。
            </span>
          </div>
        </div>

        {/* Pinned Bottom Action Toolbar (Always Visible!) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              restartGame();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>【重新开始案卷】(Restart)</span>
          </button>

          <button
            onClick={() => {
              rewindDeadManSwitch();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-black transition-all shadow-xl flex items-center justify-center gap-2 border border-amber-400 animate-pulse hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>【读取死人开关节点 · 重新抉择】(Rewind to Dead Man's Switch)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
