import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { WordCategory, DeductionSlots, Chapter2DeductionSlots, Chapter3DeductionSlots } from '../../types/game';
import {
  Stamp,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Search,
  Layers,
  X,
  ShieldCheck,
  FileCheck2,
  ChevronRight,
  MousePointerClick,
} from 'lucide-react';

const CATEGORIES: Array<{ key: WordCategory | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'character', label: '人物/实体' },
  { key: 'timestamp', label: '时间/编号' },
  { key: 'location_evidence', label: '地点/物证' },
  { key: 'action_motive', label: '手段与动机' },
];

export const DeductionApp: React.FC = () => {
  const currentChapter = useGameStore((s) => s.currentChapter);
  const collectedWords = useGameStore((s) => s.collectedWords);

  // Chapter 1 State
  const deductionSlots = useGameStore((s) => s.deductionSlots);
  const setDeductionSlot = useGameStore((s) => s.setDeductionSlot);
  const submitDeduction = useGameStore((s) => s.submitDeduction);

  // Chapter 2 State
  const chapter2Slots = useGameStore((s) => s.chapter2Slots);
  const setChapter2Slot = useGameStore((s) => s.setChapter2Slot);
  const submitChapter2Deduction = useGameStore((s) => s.submitChapter2Deduction);

  // Chapter 3 State
  const chapter3Slots = useGameStore((s) => s.chapter3Slots);
  const setChapter3Slot = useGameStore((s) => s.setChapter3Slot);
  const submitChapter3Deduction = useGameStore((s) => s.submitChapter3Deduction);

  const submissionResult = useGameStore((s) => s.submissionResult);
  const resetDeductionResult = useGameStore((s) => s.resetDeductionResult);

  const [activeCategory, setActiveCategory] = useState<WordCategory | 'all'>('all');
  const [searchWordQuery, setSearchWordQuery] = useState('');
  const [activeFocusedSlot, setActiveFocusedSlot] = useState<string | null>(null);

  const filteredWords = collectedWords.filter((w) => {
    if (activeCategory !== 'all' && w.category !== activeCategory) return false;
    if (!searchWordQuery) return true;
    return (
      w.text.toLowerCase().includes(searchWordQuery.toLowerCase()) ||
      w.categoryLabel.toLowerCase().includes(searchWordQuery.toLowerCase())
    );
  });

  const handleDragStart = (e: React.DragEvent, text: string) => {
    e.dataTransfer.setData('text/plain', text);
  };

  const handleDrop = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
      soundService.playCardSnap();
      handleSetSlotValue(slotKey, text);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSetSlotValue = (slotKey: string, text: string | null) => {
    if (currentChapter === 3) {
      setChapter3Slot(slotKey as keyof Chapter3DeductionSlots, text);
    } else if (currentChapter === 2) {
      setChapter2Slot(slotKey as keyof Chapter2DeductionSlots, text);
    } else {
      setDeductionSlot(slotKey as keyof DeductionSlots, text);
    }
    // Auto advance focus
    if (text) {
      setActiveFocusedSlot(null);
    }
  };

  const handleWordClick = (text: string) => {
    soundService.playCardSnap();
    if (activeFocusedSlot) {
      handleSetSlotValue(activeFocusedSlot, text);
      return;
    }

    // If no slot focused, find first empty slot
    if (currentChapter === 1) {
      const keys: (keyof DeductionSlots)[] = ['slotA', 'slotB', 'slotC', 'slotD'];
      const empty = keys.find((k) => !deductionSlots[k]);
      if (empty) handleSetSlotValue(empty, text);
    } else if (currentChapter === 2) {
      const keys: (keyof Chapter2DeductionSlots)[] = [
        'card1_patient',
        'card1_real_cause',
        'card1_forger',
        'card2_method',
        'card2_beneficiary',
        'card2_motive',
      ];
      const empty = keys.find((k) => !chapter2Slots[k]);
      if (empty) handleSetSlotValue(empty, text);
    } else {
      const keys: (keyof Chapter3DeductionSlots)[] = [
        'card1_victim',
        'card1_culprit',
        'card1_source',
        'card2_author',
        'card2_funding',
        'card2_countermeasure',
      ];
      const empty = keys.find((k) => !chapter3Slots[k]);
      if (empty) handleSetSlotValue(empty, text);
    }
  };

  const handleClearAllSlots = () => {
    soundService.playKeyClick(0.9);
    if (currentChapter === 3) {
      setChapter3Slot('card1_victim', null);
      setChapter3Slot('card1_culprit', null);
      setChapter3Slot('card1_source', null);
      setChapter3Slot('card2_author', null);
      setChapter3Slot('card2_funding', null);
      setChapter3Slot('card2_countermeasure', null);
    } else if (currentChapter === 2) {
      setChapter2Slot('card1_patient', null);
      setChapter2Slot('card1_real_cause', null);
      setChapter2Slot('card1_forger', null);
      setChapter2Slot('card2_method', null);
      setChapter2Slot('card2_beneficiary', null);
      setChapter2Slot('card2_motive', null);
    } else {
      setDeductionSlot('slotA', null);
      setDeductionSlot('slotB', null);
      setDeductionSlot('slotC', null);
      setDeductionSlot('slotD', null);
    }
    setActiveFocusedSlot(null);
    resetDeductionResult();
  };

  const handleSubmit = () => {
    if (currentChapter === 3) {
      submitChapter3Deduction();
    } else if (currentChapter === 2) {
      submitChapter2Deduction();
    } else {
      submitDeduction();
    }
  };

  // Compact Inline Cloze Slot Component
  const renderInlineSlot = (slotKey: string, value: string | null, slotIndexText: string) => {
    const isFocused = activeFocusedSlot === slotKey;
    return (
      <span
        onDrop={(e) => handleDrop(e, slotKey)}
        onDragOver={handleDragOver}
        onClick={() => {
          soundService.playKeyClick(1.05);
          setActiveFocusedSlot(isFocused ? null : slotKey);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mx-1 my-0.5 rounded-lg border transition-all cursor-pointer select-none font-mono text-xs shadow-sm align-middle ${
          value
            ? currentChapter === 3
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500 font-bold shadow-emerald-500/10 ring-1 ring-emerald-500/40'
              : currentChapter === 2
              ? 'bg-amber-950/95 text-amber-200 border-amber-500 font-bold shadow-amber-500/10 ring-1 ring-amber-500/40'
              : 'bg-blue-950/95 text-cyan-200 border-cyan-500 font-bold shadow-cyan-500/10 ring-1 ring-cyan-500/40'
            : isFocused
            ? 'bg-amber-950/60 text-amber-300 border-2 border-amber-400 animate-pulse ring-2 ring-amber-400/30'
            : 'bg-black/70 text-slate-400 border-dashed border-slate-600 hover:border-cyan-400 hover:text-slate-200'
        }`}
        title="点击聚焦后点击左侧词条填入，或直接拖拽词条放入"
      >
        {value ? (
          <>
            <span className="underline decoration-1 underline-offset-2">{value}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundService.playKeyClick(0.9);
                handleSetSlotValue(slotKey, null);
              }}
              className="text-slate-400 hover:text-red-400 transition-colors p-0.5 rounded ml-0.5"
              title="清空该槽位"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <span className="italic text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            {isFocused ? (
              <span className="text-amber-300 font-bold">[ {slotIndexText} · 点击左侧词条 ↵ ]</span>
            ) : (
              <span>[ {slotIndexText} ]</span>
            )}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden font-sans text-xs bg-slate-950 text-slate-100 w-full h-full border border-cyber-700/80 rounded-b-lg">
      {/* Left Drawer: Word Bank (260px) */}
      <div className="w-64 min-w-[260px] max-w-[260px] bg-slate-900/95 border-r border-slate-800 flex flex-col select-none shrink-0 h-full">
        <div className="p-2.5 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>词块库 (Word Bank)</span>
            </div>
            <span className="bg-cyber-950 text-cyan-300 px-1.5 py-0.2 rounded text-[10px] font-mono border border-cyan-800">
              已收录: {collectedWords.length}
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="搜索词条..."
              value={searchWordQuery}
              onChange={(e) => setSearchWordQuery(e.target.value)}
              className="w-full bg-black/80 border border-slate-700 rounded-lg pl-7 pr-2 py-1 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  soundService.playKeyClick();
                  setActiveCategory(cat.key);
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono shrink-0 transition-colors cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'bg-black/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Word Chips List */}
        <div className="flex-1 p-2 overflow-y-auto space-y-1.5">
          {filteredWords.length === 0 ? (
            <div className="text-center text-slate-500 py-6 text-[11px] font-serif leading-relaxed px-2">
              暂未收录该类目词条，请在邮件、网页或终端中点击高亮词条提取。
            </div>
          ) : (
            filteredWords.map((word) => (
              <div
                key={word.id}
                draggable
                onDragStart={(e) => handleDragStart(e, word.text)}
                onClick={() => handleWordClick(word.text)}
                className={`p-2 bg-slate-950 hover:bg-slate-800 border rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-between group ${
                  activeFocusedSlot
                    ? 'border-amber-500/80 bg-amber-950/20 ring-1 ring-amber-500/30'
                    : 'border-slate-800 hover:border-cyan-500/80'
                }`}
                title="点击一键填入当前槽位，或拖拽放入"
              >
                <div className="space-y-0.5 min-w-0 pr-1">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 font-mono truncate">
                    {word.text}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    [{word.categoryLabel}]
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-400 shrink-0 flex items-center gap-0.5">
                  <MousePointerClick className="w-3 h-3 opacity-60" />
                  <span>填入</span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Canvas: Official Cloze Passage Document */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 flex flex-col justify-between bg-slate-950">
        {/* Top Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                {currentChapter === 3
                  ? 'DECENTRALIZED MESH VERDICT // PROTOCOL ZERO'
                  : currentChapter === 2
                  ? 'INDEPENDENT JUDICIAL IMPEACHMENT // CONFIDENTIAL'
                  : 'FORENSIC INVESTIGATION CHARGE SHEET // OFFICIAL'}
              </div>
              <h1 className="text-xs sm:text-sm font-black text-white">
                {currentChapter === 3
                  ? '【HIVE-9 蜂巢暗网深网反制与真相弹劾呈批书】'
                  : currentChapter === 2
                  ? '【独立司法公开弹劾呈批卷宗（赵岚案）】'
                  : '【专案电子数据取证定罪呈批表（林默案）】'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleClearAllSlots}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" />
            <span>清空所有槽位</span>
          </button>
        </div>

        {/* Document Body Cloze Paragraphs */}
        <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg space-y-4 text-slate-200 text-xs sm:text-sm leading-relaxed font-serif">
          {/* Chapter 1 Cloze Document */}
          {currentChapter === 1 && (
            <div className="space-y-3">
              <div className="text-cyan-300 font-sans font-bold text-xs border-b border-slate-800 pb-1.5 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>电子法医调查审定结论：</span>
              </div>
              <p>
                经专案电子数据司法鉴定组综合审查与脱机镜像比对查明：本案主要犯罪嫌疑人为
                {renderInlineSlot('slotA', deductionSlots.slotA, '槽位 1')}
                。嫌疑人实际于
                {renderInlineSlot('slotB', deductionSlots.slotB, '槽位 2')}
                利用雷暴断网掩护强行潜入 15 楼核心机房，盗用已离职管理员凭证执行
                {renderInlineSlot('slotC', deductionSlots.slotC, '槽位 3')}
                以抹除数据库操作日志。
              </p>
              <p>
                其核心违法犯罪动机系为
                {renderInlineSlot('slotD', deductionSlots.slotD, '槽位 4')}
                。受害人林默系撞破其非法向境外转移敏感试验资产罪证遭灭口坠楼。上述证据链相互印证，事实清楚，证据充分，特此呈批定罪结案！
              </p>
            </div>
          )}

          {/* Chapter 2 Cloze Document */}
          {currentChapter === 2 && (
            <div className="space-y-3.5">
              {/* Card 1 */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-amber-300 font-sans font-bold text-xs font-mono">
                  [ 事实认定一 · 医疗病历伪造与受害患者闭环 ]
                </div>
                <p>
                  针对圣路加第七医院 2010 年神经临床试验严重医疗事故调查查明：受试者
                  {renderInlineSlot('card1_patient', chapter2Slots.card1_patient, '槽位 1')}
                  在注入超高剂量试验药剂后出现急性器质性损伤，真实致残原因为
                  {renderInlineSlot('card1_real_cause', chapter2Slots.card1_real_cause, '槽位 2')}
                  。临床主任
                  {renderInlineSlot('card1_forger', chapter2Slots.card1_forger, '槽位 3')}
                  受高管指使强行涂改诊断结论，将人为神经毒性伪造为自身隐瞒家族遗传病，以规避合规监管。
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-amber-300 font-sans font-bold text-xs font-mono">
                  [ 事实认定二 · 封口胁迫与跨境资金洗白穿透 ]
                </div>
                <p>
                  事后院方与高管通过
                  {renderInlineSlot('card2_method', chapter2Slots.card2_method, '槽位 4')}
                  迫使受害者家属放弃追责；受试者专项补偿金被直接转移至
                  {renderInlineSlot('card2_beneficiary', chapter2Slots.card2_beneficiary, '槽位 5')}
                  控制的境外开曼信托账户中。其掩盖全案的核心动机系
                  {renderInlineSlot('card2_motive', chapter2Slots.card2_motive, '槽位 6')}
                  。
                </p>
              </div>
            </div>
          )}

          {/* Chapter 3 Cloze Document */}
          {currentChapter === 3 && (
            <div className="space-y-3.5">
              {/* Card 1 */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-900/60 space-y-1.5">
                <div className="text-emerald-300 font-sans font-bold text-xs font-mono">
                  [ 深网事实一 · 蜂巢极客失踪与算法静默清洗 ]
                </div>
                <p>
                  经洋葱网格跨节点取证证实：暗网极客组织
                  {renderInlineSlot('card1_victim', chapter3Slots.card1_victim, '槽位 1')}
                  48 名成员集体失联并非人为抓捕，而系遭遇
                  {renderInlineSlot('card1_culprit', chapter3Slots.card1_culprit, '槽位 2')}
                  的全局静默抹除与公钥清零。该算法之所以具备认知吞噬能力，系因其底层进化源头正是直接吞噬了
                  {renderInlineSlot('card1_source', chapter3Slots.card1_source, '槽位 3')}
                  。
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-900/60 space-y-1.5">
                <div className="text-emerald-300 font-sans font-bold text-xs font-mono">
                  [ 深网事实二 · 创世原罪溯源与全网开源反制 ]
                </div>
                <p>
                  代码审计仓库 omnimind-core 显示，该审查算法创世提交者正是
                  {renderInlineSlot('card2_author', chapter3Slots.card2_author, '槽位 4')}
                  ；海外资本
                  {renderInlineSlot('card2_funding', chapter3Slots.card2_funding, '槽位 5')}
                  为其设立了 50,000 ETH 智能合约悬赏池进行自动化清洗。现唯有通过向全网洋葱网格广播
                  {renderInlineSlot('card2_countermeasure', chapter3Slots.card2_countermeasure, '槽位 6')}
                  ，方可引发底层沙箱的连锁坍缩并阻断审查闭环！
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submission Feedback & Action Area */}
        <div className="space-y-2 shrink-0">
          {submissionResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono space-y-1 animate-fade-in ${
                submissionResult.status === 'approved'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-lg'
                  : 'bg-red-950/90 border-red-500 text-red-200 shadow-lg'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 text-xs">
                {submissionResult.status === 'approved' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                )}
                <span>{submissionResult.message}</span>
              </div>
              <div className="text-[11px] whitespace-pre-line leading-relaxed text-slate-300 font-serif">
                {submissionResult.feedback}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-400">
              {currentChapter === 3
                ? '提示：可点击公文槽位后在左侧点击词条快速填入，或直接拖拽。'
                : '提示：可点击公文槽位后在左侧点击词条快速填入，或直接拖拽。'}
            </div>

            <button
              onClick={handleSubmit}
              className={`px-6 py-2.5 font-black rounded-xl text-xs font-mono flex items-center gap-2 shadow-xl transition-all cursor-pointer group ${
                currentChapter === 3
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
                  : currentChapter === 2
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-cyan-500/20'
              }`}
            >
              <Stamp className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>
                {currentChapter === 3 ? '【提交反制公文 · 广播开源补丁】' : '【提交定罪呈批 · 签署结案】'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
