import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { WordCategory, DeductionSlots, Chapter2DeductionSlots } from '../../types/game';
import {
  Stamp,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Search,
  Layers,
  X,
  Lightbulb,
  ShieldAlert,
  Radio,
} from 'lucide-react';

const CATEGORIES: Array<{ key: WordCategory | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'character', label: '人物' },
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

  const submissionResult = useGameStore((s) => s.submissionResult);
  const resetDeductionResult = useGameStore((s) => s.resetDeductionResult);

  const [activeCategory, setActiveCategory] = useState<WordCategory | 'all'>('all');
  const [searchWordQuery, setSearchWordQuery] = useState('');
  const [activeSlotModal, setActiveSlotModal] = useState<string | null>(null);

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
      if (currentChapter === 2) {
        setChapter2Slot(slotKey as keyof Chapter2DeductionSlots, text);
      } else {
        setDeductionSlot(slotKey as keyof DeductionSlots, text);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClearAllSlots = () => {
    soundService.playKeyClick(0.9);
    if (currentChapter === 2) {
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
    resetDeductionResult();
  };

  const handleSubmit = () => {
    if (currentChapter === 2) {
      submitChapter2Deduction();
    } else {
      submitDeduction();
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden font-sans text-xs bg-cyber-950 w-full h-full">
      {/* Left: Word Bank Drawer (Fixed 290px width) */}
      <div className="w-[290px] min-w-[290px] max-w-[290px] bg-cyber-900 border-r border-cyber-700/80 flex flex-col select-none shrink-0 h-full">
        <div className="p-3 border-b border-cyber-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>词块库 (Word Bank)</span>
            </div>
            <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded text-[11px] font-mono border border-blue-800 shrink-0">
              已收录: {collectedWords.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="搜索已收录词条..."
              value={searchWordQuery}
              onChange={(e) => setSearchWordQuery(e.target.value)}
              className="w-full bg-cyber-950 border border-cyber-700 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  soundService.playKeyClick();
                  setActiveCategory(cat.key);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-cyber-950 text-slate-400 hover:text-slate-200 border border-cyber-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Word Chips List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {collectedWords.length === 0 ? (
            <div className="p-5 text-center space-y-2.5 bg-cyber-950/80 rounded-lg border border-cyber-800 text-slate-400">
              <Lightbulb className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="font-bold text-slate-200 text-xs">当前词块库为空</div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                请在 <span className="text-cyan-300 font-semibold">MailBox</span>、<span className="text-cyan-300 font-semibold">NetQuery 浏览器</span>、<span className="text-cyan-300 font-semibold">CyberPlayer 录音</span> 或 <span className="text-cyan-300 font-semibold">Terminal 终端</span> 中点击高亮词条进行提取！
              </p>
            </div>
          ) : (
            <>
              <div className="text-[10px] text-slate-500 font-mono mb-1">
                * 拖拽词块至右侧公文槽位，或点击槽位从收录列表中选择
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredWords.map((word) => (
                  <div
                    key={word.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word.text)}
                    onClick={() => {
                      soundService.playKeyClick();
                      if (activeSlotModal) {
                        if (currentChapter === 2) {
                          setChapter2Slot(activeSlotModal as keyof Chapter2DeductionSlots, word.text);
                        } else {
                          setDeductionSlot(activeSlotModal as keyof DeductionSlots, word.text);
                        }
                        setActiveSlotModal(null);
                      }
                    }}
                    title={`分类: ${word.categoryLabel}\n${word.description || ''}`}
                    className="px-2.5 py-1 rounded bg-cyber-950 hover:bg-cyber-800 border border-cyber-600/80 hover:border-cyan-400 text-slate-200 hover:text-cyan-200 cursor-grab active:cursor-grabbing transition-all text-xs flex items-center gap-1.5 shadow-sm group select-none"
                  >
                    <span className="font-medium">{word.text}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyber-900 text-slate-400 border border-cyber-800 font-mono">
                      {word.categoryLabel}
                    </span>
                  </div>
                ))}

                {filteredWords.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-xs w-full">
                    该分类下暂无已收录词条。
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Formal Bureaucratic Case Deduction Document Panel */}
      <div className="flex-1 min-w-0 bg-amber-50/95 text-slate-900 flex flex-col h-full font-bureaucracy relative overflow-hidden">
        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <div className="max-w-2xl mx-auto w-full space-y-5">
            {/* Header */}
            {currentChapter === 2 ? (
              <div className="text-center border-b-2 border-red-900 pb-4 space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs tracking-widest text-red-800 font-mono font-bold bg-red-100 px-3 py-0.5 rounded-full border border-red-300 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>★ 司法审计专员 · 体制外独立公开弹劾案卷 ★</span>
                </div>
                <h1 className="text-xl font-black tracking-wide text-slate-900">
                  CASE-20100615-02 圣路加医疗事故与离岸洗钱独立弹劾通报
                </h1>
                <div className="flex justify-center gap-6 text-xs text-slate-600 font-mono pt-1">
                  <span>审查法医：FA-9021 (越权审计)</span>
                  <span>涉案主体：圣路加医院 / 天宇科技 / 远景生命</span>
                  <span>审查状态：公开发布前审定</span>
                </div>
              </div>
            ) : (
              <div className="text-center border-b-2 border-red-900 pb-4 space-y-1">
                <div className="text-xs tracking-widest text-red-800 font-mono font-bold">
                  ★ 特别督查专案组 · 最终审定报告 ★
                </div>
                <h1 className="text-xl font-black tracking-wide text-slate-900">
                  CASE-20100610-01 案卷电子取证结论与定罪公文
                </h1>
                <div className="flex justify-center gap-6 text-xs text-slate-600 font-mono pt-1">
                  <span>主审法医：FA-9021</span>
                  <span>受案日期：2010-06-10</span>
                  <span>案由：林默坠亡案与服务器数据篡改案</span>
                </div>
              </div>
            )}

            {/* Document Content */}
            {currentChapter === 2 ? (
              /* Chapter 2 Dual Cards Layout */
              <div className="space-y-4">
                {/* Card 1: 医疗事故真相与病历篡改 */}
                <div className="bg-amber-100/70 p-4 rounded-lg border-2 border-red-800/40 text-slate-800 text-xs leading-loose shadow-inner space-y-3">
                  <div className="font-bold text-sm text-red-950 font-sans border-b border-red-800/20 pb-1.5 flex items-center justify-between">
                    <span>【卡片 1 · 医疗事故真相与病历伪造审查】</span>
                    <span className="text-[10px] text-red-800 font-mono">FACTS 01</span>
                  </div>

                  <p>
                    经调阅 MedQuery 医疗档案并比对脱机原始脑电数据（SUB-0007_raw_eeg.dat），证实受试患者
                    <DeductionSlotBox
                      title="【受害患者】"
                      value={chapter2Slots.card1_patient}
                      onClear={() => setChapter2Slot('card1_patient', null)}
                      onOpenModal={() => setActiveSlotModal('card1_patient')}
                      onDrop={(e) => handleDrop(e, 'card1_patient')}
                      onDragOver={handleDragOver}
                    />
                    在接受超量注射后出现不可逆严重器质性脑萎缩，真实致残原因为
                    <DeductionSlotBox
                      title="【真实致残诱因】"
                      value={chapter2Slots.card1_real_cause}
                      onClear={() => setChapter2Slot('card1_real_cause', null)}
                      onOpenModal={() => setActiveSlotModal('card1_real_cause')}
                      onDrop={(e) => handleDrop(e, 'card1_real_cause')}
                      onDragOver={handleDragOver}
                    />
                    。临床主管医师
                    <DeductionSlotBox
                      title="【伪造病历责任人】"
                      value={chapter2Slots.card1_forger}
                      onClear={() => setChapter2Slot('card1_forger', null)}
                      onOpenModal={() => setActiveSlotModal('card1_forger')}
                      onDrop={(e) => handleDrop(e, 'card1_forger')}
                      onDragOver={handleDragOver}
                    />
                    受高层指使销毁原始脑电，强行将诊断结论篡改为隐瞒家族遗传病，以此免除企业法律责任。
                  </p>
                </div>

                {/* Card 2: 沉默协议与离岸利益链 */}
                <div className="bg-amber-100/70 p-4 rounded-lg border-2 border-red-800/40 text-slate-800 text-xs leading-loose shadow-inner space-y-3">
                  <div className="font-bold text-sm text-red-950 font-sans border-b border-red-800/20 pb-1.5 flex items-center justify-between">
                    <span>【卡片 2 · 沉默协议与离岸利益输送审查】</span>
                    <span className="text-[10px] text-red-800 font-mono">FACTS 02</span>
                  </div>

                  <p>
                    法务部与院方借封口之名迫使受害人家属
                    <DeductionSlotBox
                      title="【胁迫手段】"
                      value={chapter2Slots.card2_method}
                      onClear={() => setChapter2Slot('card2_method', null)}
                      onOpenModal={() => setActiveSlotModal('card2_method')}
                      onDrop={(e) => handleDrop(e, 'card2_method')}
                      onDragOver={handleDragOver}
                    />
                    。原本核准的 2000 万元专项事故补偿金被财务总监
                    <DeductionSlotBox
                      title="【侵吞补偿金受益人】"
                      value={chapter2Slots.card2_beneficiary}
                      onClear={() => setChapter2Slot('card2_beneficiary', null)}
                      onOpenModal={() => setActiveSlotModal('card2_beneficiary')}
                      onDrop={(e) => handleDrop(e, 'card2_beneficiary')}
                      onDragOver={handleDragOver}
                    />
                    通过境外开曼空壳信托 Aegis Horizon（IP: 198.51.100.24）大额侵吞套现。其全盘瞒报掩盖之核心动机，系为
                    <DeductionSlotBox
                      title="【核心掩盖动机】"
                      value={chapter2Slots.card2_motive}
                      onClear={() => setChapter2Slot('card2_motive', null)}
                      onOpenModal={() => setActiveSlotModal('card2_motive')}
                      onDrop={(e) => handleDrop(e, 'card2_motive')}
                      onDragOver={handleDragOver}
                    />
                    ！
                  </p>
                </div>
              </div>
            ) : (
              /* Chapter 1 Single Card Layout */
              <div className="bg-amber-100/60 p-5 rounded-lg border border-amber-300 text-slate-800 text-sm leading-loose shadow-inner space-y-4 relative">
                <p>
                  经对天宇科技工作站镜像、15楼机房安保监控及远端脱机备份日志之多维交叉比对，专案组现作出如下确定性审定结论：
                </p>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900">一、涉案主谋定性：</span>
                  <div className="inline-block mx-1.5">
                    <DeductionSlotBox
                      title="【真凶姓名】"
                      value={deductionSlots.slotA}
                      onClear={() => setDeductionSlot('slotA', null)}
                      onOpenModal={() => setActiveSlotModal('slotA')}
                      onDrop={(e) => handleDrop(e, 'slotA')}
                      onDragOver={handleDragOver}
                    />
                  </div>
                  <span>为本案真正幕后主使，其事前在1楼门禁刷卡以制造不在场证明，实则身穿深色风衣潜回15楼机房作案。</span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900">二、核心作案时间锁定：</span>
                  <span>真凶趁暴雨断网物理隔离之际，于</span>
                  <div className="inline-block mx-1.5">
                    <DeductionSlotBox
                      title="【作案时间点】"
                      value={deductionSlots.slotB}
                      onClear={() => setDeductionSlot('slotB', null)}
                      onOpenModal={() => setActiveSlotModal('slotB')}
                      onDrop={(e) => handleDrop(e, 'slotB')}
                      onDragOver={handleDragOver}
                    />
                  </div>
                  <span>强行侵入核心服务器，执行非法数据外传与全盘扇区覆写。</span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900">三、技术破坏手段复原：</span>
                  <span>嫌疑人通过</span>
                  <div className="inline-block mx-1.5">
                    <DeductionSlotBox
                      title="【关键作案手段】"
                      value={deductionSlots.slotC}
                      onClear={() => setDeductionSlot('slotC', null)}
                      onOpenModal={() => setActiveSlotModal('slotC')}
                      onDrop={(e) => handleDrop(e, 'slotC')}
                      onDragOver={handleDragOver}
                    />
                  </div>
                  <span>抹除本地审计流水，被林默当场撞破后将其灭口推下天台。</span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900">四、犯罪动机与非法所得：</span>
                  <span>主谋行凶之根本动机，系为掩盖其长期</span>
                  <div className="inline-block mx-1.5">
                    <DeductionSlotBox
                      title="【核心违法动机】"
                      value={deductionSlots.slotD}
                      onClear={() => setDeductionSlot('slotD', null)}
                      onOpenModal={() => setActiveSlotModal('slotD')}
                      onDrop={(e) => handleDrop(e, 'slotD')}
                      onDragOver={handleDragOver}
                    />
                  </div>
                  <span>并秘密打包转售给境外空壳财团（IP: 198.51.100.24）的非法牟利事实。</span>
                </div>
              </div>
            )}

            {/* Submission Feedback Alert */}
            {submissionResult && (
              <div className="relative">
                {submissionResult.status === 'approved' ? (
                  <div className="p-4 rounded-lg bg-emerald-100 border-2 border-emerald-700 text-emerald-950 font-sans space-y-2">
                    <div className="flex items-center gap-2 text-base font-bold text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>{submissionResult.message}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{submissionResult.feedback}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-red-100 border-2 border-red-700 text-red-950 font-sans space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-red-800">
                        <AlertTriangle className="w-5 h-5 text-red-700" />
                        <span>{submissionResult.message}</span>
                      </div>
                      <button
                        onClick={resetDeductionResult}
                        className="text-xs text-red-700 hover:underline font-mono"
                      >
                        [重新修正]
                      </button>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap font-sans text-red-900 leading-relaxed bg-red-50 p-2.5 rounded border border-red-300">
                      {submissionResult.feedback}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pinned Bottom Action Toolbar */}
        <div className="border-t-2 border-amber-300/90 bg-amber-100/95 px-6 py-3 shrink-0 flex items-center justify-between z-20 shadow-md backdrop-blur-xs select-none">
          <button
            onClick={handleClearAllSlots}
            className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-slate-800 rounded font-sans text-xs font-bold border border-amber-400 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>清空槽位</span>
          </button>

          <button
            onClick={handleSubmit}
            className="px-7 py-2.5 bg-red-900 hover:bg-red-800 text-amber-50 rounded-lg font-sans text-xs font-bold tracking-wider shadow-xl border border-red-950 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Stamp className="w-4 h-4 text-amber-300" />
            <span>
              {currentChapter === 2
                ? '全网广播公开弹劾 (BROADCAST IMPEACHMENT)'
                : '提交定罪审查 (SUBMIT CONVICTION)'}
            </span>
          </button>
        </div>
      </div>

      {/* Direct Pick Word Modal Popover */}
      {activeSlotModal && (
        <div
          onClick={() => setActiveSlotModal(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cyber-900 border-2 border-cyan-500 rounded-lg p-4 max-w-md w-full shadow-2xl space-y-3 animate-fade-in text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-cyber-700 pb-2">
              <span className="font-bold text-cyan-300 text-xs font-mono">
                从已收录词块中选择填入
              </span>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {collectedWords.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                <div>暂无可填入的已收录词块。</div>
                <div className="text-[11px] text-slate-500">
                  请先在邮件、浏览器网页、录音或终端中点击高亮词条进行提取！
                </div>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {collectedWords.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      soundService.playKeyClick();
                      if (currentChapter === 2) {
                        setChapter2Slot(activeSlotModal as keyof Chapter2DeductionSlots, word.text);
                      } else {
                        setDeductionSlot(activeSlotModal as keyof DeductionSlots, word.text);
                      }
                      setActiveSlotModal(null);
                    }}
                    className="w-full p-2 rounded bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-400 text-left flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="font-bold text-slate-200">{word.text}</span>
                    <span className="text-[10px] text-cyan-400 bg-cyber-900 px-1.5 py-0.5 rounded font-mono">
                      {word.categoryLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface DeductionSlotBoxProps {
  title: string;
  value: string | null;
  onClear: () => void;
  onOpenModal: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

const DeductionSlotBox: React.FC<DeductionSlotBoxProps> = ({
  title,
  value,
  onClear,
  onOpenModal,
  onDrop,
  onDragOver,
}) => {
  return (
    <span
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={onOpenModal}
      title="点击直接选择或拖拽已收录词块至此"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border-2 transition-all cursor-pointer select-none font-sans font-bold text-xs ${
        value
          ? 'bg-amber-200/90 text-red-950 border-red-800 shadow-sm'
          : 'bg-amber-100 text-slate-500 border-dashed border-amber-500 hover:border-red-700 hover:bg-amber-200/60'
      }`}
    >
      {value ? (
        <>
          <span>【{value}】</span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            title="清空此槽位"
            className="hover:text-red-700 p-0.5 rounded"
          >
            <X className="w-3 h-3" />
          </span>
        </>
      ) : (
        <span className="text-slate-500 italic">{title} (点击或拖拽放入)</span>
      )}
    </span>
  );
};
