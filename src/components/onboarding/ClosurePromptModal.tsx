import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  FileWarning,
  Stamp,
  ShieldAlert,
  Radio,
  Lock,
} from 'lucide-react';

export const ClosurePromptModal: React.FC = () => {
  const isClosureModalOpen = useGameStore((s) => s.isClosureModalOpen);
  const signArchiveAndClose = useGameStore((s) => s.signArchiveAndClose);
  const overrideAndMountChapter2 = useGameStore((s) => s.overrideAndMountChapter2);
  const triggerDeadManSwitch = useGameStore((s) => s.triggerDeadManSwitch);

  const [hasAlertTriggered, setHasAlertTriggered] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isClosureModalOpen) {
      setHasAlertTriggered(false);
      setCountdown(3);
      return;
    }

    // After 2.5 seconds, auto-inject the Critical Alert & Dead Man's Switch
    const timer = setTimeout(() => {
      setHasAlertTriggered(true);
      triggerDeadManSwitch();
      soundService.playBuzzer();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isClosureModalOpen, triggerDeadManSwitch]);

  if (!isClosureModalOpen) return null;

  const handleManualTrigger = () => {
    if (!hasAlertTriggered) {
      setHasAlertTriggered(true);
      triggerDeadManSwitch();
      soundService.playBuzzer();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div
        className={`bg-slate-900 border-2 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in text-slate-100 flex flex-col font-sans transition-all duration-500 ${
          hasAlertTriggered
            ? 'border-red-600 shadow-red-950/80 animate-pulse'
            : 'border-slate-700'
        }`}
      >
        {/* Red Head Official Document Header */}
        <div
          className={`p-6 border-b text-center relative transition-colors duration-500 ${
            hasAlertTriggered
              ? 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-red-800/60'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-600 text-red-300 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2">
            <FileWarning className="w-4 h-4 text-amber-400" />
            <span>【特别行政督查局 · 官方结案终结通报】</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            《CASE-20100610-01 案卷审查终结通报》
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            SECRET SEALED ORDER · DIRECTIVE TO FORENSIC AUDITOR FA-9021
          </p>

          {/* Official Red Seal */}
          <div className="absolute right-6 top-5 pointer-events-none rotate-[-6deg] opacity-80 select-none">
            <div className="w-20 h-20 border-4 border-red-600 rounded-full flex flex-col items-center justify-center text-red-500 font-black text-[10px] border-dashed bg-red-950/30">
              <div>★ 督查终审 ★</div>
              <div className="text-xs font-black my-0.5">即刻封存</div>
              <div className="text-[8px] font-mono">交回权限</div>
            </div>
          </div>
        </div>

        {/* Notice Body */}
        <div className="p-6 space-y-4 text-xs leading-relaxed max-h-[60vh] overflow-y-auto">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-serif text-slate-200">
            <p className="text-sm font-bold text-amber-300 font-sans">
              关于天宇科技副总裁陈建国案审查终结之行政指令：
            </p>
            <p>
              经联合调查组审议，陈建国涉嫌职务侵占与非法破坏数据，已正式移交司法部门羁押起诉。天宇科技“奇美拉（Project Chimera）”项目系涉及千亿市值的核心商业机密，全案即刻永久封存归档。
            </p>
            <p className="text-red-300 font-semibold border-l-2 border-red-500 pl-3">
              指令审计员 FA-9021：立即点击【签署归档并交回权限】，系统将注销该案所有审计特权并执行封存手续。不得擅自扩展调查范围。
            </p>
          </div>

          {/* Dead Man's Switch CRT Alert Stream (Appears AFTER 2.5s or on sign attempt) */}
          {hasAlertTriggered && (
            <div className="bg-red-950/95 border-2 border-red-500 rounded-lg p-4 space-y-2 text-red-200 animate-bounce-once font-mono shadow-2xl">
              <div className="flex items-center gap-2 font-bold text-red-400 text-xs uppercase tracking-wider">
                <Radio className="w-4 h-4 text-red-400 animate-ping" />
                <span>[CRITICAL ALERT] LIN_MO DEAD MAN'S SWITCH INJECTED!</span>
              </div>
              <div className="bg-black/90 p-3 rounded text-xs space-y-1.5 text-red-300 border border-red-800 leading-relaxed">
                <div className="text-amber-300 font-bold flex items-center justify-between">
                  <span>[REMOTE SOCKET] 198.51.100.24 STILL ACTIVE!</span>
                  <span className="text-[10px] bg-red-900 text-white px-2 py-0.5 rounded">越权注入</span>
                </div>
                <div className="font-serif text-slate-200 text-xs">
                  [林默生前死人开关警报]：<br />
                  “陈建国只是搬运工，真正的黑手是圣路加医院与远景生命！他们抹掉了 07 号受试者！如果归档，真相将永沉大海。用我的密钥挂载圣路加镜像：<code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">/mnt/st_luke_hospital_mirror.raw</code>！”
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Choice Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Branch A: Sign Archive (Leads to Bad Ending) */}
          <button
            onMouseEnter={handleManualTrigger}
            onClick={() => {
              soundService.playStampThud();
              signArchiveAndClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            <Stamp className="w-4 h-4 text-slate-400" />
            <span>【签署归档并交回权限】(遵循上级结案)</span>
          </button>

          {/* Branch B: Refuse Archive & Privilege Override (Only reveals after alert is triggered) */}
          {hasAlertTriggered ? (
            <button
              onClick={() => {
                soundService.playKeyClick(1.2);
                overrideAndMountChapter2();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-black transition-all shadow-xl flex items-center justify-center gap-2 border border-red-500 animate-pulse hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>【拒绝归档 · 越权追凶】(挂载圣路加镜像 Chapter 2)</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 italic">
              <Lock className="w-3.5 h-3.5" />
              <span>正在校验审计权限封存状态...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
