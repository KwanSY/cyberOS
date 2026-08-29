import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { AppId } from '../../types/game';
import { WindowFrame } from '../window/WindowFrame';
import { MailApp } from '../apps/MailApp';
import { BrowserApp } from '../apps/BrowserApp';
import { HiveNetApp } from '../apps/HiveNetApp';
import { CyberGitApp } from '../apps/CyberGitApp';
import { ChainExplorerApp } from '../apps/ChainExplorerApp';
import { TerminalApp } from '../apps/TerminalApp';
import { DeductionApp } from '../apps/DeductionApp';
import { CyberPlayerApp } from '../apps/CyberPlayerApp';
import { NotepadApp } from '../apps/NotepadApp';
import { TrashApp } from '../apps/TrashApp';
import { SystemInfoApp } from '../apps/SystemInfoApp';
import { VictoryModal } from '../victory/VictoryModal';
import { ClosurePromptModal } from '../onboarding/ClosurePromptModal';
import { BadEndingScreen } from '../victory/BadEndingScreen';
import { BadEndingScreen02 } from '../victory/BadEndingScreen02';
import { MeltdownEscapeModal } from '../victory/MeltdownEscapeModal';
import { OnionGatewayPrompt } from '../onboarding/OnionGatewayPrompt';
import { SandboxCollapseScreen } from '../victory/SandboxCollapseScreen';
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
  AudioWaveform,
  FileText,
  GitBranch,
  Coins,
} from 'lucide-react';

const ALL_DESKTOP_SHORTCUTS: Array<{
  id: AppId;
  name: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}> = [
  {
    id: 'hivenet',
    name: 'HiveNet',
    sub: '洋葱暗网浏览器',
    icon: Globe,
    color: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'cybergit',
    name: 'CyberGit',
    sub: '代码审计溯源器',
    icon: GitBranch,
    color: 'from-cyan-600 to-blue-800',
  },
  {
    id: 'chainexplorer',
    name: 'ChainExplorer',
    sub: '区块链合约账本',
    icon: Coins,
    color: 'from-amber-600 to-yellow-800',
  },
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
    sub: '档案/医疗检索',
    icon: Globe,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'cyberterminal',
    name: 'CyberTerminal',
    sub: '暗网取证极简终端',
    icon: Terminal,
    color: 'from-emerald-700 to-green-900',
  },
  {
    id: 'deduction',
    name: 'DeductionBoard',
    sub: '定罪/反制看板',
    icon: FileCheck2,
    color: 'from-red-600 to-amber-700',
  },
  {
    id: 'notepad',
    name: 'Notepad',
    sub: '审计员私人便签',
    icon: FileText,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'cyberplayer',
    name: 'CyberPlayer',
    sub: '声纹录音播放器',
    icon: AudioWaveform,
    color: 'from-teal-600 to-emerald-800',
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
  const currentChapter = useGameStore((s) => s.currentChapter);
  const narrativeStage = useGameStore((s) => s.narrativeStage);
  const openWindow = useGameStore((s) => s.openWindow);
  const toast = useGameStore((s) => s.toast);
  const clearToast = useGameStore((s) => s.clearToast);

  const [showTutorialHint, setShowTutorialHint] = useState(true);

  const handleIconDoubleClick = (appId: AppId) => {
    if (narrativeStage === 'BAD_ENDING') {
      soundService.playBuzzer();
      return;
    }
    soundService.playKeyClick(1.2);
    openWindow(appId);
  };

  const isBadEnding = narrativeStage === 'BAD_ENDING';

  // Filter and carefully order desktop shortcuts per chapter
  const visibleShortcuts = React.useMemo(() => {
    let orderedIds: AppId[] = [];
    if (currentChapter === 3) {
      orderedIds = ['hivenet', 'cybergit', 'chainexplorer', 'cyberterminal', 'deduction', 'notepad', 'systeminfo', 'trash'];
    } else if (currentChapter === 2) {
      orderedIds = ['mailbox', 'netquery', 'cyberterminal', 'deduction', 'cyberplayer', 'notepad', 'systeminfo', 'trash'];
    } else {
      // Chapter 1: deduction is in prominent position
      orderedIds = ['mailbox', 'netquery', 'cyberterminal', 'deduction', 'notepad', 'systeminfo', 'trash'];
    }
    return orderedIds
      .map((id) => ALL_DESKTOP_SHORTCUTS.find((sc) => sc.id === id))
      .filter((sc): sc is (typeof ALL_DESKTOP_SHORTCUTS)[number] => Boolean(sc));
  }, [currentChapter]);

  return (
    <div className="flex-1 relative w-full h-[calc(100vh-76px)] overflow-hidden select-none bg-cyber-950">
      {/* Interactive Desktop Workstation Surface */}
      <main className={`absolute inset-0 w-full h-full ${isBadEnding ? 'grayscale brightness-40 pointer-events-none' : ''}`}>
        {/* Industrial Grid Wallpaper & Circuit Pattern */}
        <div
          className={`absolute inset-0 [background-size:24px_24px] opacity-40 pointer-events-none ${
            currentChapter === 3
              ? 'bg-[radial-gradient(#064e3b_1px,transparent_1px)]'
              : 'bg-[radial-gradient(#1e3052_1px,transparent_1px)]'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-950/40 via-transparent to-cyber-950/80 pointer-events-none" />

        {/* CyberOS Watermark Emblem */}
        <div
          className={`absolute right-12 bottom-12 pointer-events-none opacity-10 flex flex-col items-end ${
            currentChapter === 3 ? 'text-emerald-400' : 'text-cyan-400'
          }`}
        >
          <div className="text-6xl font-black font-mono tracking-tighter">
            {currentChapter === 3 ? 'CyberOS 3.0' : currentChapter === 2 ? 'CyberOS 1.1' : 'CyberOS 1.0'}
          </div>
          <div className="text-sm font-mono tracking-widest mt-1">
            {currentChapter === 3
              ? 'ONION MESH PROTOCOL · HIVE-9 NODE'
              : currentChapter === 2
              ? 'COVERT AUDIT SUITE · PRIVILEGE OVERRIDE'
              : 'FORENSIC SUITE · FA-9021'}
          </div>
        </div>

        {/* Toast Notification (e.g. Word Pickup) */}
        {toast && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-emerald-400 text-emerald-100 px-4 py-2 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-fade-in font-sans text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="font-bold font-mono">{toast.text}</span>
            <button
              onClick={clearToast}
              className="ml-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Desktop Icon Layout - Standard 4-row 2-column balanced compact layout */}
        <div className="p-4 grid grid-rows-4 grid-flow-col gap-y-2.5 gap-x-6 w-max select-none z-10 relative">
          {visibleShortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.id}
                type="button"
                onDoubleClick={() => handleIconDoubleClick(sc.id)}
                onClick={() => soundService.playKeyClick(1.05)}
                className="w-22 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-slate-800/60 border border-transparent hover:border-emerald-600/60 focus:bg-slate-800/80 focus:border-emerald-500/80 transition-all group text-left cursor-pointer"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${sc.color} p-2 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 group-hover:shadow-emerald-500/20 transition-all`}
                >
                  <Icon className="w-full h-full text-white" />
                </div>
                <div className="text-center">
                  <div className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-300 leading-tight">
                    {sc.name}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {sc.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Windows Layer */}
        {currentChapter === 3 && (
          <>
            <WindowFrame appId="hivenet">
              <HiveNetApp />
            </WindowFrame>

            <WindowFrame appId="cybergit">
              <CyberGitApp />
            </WindowFrame>

            <WindowFrame appId="chainexplorer">
              <ChainExplorerApp />
            </WindowFrame>
          </>
        )}

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

        <WindowFrame appId="notepad">
          <NotepadApp />
        </WindowFrame>

        {currentChapter === 2 && (
          <WindowFrame appId="cyberplayer">
            <CyberPlayerApp />
          </WindowFrame>
        )}

        <WindowFrame appId="trash">
          <TrashApp />
        </WindowFrame>

        <WindowFrame appId="systeminfo">
          <SystemInfoApp />
        </WindowFrame>
      </main>

      {/* Top Modal Overlays Layer (Always Clickable) */}
      <VictoryModal />
      <ClosurePromptModal />
      <BadEndingScreen />
      <BadEndingScreen02 />
      <MeltdownEscapeModal />
      <OnionGatewayPrompt />
      <SandboxCollapseScreen />
    </div>
  );
};
