import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { WordPickupTag } from '../common/WordPickupTag';
import {
  GitBranch,
  GitCommit as GitCommitIcon,
  GitPullRequest,
  Search,
  Calendar,
  User,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Code2,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const CyberGitApp: React.FC = () => {
  const gitCommits = useGameStore((s) => s.gitCommits);
  const selectedCommitHash = useGameStore((s) => s.selectedCommitHash);
  const selectCommit = useGameStore((s) => s.selectCommit);
  const addWord = useGameStore((s) => s.addWord);

  const [authorFilter, setAuthorFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'diff' | 'blame' | 'files'>('diff');

  const filteredCommits = gitCommits.filter((c) =>
    authorFilter ? c.author.toLowerCase().includes(authorFilter.toLowerCase()) || c.message.toLowerCase().includes(authorFilter.toLowerCase()) : true
  );

  const currentCommit = gitCommits.find((c) => c.hash === selectedCommitHash) || gitCommits[0];

  const handleCommitClick = (hash: string) => {
    soundService.playKeyClick();
    selectCommit(hash);
  };

  const handleBlameClick = (authorStr: string) => {
    soundService.playKeyClick(1.2);
    if (authorStr.includes('FA-9021')) {
      addWord('FA-9021', 'character');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden border border-emerald-900/60 rounded-b-lg">
      {/* Top Header & Repository Info */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-600 flex items-center justify-center text-emerald-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white">/repos/omnimind-core.git</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                BRANCH: main (v4.2-CognitiveLock)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              审查算法底层代码仓库 · 创世提交与神经权重合并历史
            </div>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            placeholder="按作者 / 提交哈希 / 模块检索..."
            className="w-full bg-black/80 border border-slate-700 focus:border-emerald-500 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 outline-none font-mono placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Main Split Layout: Left Commit Graph / Right Detail & Diff */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-950">
        {/* Left Column: Commit Graph Timeline (5 Cols) */}
        <div className="md:col-span-5 border-r border-slate-800 p-3 overflow-y-auto space-y-3 bg-slate-900/40">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>提交历史时间轴 (Commit Graph)</span>
            <span className="text-emerald-400">{filteredCommits.length} COMMITS</span>
          </div>

          <div className="space-y-3 relative pl-4 border-l-2 border-emerald-900/80 ml-2">
            {filteredCommits.map((commit, idx) => {
              const isSelected = commit.hash === currentCommit.hash;
              const isGenesis = commit.hash === 'c001fa9021';
              return (
                <div
                  key={commit.hash}
                  onClick={() => handleCommitClick(commit.hash)}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Graph Node Dot */}
                  <div
                    className={`absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-400 border-white shadow-emerald-500/50 shadow-md'
                        : isGenesis
                        ? 'bg-amber-400 border-amber-200'
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  />

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <GitCommitIcon className="w-3.5 h-3.5" />
                      <span>{commit.hash}</span>
                    </span>
                    <span className="text-slate-500">{commit.date.split(' ')[0]}</span>
                  </div>

                  <div className="text-xs font-bold text-slate-100 line-clamp-2">
                    {commit.message}
                  </div>

                  <div className="text-[11px] font-mono flex items-center justify-between pt-1 border-t border-slate-800/80 text-slate-400">
                    <span className="text-amber-300 font-bold truncate max-w-[180px]">
                      {commit.author}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Commit Inspector & Diff View (7 Cols) */}
        <div className="md:col-span-7 flex flex-col h-full overflow-hidden bg-slate-950">
          {/* Commit Meta Card */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>COMMIT: {currentCommit.hash}</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">
                  {currentCommit.message}
                </h3>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1 justify-end">
                  <Calendar className="w-3 h-3" />
                  <span>{currentCommit.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono bg-black/60 p-2 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Author:</span>
                <button
                  onClick={() => handleBlameClick(currentCommit.author)}
                  className="font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                  title="点击提取作者工号词条"
                >
                  {currentCommit.author}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">变更文件:</span>
                <span className="text-slate-300">{currentCommit.filesChanged.join(', ')}</span>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'diff'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Diff 差异对比
              </button>
              <button
                onClick={() => setActiveTab('blame')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'blame'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Git Blame 溯源
              </button>
            </div>
          </div>

          {/* Diff / Blame Code Viewer */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs bg-slate-950">
            {activeTab === 'diff' && (
              <div className="bg-black/90 p-4 rounded-xl border border-slate-800 space-y-1 overflow-x-auto leading-relaxed shadow-inner">
                {currentCommit.diff.split('\n').map((line, i) => {
                  const isAdd = line.startsWith('+');
                  const isDel = line.startsWith('-');
                  const isHeader = line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++');
                  return (
                    <div
                      key={i}
                      className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                        isAdd
                          ? 'bg-emerald-950/70 text-emerald-300 border-l-2 border-emerald-500'
                          : isDel
                          ? 'bg-red-950/70 text-red-300 border-l-2 border-red-500'
                          : isHeader
                          ? 'text-cyan-400 font-bold bg-slate-900/50'
                          : 'text-slate-400'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'blame' && (
              <div className="bg-black/90 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs shadow-inner">
                <div className="text-xs font-bold text-emerald-400 pb-2 border-b border-slate-800">
                  === Git Blame 责任人行级溯源 (/kernel/empathy_filter.c) ===
                </div>
                <div className="space-y-1 text-[11px]">
                  <div
                    onClick={() => handleBlameClick('FA-9021')}
                    className="p-1.5 rounded hover:bg-emerald-950/50 cursor-pointer flex items-center justify-between border border-transparent hover:border-emerald-800"
                  >
                    <span className="text-slate-400">Line 01: /* OmniMind Kernel - Ethical Scoring Prototype */</span>
                    <span className="text-amber-300 font-bold">FA-9021 (2011-04-12) [CLICK TO PICKUP]</span>
                  </div>
                  <div
                    onClick={() => handleBlameClick('FA-9021')}
                    className="p-1.5 rounded hover:bg-emerald-950/50 cursor-pointer flex items-center justify-between border border-transparent hover:border-emerald-800"
                  >
                    <span className="text-slate-400">Line 05: int calculate_empathy_deviation(Subject *sub);</span>
                    <span className="text-amber-300 font-bold">FA-9021 (2011-04-12)</span>
                  </div>
                  <div className="p-1.5 rounded flex items-center justify-between text-slate-500">
                    <span>Line 09: // Ingesting 7th_patient_eeg_raw.dat from St. Luke</span>
                    <span className="text-cyan-400">Aegis_DevOps (2016-09-20)</span>
                  </div>
                  <div className="p-1.5 rounded flex items-center justify-between text-slate-500">
                    <span>Line 15: exec /bin/purge_node --target hive9_all_members</span>
                    <span className="text-red-400">OmniMind_Autonomy (2020-08-14)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
