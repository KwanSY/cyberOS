import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { AppId } from '../../types/game';
import { WindowFrame } from '../window/WindowFrame';
import { MailApp } from '../apps/MailApp';
import { BrowserApp } from '../apps/BrowserApp';
import { TerminalApp } from '../apps/TerminalApp';
import { DeductionApp } from '../apps/DeductionApp';
import { TrashApp } from '../apps/TrashApp';
import { SystemInfoApp } from '../apps/SystemInfoApp';
import { VictoryModal } from '../victory/VictoryModal';
import {
  Mail,
  Globe,
  Terminal,
  FileCheck2,
  Trash2,
  Info,
  Sparkles,
  Lightbulb,
  X,
} from 'lucide-react';

const DESKTOP_SHORTCUTS: Array<{
  id: AppId;
  name: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}> = [
  {
    id: 'mailbox',
    name: 'MailBox',
    sub: '邮件客户端',
    icon: Mail,
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'netquery',
    name: 'NetQuery',
    sub: '档案检索浏览器',
    icon: Globe,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'cyberterminal',
    name: 'CyberTerminal',
    sub: '电子取证终端',
    icon: Terminal,
    color: 'from-emerald-700 to-green-900',
  },
  {
    id: 'deduction',
    name: 'DeductionBoard',
    sub: '终审定罪看板',
    icon: FileCheck2,
    color: 'from-red-600 to-amber-700',
  },
  {
    id: 'trash',
    name: 'Trash',
    sub: '回收站',
    icon: Trash2,
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 'systeminfo',
    name: 'SystemInfo',
    sub: '工作站系统信息',
    icon: Info,
    color: 'from-purple-600 to-indigo-700',
  },
];

export const Desktop: React.FC = () => {
  const openWindow = useGameStore((s) => s.openWindow);
  const toast = useGameStore((s) => s.toast);
  const clearToast = useGameStore((s) => s.clearToast);

  const [showTutorialHint, setShowTutorialHint] = useState(true);

  const handleIconDoubleClick = (appId: AppId) => {
    soundService.playKeyClick(1.2);
    openWindow(appId);
  };

  return (
    <main className="flex-1 relative w-full h-[calc(100vh-76px)] overflow-hidden select-none bg-cyber-950">
      {/* Industrial Grid Wallpaper & Circuit Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3052_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-950/40 via-transparent to-cyber-950/80 pointer-events-none" />

      {/* CyberOS Watermark Emblem */}
      <div className="absolute right-12 bottom-12 pointer-events-none opacity-10 flex flex-col items-end text-cyan-400">
        <div className="text-6xl font-black font-mono tracking-tighter">CyberOS 1.0</div>
        <div className="text-sm font-mono tracking-widest mt-1">FORENSIC SUITE · FA-9021</div>
      </div>

      {/* Non-intrusive Forensic Guidance Bubble */}
      {showTutorialHint && (
        <aside aria-label="取证侦办小贴士" className="absolute top-4 right-4 max-w-sm bg-cyber-900/90 border border-cyan-500/70 rounded-lg p-3 shadow-xl backdrop-blur-sm z-30 animate-fade-in font-sans text-xs text-slate-200">
          <div className="flex items-center justify-between font-bold text-cyan-300 mb-1 font-mono">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>数字法医取证指南</span>
            </div>
            <button
              onClick={() => setShowTutorialHint(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            在邮件与网页中点击 <span className="text-amber-300 underline font-semibold">高亮实体词条</span> 可直接提取入【词块库】；在终端运行 <code className="bg-black/60 px-1 py-0.5 rounded text-cyan-300 font-mono">decrypt</code> 与 <code className="bg-black/60 px-1 py-0.5 rounded text-cyan-300 font-mono">diff</code> 可解锁深层铁证！
          </p>
        </aside>
      )}

      {/* Toast Notification (e.g. Word Pickup) */}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-cyber-900 border-2 border-cyan-400 text-cyan-100 px-4 py-2 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-fade-in font-sans text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="font-bold">{toast.text}</span>
          <button
            onClick={clearToast}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Desktop Icon Grid */}
      <div className="p-6 grid grid-flow-col grid-rows-4 gap-6 w-max select-none z-10 relative">
        {DESKTOP_SHORTCUTS.map((sc) => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              type="button"
              onDoubleClick={() => handleIconDoubleClick(sc.id)}
              onClick={() => soundService.playKeyClick(1.05)}
              className="w-24 flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-cyber-800/60 border border-transparent hover:border-cyber-600/60 focus:bg-cyber-800/80 focus:border-cyan-500/80 transition-all group text-left cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sc.color} p-2.5 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 group-hover:shadow-cyan-500/20 transition-all`}
              >
                <Icon className="w-full h-full text-white" />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 leading-tight">
                  {sc.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {sc.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Windows Layer */}
      <WindowFrame appId="mailbox">
        <MailApp />
      </WindowFrame>

      <WindowFrame appId="netquery">
        <BrowserApp />
      </WindowFrame>

      <WindowFrame appId="cyberterminal">
        <TerminalApp />
      </WindowFrame>

      <WindowFrame appId="deduction">
        <DeductionApp />
      </WindowFrame>

      <WindowFrame appId="trash">
        <TrashApp />
      </WindowFrame>

      <WindowFrame appId="systeminfo">
        <SystemInfoApp />
      </WindowFrame>

      {/* Victory Celebration Modal */}
      <VictoryModal />
    </main>
  );
};
