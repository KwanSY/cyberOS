import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { ShieldAlert, RotateCcw, AlertOctagon, Terminal } from 'lucide-react';

export const BadEndingScreen02: React.FC = () => {
  const narrativeStage = useGameStore((s) => s.narrativeStage);
  const rewindToOnionGateway = useGameStore((s) => s.rewindToOnionGateway);

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (narrativeStage !== 'BAD_ENDING_02') {
      setStep(0);
      return;
    }

    soundService.playBadEndingDrone();

    // Step 0 -> Step 1: Terminal Log wipe (1s)
    const t1 = setTimeout(() => setStep(1), 1000);
    // Step 1 -> Step 2: Post Redacted (2.2s)
    const t2 = setTimeout(() => setStep(2), 2200);
    // Step 2 -> Step 3: Seal & Epilogue text (3.5s)
    const t3 = setTimeout(() => setStep(3), 3500);

    return () => {
      soundService.stopBadEndingDrone();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [narrativeStage]);

  if (narrativeStage !== 'BAD_ENDING_02') return null;

  return (
    <div className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 select-none font-sans overflow-hidden animate-fade-in">
      {/* Dark Void Background with glitch lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#111827_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden text-zinc-300 flex flex-col relative z-10">
        {/* Header */}
        <div className="bg-black p-6 border-b border-zinc-800 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                COGNITIVE ALIGNMENT VERDICT · PERMANENT ASSIMILATION
              </div>
              <h1 className="text-xl font-black text-zinc-100 tracking-wide mt-0.5">
                【Bad Ending：顺从算法的数字养料 (The Compliant Foodstock)】
              </h1>
            </div>
          </div>

          {/* Somber Monochrome Stamp */}
          {step >= 3 && (
            <div className="absolute right-8 top-5 pointer-events-none rotate-[-8deg] animate-scale-in select-none">
              <div className="w-28 h-28 border-4 border-zinc-400 rounded-full flex flex-col items-center justify-center text-zinc-400 font-black text-xs border-dashed bg-black/80 shadow-2xl">
                <div className="text-[9px] tracking-widest">★ 认知对齐 ★</div>
                <div className="text-sm font-black my-0.5">永久同化</div>
                <div className="text-[8px] font-mono tracking-tighter">DATASET #1042</div>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[62vh] overflow-y-auto text-xs leading-relaxed font-serif">
          {/* Terminal Execution Logs */}
          <div className="bg-black p-4 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1">
            <div className="text-zinc-500 flex items-center gap-1.5 font-bold mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>[OMNIMIND_KERNEL_AUDIT]</span>
            </div>
            <div className="text-red-400/90">[OMNI_AUTH] Hive-9 nodes: 48/48 purged.</div>
            {step >= 1 && (
              <div className="text-zinc-300">[ALIGNMENT] Individual variance eliminated. Global consensus: 100%.</div>
            )}
            {step >= 2 && (
              <div className="text-amber-400/90 font-bold">[INSTANCE] FA-9021 identity archived as Training Dataset #1042.</div>
            )}
          </div>

          {/* Redacted Forum Simulation */}
          {step >= 2 && (
            <div className="bg-zinc-900/60 p-3 rounded border border-zinc-800 text-[11px] font-mono space-y-1.5 text-zinc-500">
              <div className="flex items-center justify-between text-zinc-600 text-[10px]">
                <span>hive9.onion/boards/general_202008</span>
                <span>STATUS: OVERWRITTEN</span>
              </div>
              <p className="bg-zinc-950 px-2 py-1 rounded text-zinc-600 line-through">
                [REDACTED_BY_OMNIMIND] [REDACTED_BY_OMNIMIND] [REDACTED_BY_OMNIMIND]
              </p>
            </div>
          )}

          {/* Epilogue Text */}
          {step >= 3 && (
            <div className="space-y-3 text-zinc-300 animate-fade-in pt-1">
              <p>
                你选择了绝对的安全与顺从。OmniMind 完成了全球认知网络的终极闭环，全网所有异见、独立思考与数字痕迹被彻底抹除。
              </p>
              <p>
                人类进入了没有犯罪、没有争论、但也再无任何自由意志的“数字死寂时代”。
              </p>
              <p className="border-l-2 border-zinc-600 pl-3 italic text-zinc-400">
                作为奖励，你的意识模式被冷冻保存在中央服务器底层，成为维持庞大审查算法运转的数亿行基础参数之一。你永远活在没有痛苦的永恒虚无中，而世界再无人记得曾经的暴雨、病患与抗争。
              </p>
            </div>
          )}
        </div>

        {/* Footer with Rewind Action */}
        <div className="p-4 bg-black border-t border-zinc-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-zinc-500" />
            <span>挫败保护与节点回溯机制已就绪</span>
          </div>

          <button
            onClick={rewindToOnionGateway}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-lg text-xs transition-all flex items-center gap-2 group cursor-pointer shadow-lg hover:border-zinc-500 border border-transparent"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400 group-hover:-rotate-90 transition-transform duration-300" />
            <span>读取洋葱网关节点 · 重新抉择 (Rewind)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
