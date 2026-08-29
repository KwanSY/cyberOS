import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { AppId } from '../../types/game';
import {
  Monitor,
  Mail,
  Globe,
  Terminal,
  FileCheck2,
  Trash2,
  Info,
  Shield,
  GitBranch,
  Coins,
  AudioWaveform,
  FileText,
} from 'lucide-react';

const APPS_LIST: Array<{ id: AppId; name: string; icon: React.ElementType; desc: string }> = [
  { id: 'mailbox', name: 'MailBox (邮件系统)', icon: Mail, desc: '检视涉案人往来邮件与本地草稿' },
  { id: 'hivenet', name: 'HiveNet (洋葱暗网浏览器)', icon: Globe, desc: '3-Hop 洋葱路由访问蜂巢极客论坛' },
  { id: 'cybergit', name: 'CyberGit (代码审计器)', icon: GitBranch, desc: 'OmniMind 仓库提交树与 Blame 溯源' },
  { id: 'chainexplorer', name: 'ChainExplorer (链上账本)', icon: Coins, desc: '以太坊智能合约与 50,000 ETH 悬赏穿透' },
  { id: 'netquery', name: 'NetQuery (档案浏览器)', icon: Globe, desc: '检索内网通报与互联网归档' },
  { id: 'cyberterminal', name: 'CyberTerminal (终端)', icon: Terminal, desc: '命令行取证、日志比对与解密' },
  { id: 'deduction', name: 'DeductionBoard (定罪看板)', icon: FileCheck2, desc: '完形填空公文定罪终审系统' },
  { id: 'cyberplayer', name: 'CyberPlayer (声纹播放器)', icon: AudioWaveform, desc: '现场偷录录音与声纹频谱分析' },
  { id: 'notepad', name: 'Notepad (记事便签)', icon: FileText, desc: '审计员私人调查便签' },
  { id: 'trash', name: 'Trash (回收站)', icon: Trash2, desc: '查看被删除的数据碎片' },
  { id: 'systeminfo', name: 'SystemInfo (系统信息)', icon: Info, desc: '取证工作站配置与案卷信息' },
];

export const Taskbar: React.FC = () => {
  const currentChapter = useGameStore((s) => s.currentChapter);
  const osVersion = useGameStore((s) => s.osVersion);
  const windows = useGameStore((s) => s.windows);
  const maxZIndex = useGameStore((s) => s.maxZIndex);
  const openWindow = useGameStore((s) => s.openWindow);
  const focusWindow = useGameStore((s) => s.focusWindow);
  const minimizeWindow = useGameStore((s) => s.minimizeWindow);
  const systemTime = useGameStore((s) => s.systemTime);

  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const availableApps = APPS_LIST.filter((app) => {
    if (currentChapter === 3) {
      return ['hivenet', 'cybergit', 'chainexplorer', 'cyberterminal', 'deduction', 'notepad', 'trash', 'systeminfo'].includes(app.id);
    }
    if (currentChapter === 2) {
      return ['mailbox', 'netquery', 'cyberterminal', 'deduction', 'notepad', 'cyberplayer', 'trash', 'systeminfo'].includes(app.id);
    }
    // Chapter 1
    return ['mailbox', 'netquery', 'cyberterminal', 'deduction', 'notepad', 'trash', 'systeminfo'].includes(app.id);
  });

  const handleStartToggle = () => {
    soundService.playKeyClick(1.2);
    setStartMenuOpen(!startMenuOpen);
  };

  const handleAppLaunch = (appId: AppId) => {
    soundService.playKeyClick();
    openWindow(appId);
    setStartMenuOpen(false);
  };

  const handleWindowTabClick = (appId: AppId) => {
    const win = windows[appId];
    if (win.isMinimized) {
      soundService.playKeyClick();
      focusWindow(appId);
    } else if (win.zIndex === maxZIndex) {
      soundService.playKeyClick(0.9);
      minimizeWindow(appId);
    } else {
      soundService.playKeyClick(1.1);
      focusWindow(appId);
    }
  };

  return (
    <>
      {/* Start Menu Dropdown */}
      {startMenuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-11 left-2 w-72 bg-cyber-900/95 border-2 border-cyber-500/70 rounded-lg shadow-2xl z-50 p-2 space-y-1.5 backdrop-blur-md animate-fade-in font-sans"
        >
          <div className="bg-gradient-to-r from-blue-900 to-cyan-900 p-3 rounded text-white flex items-center gap-2.5 border border-cyan-500/40">
            <Shield className="w-6 h-6 text-cyan-300" />
            <div>
              <div className="font-bold text-sm">{osVersion}</div>
              <div className="text-[11px] text-cyan-200 font-mono">
                {currentChapter === 3 ? '洋葱暗网节点 · HIVE-9' : currentChapter === 2 ? '越权追查镜像 · FA-9021' : '法医取证终端 · FA-9021'}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-400 px-2 pt-1 font-mono">
            {currentChapter === 3 ? 'HIVE-9 MESH APPLICATIONS' : 'FORENSIC APPLICATIONS'}
          </div>

          <div className="space-y-1">
            {availableApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppLaunch(app.id)}
                  className="w-full p-2 rounded flex items-center gap-3 hover:bg-cyber-700/70 text-left transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded bg-cyber-950 flex items-center justify-center border border-cyber-600 group-hover:border-cyan-400">
                    <Icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                      {app.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{app.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Taskbar Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-cyber-950/95 border-t border-cyber-700/80 px-2 flex items-center justify-between z-40 backdrop-blur-md select-none">
        {/* Left: Start Button + App Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto flex-1 mr-2">
          {/* Start Button */}
          <button
            onClick={handleStartToggle}
            className={`h-7 px-3 rounded flex items-center gap-2 text-xs font-bold font-mono transition-all ${
              startMenuOpen
                ? 'bg-cyan-600 text-white shadow-cyan-500/50 shadow'
                : 'bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600 text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>CyberOS</span>
          </button>

          <div className="h-5 w-px bg-cyber-700 mx-1 shrink-0" />

          {/* Running Windows Tabs */}
          {Object.values(windows)
            .filter((w) => w.isOpen)
            .map((win) => {
              const appInfo = APPS_LIST.find((a) => a.id === win.id);
              const Icon = appInfo?.icon || Info;
              const isActive = win.zIndex === maxZIndex && !win.isMinimized;

              return (
                <button
                  key={win.id}
                  onClick={() => handleWindowTabClick(win.id)}
                  title={win.title}
                  className={`h-7 px-2.5 rounded flex items-center gap-2 text-xs font-mono transition-all max-w-[170px] truncate border shrink-0 ${
                    isActive
                      ? 'bg-cyber-700 text-cyan-200 border-cyan-400 shadow-sm'
                      : win.isMinimized
                      ? 'bg-cyber-950 text-slate-500 border-cyber-800 hover:text-slate-300'
                      : 'bg-cyber-900 text-slate-300 border-cyber-700 hover:bg-cyber-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="truncate text-[11px]">{win.title.split(' ')[0]}</span>
                </button>
              );
            })}
        </div>

        {/* Right: Quick system time & tray */}
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400 shrink-0">
          <div className="bg-cyber-900 border border-cyber-700 px-2 py-0.5 rounded text-[11px] text-cyan-300">
            {systemTime.split(' ')[1]}
          </div>
        </div>
      </div>
    </>
  );
};
