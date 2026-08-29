import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  Terminal as TerminalIcon,
  Play,
  Network,
  Image as ImageIcon,
  ExternalLink,
  ClipboardPaste,
  Copy,
  Check,
} from 'lucide-react';

const CH1_QUICK_COMMANDS = [
  { label: 'ls', cmd: 'ls', autoRun: true },
  { label: 'cat [文件]', cmd: 'cat ', autoRun: false },
  { label: 'decrypt [文件] -k [密码]', cmd: 'decrypt ', autoRun: false },
  { label: 'diff [文件1] [文件2]', cmd: 'diff ', autoRun: false },
  { label: 'clear', cmd: 'clear', autoRun: true },
  { label: 'help', cmd: 'help', autoRun: true },
];

const CH2_QUICK_COMMANDS = [
  { label: 'ls', cmd: 'ls', autoRun: true },
  { label: 'cat [文件]', cmd: 'cat ', autoRun: false },
  { label: 'decrypt [文件] -k [密码]', cmd: 'decrypt ', autoRun: false },
  { label: 'diff [文件1] [文件2]', cmd: 'diff ', autoRun: false },
  { label: 'trace [IP/域名]', cmd: 'trace ', autoRun: false },
  { label: 'clear', cmd: 'clear', autoRun: true },
  { label: 'help', cmd: 'help', autoRun: true },
];

const CH3_QUICK_COMMANDS = [
  { label: 'ls', cmd: 'ls', autoRun: true },
  { label: 'cat [文件]', cmd: 'cat ', autoRun: false },
  { label: 'git log', cmd: 'git log', autoRun: true },
  { label: 'git diff', cmd: 'git diff', autoRun: true },
  { label: 'contract query [合约地址]', cmd: 'contract query ', autoRun: false },
  { label: 'whoami --network', cmd: 'whoami --network', autoRun: true },
  { label: 'mesh broadcast [载荷文件]', cmd: 'mesh broadcast ', autoRun: false },
  { label: 'clear', cmd: 'clear', autoRun: true },
  { label: 'help', cmd: 'help', autoRun: true },
];

export const TerminalApp: React.FC = () => {
  const currentChapter = useGameStore((s) => s.currentChapter);
  const terminalLines = useGameStore((s) => s.terminalLines);
  const terminalCwd = useGameStore((s) => s.terminalCwd);
  const executeTerminalCommand = useGameStore((s) => s.executeTerminalCommand);
  const clearTerminal = useGameStore((s) => s.clearTerminal);
  const commandHistory = useGameStore((s) => s.commandHistory);

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [colorMode, setColorMode] = useState<'green' | 'amber'>('green');
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [copiedLineId, setCopiedLineId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickCommands =
    currentChapter === 3
      ? CH3_QUICK_COMMANDS
      : currentChapter === 2
      ? CH2_QUICK_COMMANDS
      : CH1_QUICK_COMMANDS;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputVal.trim()) {
        executeTerminalCommand(inputVal);
        setInputVal('');
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
        soundService.playKeyClick(0.9);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
        soundService.playKeyClick(0.9);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
    } else {
      soundService.playKeyClick(1.0);
    }
  };

  const handleTabComplete = () => {
    const trimmed = inputVal.trim();
    const commonCompletions = [
      'help',
      'ls',
      'cat ',
      'decrypt ',
      'diff ',
      'trace ',
      'clear',
    ];

    const match = commonCompletions.find((c) => c.startsWith(trimmed));
    if (match) {
      setInputVal(match);
      soundService.playBeep(1100, 0.04);
    }
  };

  const handleQuickRun = (cmd: string, autoRun: boolean) => {
    if (autoRun) {
      setInputVal(cmd);
      executeTerminalCommand(cmd);
    } else {
      setInputVal(cmd);
    }
    inputRef.current?.focus();
  };

  const handlePasteClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputVal((prev) => prev + text.trim());
        soundService.playKeyClick(1.1);
        inputRef.current?.focus();
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  // Safe container click that preserves user text selection!
  const handleTerminalContainerClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      // User is actively highlighting/selecting text, do NOT clear selection or steal focus
      return;
    }
    // Only focus if clicked directly on empty background
    if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
      inputRef.current?.focus();
    }
  };

  const handleCopyLineText = (lineId: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    soundService.playKeyClick(1.2);
    setCopiedLineId(lineId);
    setTimeout(() => setCopiedLineId(null), 1500);
  };

  const handleDoubleClickAppend = (text: string) => {
    // If double clicked a token, append it to input line
    const clean = text.trim();
    if (clean) {
      setInputVal((prev) => (prev ? `${prev} ${clean}` : clean));
      soundService.playKeyClick(1.1);
      inputRef.current?.focus();
    }
  };

  const textColorClass =
    colorMode === 'green'
      ? 'text-terminal-green crt-glow'
      : 'text-terminal-amber crt-amber-glow';

  return (
    <div
      onClick={handleTerminalContainerClick}
      className="flex-1 flex flex-col font-mono text-xs bg-terminal-bg text-terminal-green overflow-hidden h-full select-text"
      style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
    >
      {/* Top Toolbar */}
      <div className="bg-slate-950 border-b border-cyber-800 px-3 py-1.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2 text-slate-400">
          <TerminalIcon className="w-3.5 h-3.5 text-terminal-green" />
          <span className="text-slate-300 font-bold">bash (fa-9021@cyberos)</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
            {currentChapter === 2 ? 'CYBEROS 1.1 / PRIVILEGE OVERRIDE' : 'UTF-8 / PTY'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Paste button */}
          <button
            onClick={handlePasteClipboard}
            title="将剪贴板内容粘贴至光标处 (也可直接按 Ctrl+V)"
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ClipboardPaste className="w-3 h-3" />
            <span>粘贴 [Ctrl+V]</span>
          </button>

          {/* Color Mode Switch */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setColorMode(colorMode === 'green' ? 'amber' : 'green');
              soundService.playKeyClick();
            }}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-white cursor-pointer"
          >
            {colorMode === 'green' ? '荧光绿屏' : '复古琥珀屏'}
          </button>

          {/* Clear */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearTerminal();
            }}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 hover:text-red-400 cursor-pointer"
          >
            清屏
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className={`flex-1 p-4 overflow-y-auto space-y-2.5 cursor-text ${textColorClass}`}
        style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
      >
        {terminalLines.map((line) => (
          <div
            key={line.id}
            onDoubleClick={() => handleDoubleClickAppend(line.text)}
            className="leading-relaxed whitespace-pre-wrap break-all relative group"
            style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
          >
            {/* Hover copy button on the right side of each line */}
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 select-none pointer-events-auto">
              <button
                onClick={(e) => handleCopyLineText(line.id, line.text, e)}
                title="复制整行内容"
                className="p-1 rounded bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-cyan-300 text-[10px] flex items-center gap-1 shadow"
              >
                {copiedLineId === line.id ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-emerald-400">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>

            {line.type === 'input' && (
              <div className="text-cyan-400 font-bold flex items-center gap-1.5" style={{ userSelect: 'text' }}>
                <span>{line.text}</span>
              </div>
            )}

            {line.type === 'system' && (
              <div className="text-slate-400 italic text-[11px] border-l-2 border-slate-600 pl-2" style={{ userSelect: 'text' }}>
                # {line.text}
              </div>
            )}

            {line.type === 'output' && (
              <div className="opacity-95" style={{ userSelect: 'text' }}>{line.text}</div>
            )}

            {line.type === 'error' && (
              <div className="text-red-400 bg-red-950/30 p-2 rounded border border-red-900/60 font-semibold" style={{ userSelect: 'text' }}>
                {line.text}
              </div>
            )}

            {line.type === 'warning' && (
              <div className="text-amber-300 bg-red-950/50 p-3 rounded-lg border-2 border-red-600 font-bold space-y-1 animate-pulse" style={{ userSelect: 'text' }}>
                <div className="text-red-400 text-[10px] uppercase font-mono">⚠️ SYSTEM THREAT & INTRUSION ALERT</div>
                <div className="whitespace-pre-wrap">{line.text}</div>
              </div>
            )}

            {line.type === 'success' && (
              <div className="text-emerald-300 bg-emerald-950/40 p-3 rounded border border-emerald-700/60 font-semibold space-y-1" style={{ userSelect: 'text' }}>
                <div>{line.text}</div>
              </div>
            )}

            {/* Traceroute Output Display */}
            {line.type === 'trace' && line.traceHops && (
              <div className="bg-black/90 border border-cyan-700/80 rounded-lg p-3 my-2 space-y-2 font-mono text-xs shadow-lg" style={{ userSelect: 'text' }}>
                <div className="text-cyan-300 font-bold border-b border-cyber-800 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Network className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>{line.text}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 select-none">
                    HOP COUNT: 3
                  </span>
                </div>

                <div className="space-y-1.5">
                  {line.traceHops.map((hop) => (
                    <div
                      key={hop.hop}
                      className={`p-2 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs border ${
                        hop.isTarget
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                      style={{ userSelect: 'text' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">[{hop.hop}]</span>
                        <span className="font-mono text-white">{hop.ip}</span>
                        <span className="text-[11px] text-slate-400">({hop.rtt})</span>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className={hop.isTarget ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                          {hop.location} · {hop.org}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Visual Button to Examine Offshore Chart */}
                <div className="pt-2 flex justify-end select-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomImage('./assets/offshore_fund_trace_map.jpg');
                    }}
                    className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 rounded text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>检视 Aegis Horizon 离岸资金路由拓扑图 (物证)</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </button>
                </div>
              </div>
            )}

            {line.type === 'diff' && line.diffLines && (
              <div className="bg-black/80 border border-cyber-700 rounded-lg p-3 my-2 space-y-1 font-mono text-xs" style={{ userSelect: 'text' }}>
                <div className="text-cyan-300 font-bold mb-2 pb-1 border-b border-cyber-800">
                  {line.text}
                </div>
                {line.diffLines.map((dl, idx) => (
                  <div
                    key={idx}
                    className={`px-1.5 py-0.5 rounded ${
                      dl.type === 'added'
                        ? 'bg-emerald-950/80 text-emerald-300 border-l-4 border-emerald-500 font-bold'
                        : dl.type === 'removed'
                        ? 'bg-red-950/70 text-red-300 border-l-4 border-red-500 line-through opacity-80'
                        : 'text-slate-400'
                    }`}
                    style={{ userSelect: 'text' }}
                  >
                    {dl.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-cyan-400 font-bold shrink-0">{terminalCwd} $</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white caret-terminal-green"
          />
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Quick GUI Command Helper Bar */}
      <div className="bg-cyber-950 border-t border-cyber-800/90 p-2 flex items-center gap-1.5 overflow-x-auto select-none shrink-0">
        <span className="text-[10px] text-slate-500 font-mono shrink-0">命令模板:</span>
        {quickCommands.map((qc, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              handleQuickRun(qc.cmd, qc.autoRun);
            }}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-[11px] font-mono shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-2.5 h-2.5 text-cyan-400" />
            <span>{qc.label}</span>
          </button>
        ))}
      </div>

      {/* Offshore Map Zoom Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6 cursor-pointer animate-fade-in backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cyber-900 p-3 rounded-lg border-2 border-cyan-400 shadow-2xl max-w-3xl max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center pb-2 text-xs font-mono text-cyan-300">
              <span>【离岸资金洗钱拓扑图 · 司法穿透检视】</span>
              <button
                onClick={() => setZoomImage(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-cyber-800"
              >
                关闭 [ESC]
              </button>
            </div>
            <img
              src={zoomImage}
              alt="Offshore Trace Evidence"
              className="max-h-[72vh] w-auto object-contain rounded border border-cyber-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
