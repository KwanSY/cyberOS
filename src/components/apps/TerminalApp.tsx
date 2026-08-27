import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  Terminal as TerminalIcon,
  Play,
} from 'lucide-react';

const QUICK_COMMANDS = [
  { label: 'ls', cmd: 'ls' },
  { label: 'cat [文件]', cmd: 'cat ' },
  { label: 'diff [文件1] [文件2]', cmd: 'diff ' },
  { label: 'decrypt [文件] -k [密码]', cmd: 'decrypt ' },
  { label: 'clear', cmd: 'clear' },
  { label: 'help', cmd: 'help' },
];

export const TerminalApp: React.FC = () => {
  const terminalLines = useGameStore((s) => s.terminalLines);
  const terminalCwd = useGameStore((s) => s.terminalCwd);
  const executeTerminalCommand = useGameStore((s) => s.executeTerminalCommand);
  const clearTerminal = useGameStore((s) => s.clearTerminal);
  const commandHistory = useGameStore((s) => s.commandHistory);

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [colorMode, setColorMode] = useState<'green' | 'amber'>('green');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      'ls /logs',
      'cat readme.txt',
      'cat diary.enc',
      'cat diary.txt',
      'decrypt diary.enc -k ',
      'diff ',
      'clear',
    ];

    const match = commonCompletions.find((c) => c.startsWith(trimmed));
    if (match) {
      setInputVal(match);
      soundService.playBeep(1100, 0.04);
    }
  };

  const handleQuickRun = (cmd: string) => {
    setInputVal(cmd);
    executeTerminalCommand(cmd);
    inputRef.current?.focus();
  };

  const textColorClass =
    colorMode === 'green'
      ? 'text-terminal-green crt-glow'
      : 'text-terminal-amber crt-amber-glow';

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex-1 flex flex-col font-mono text-xs bg-terminal-bg text-terminal-green overflow-hidden select-text"
    >
      {/* Top Toolbar */}
      <div className="bg-slate-950 border-b border-cyber-800 px-3 py-1.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2 text-slate-400">
          <TerminalIcon className="w-3.5 h-3.5 text-terminal-green" />
          <span className="text-slate-300 font-bold">bash (fa-9021@cyberos)</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
            UTF-8 / PTY
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Color Mode Switch */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setColorMode(colorMode === 'green' ? 'amber' : 'green');
              soundService.playKeyClick();
            }}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-white"
          >
            {colorMode === 'green' ? '荧光绿屏' : '复古琥珀屏'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearTerminal();
            }}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 hover:text-red-400"
          >
            清屏
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className={`flex-1 p-4 overflow-y-auto space-y-2.5 ${textColorClass}`}>
        {terminalLines.map((line) => (
          <div key={line.id} className="leading-relaxed whitespace-pre-wrap break-all">
            {line.type === 'input' && (
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <span>{line.text}</span>
              </div>
            )}

            {line.type === 'system' && (
              <div className="text-slate-400 italic text-[11px] border-l-2 border-slate-600 pl-2">
                # {line.text}
              </div>
            )}

            {line.type === 'output' && (
              <div className="opacity-95">{line.text}</div>
            )}

            {line.type === 'error' && (
              <div className="text-red-400 bg-red-950/30 p-2 rounded border border-red-900/60 font-semibold">
                {line.text}
              </div>
            )}

            {line.type === 'success' && (
              <div className="text-emerald-300 bg-emerald-950/40 p-3 rounded border border-emerald-700/60 font-semibold space-y-1">
                <div>{line.text}</div>
              </div>
            )}

            {line.type === 'diff' && line.diffLines && (
              <div className="bg-black/80 border border-cyber-700 rounded-lg p-3 my-2 space-y-1 font-mono text-xs">
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
        <span className="text-[10px] text-slate-500 font-mono shrink-0">快捷指令:</span>
        {QUICK_COMMANDS.map((qc, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              handleQuickRun(qc.cmd);
            }}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-[11px] font-mono shrink-0 transition-colors flex items-center gap-1"
          >
            <Play className="w-2.5 h-2.5 text-cyan-400" />
            <span>{qc.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
