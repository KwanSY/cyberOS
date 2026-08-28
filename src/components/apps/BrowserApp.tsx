import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { TextWithKeywords } from '../common/TextWithKeywords';
import { WordPickupTag } from '../common/WordPickupTag';
import {
  Search,
  ArrowLeft,
  Home,
  FileSpreadsheet,
  AlertOctagon,
  ExternalLink,
  Lock,
  Stethoscope,
  Globe,
  Database,
  FileText,
  UserCheck,
} from 'lucide-react';

const CH1_POPULAR_SEARCHES = [
  '天宇科技',
  '陈建国',
  'Project Chimera',
  '门禁记录',
  '安保部事件通报',
];

const CH2_POPULAR_SEARCHES = [
  '圣路加第七医院',
  'SUB-0007',
  '赵岚',
  '关悦',
  'CAND-2010-092',
  'DOC-0109',
  '沈明远',
  '强制签署保密与放弃追责协议',
  '护士排班',
];

export const BrowserApp: React.FC = () => {
  const currentChapter = useGameStore((s) => s.currentChapter);
  const webPages = useGameStore((s) => s.webPages);
  const activePageId = useGameStore((s) => s.activePageId);
  const navigateToPage = useGameStore((s) => s.navigateToPage);
  const browserHistory = useGameStore((s) => s.browserHistory);

  const [inputQuery, setInputQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  const currentPage = webPages.find((p) => p.id === activePageId) || null;
  const popularSearches = currentChapter === 2 ? CH2_POPULAR_SEARCHES : CH1_POPULAR_SEARCHES;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim().toLowerCase();
    if (!query) return;

    soundService.playKeyClick();

    // Direct routing shortcuts for Chapter 2
    if (currentChapter === 2) {
      if (query.includes('sub-0007') || query.includes('sub0007') || query.includes('赵岚')) {
        navigateToPage('page_sub_0007');
        setSearchResults(null);
        return;
      }
      if (query.includes('cand-2010-092') || query.includes('cand092') || query.includes('关悦')) {
        navigateToPage('page_candidate_092');
        setSearchResults(null);
        return;
      }
      if (query.includes('ipo') || query.includes('沈明远') || query.includes('上市') || query.includes('30亿')) {
        navigateToPage('page_news_ipo');
        setSearchResults(null);
        return;
      }
      if (query.includes('协议') || query.includes('保密') || query.includes('沉默') || query.includes('追责')) {
        navigateToPage('page_silence_agreement');
        setSearchResults(null);
        return;
      }
      if (query.includes('排班') || query.includes('护士') || query.includes('苏曼') || query.includes('nurse-0322')) {
        navigateToPage('page_nurse_shift');
        setSearchResults(null);
        return;
      }
    }

    // Generic match in keywords or content
    const matched = webPages.filter((p) => {
      const inKeywords = p.keywords.some((k) => k.toLowerCase().includes(query));
      const inTitle = p.title.toLowerCase().includes(query);
      const inSummary = p.summary.toLowerCase().includes(query);
      const inContent = p.content.toLowerCase().includes(query);
      return inKeywords || inTitle || inSummary || inContent;
    });

    if (matched.length === 1) {
      navigateToPage(matched[0].id);
      setSearchResults(null);
    } else {
      setSearchResults(matched.map((p) => p.id));
      navigateToPage(null);
    }
  };

  const handleQuickChipClick = (keyword: string) => {
    setInputQuery(keyword);
    soundService.playKeyClick();

    if (currentChapter === 2) {
      if (keyword.includes('SUB-0007') || keyword.includes('赵岚')) {
        navigateToPage('page_sub_0007');
        setSearchResults(null);
        return;
      }
      if (keyword.includes('关悦') || keyword.includes('CAND-2010-092')) {
        navigateToPage('page_candidate_092');
        setSearchResults(null);
        return;
      }
      if (keyword.includes('沈明远')) {
        navigateToPage('page_news_ipo');
        setSearchResults(null);
        return;
      }
      if (keyword.includes('协议')) {
        navigateToPage('page_silence_agreement');
        setSearchResults(null);
        return;
      }
      if (keyword.includes('护士排班') || keyword.includes('苏曼')) {
        navigateToPage('page_nurse_shift');
        setSearchResults(null);
        return;
      }
    }

    const matched = webPages.filter((p) =>
      p.keywords.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))
    );
    if (matched.length === 1) {
      navigateToPage(matched[0].id);
      setSearchResults(null);
    } else {
      setSearchResults(matched.map((p) => p.id));
      navigateToPage(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-cyber-950 font-sans text-xs overflow-hidden h-full">
      {/* Top Browser Navigation Bar */}
      <div className="bg-cyber-900 border-b border-cyber-700/80 p-2 flex items-center gap-2 select-none">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              soundService.playKeyClick();
              if (browserHistory.length > 1) {
                const prev = browserHistory[browserHistory.length - 2];
                navigateToPage(prev);
              }
            }}
            disabled={browserHistory.length <= 1}
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-cyber-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundService.playKeyClick();
              navigateToPage(currentChapter === 2 ? 'page_med_search' : 'page_portal');
              setSearchResults(null);
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-cyber-800"
            title="主页"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center bg-cyber-950 border border-cyber-700 rounded px-2.5 py-1 text-slate-300 font-mono text-[11px]">
          <Lock className="w-3 h-3 text-emerald-400 mr-2 shrink-0" />
          <span className="text-slate-500 mr-1">http://</span>
          <span className="text-cyan-300 truncate">
            {currentPage ? currentPage.url.replace(/^https?:\/\//, '') : 'netquery.internal/search'}
          </span>
        </div>

        {/* Quick Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-64 sm:w-72 relative">
          <input
            type="text"
            placeholder={
              currentChapter === 2
                ? '搜索 MedQuery / 案号 / 姓名...'
                : '搜索内网公示 / 互联网归档...'
            }
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full bg-cyber-950 border border-cyber-700 rounded pl-7 pr-8 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
          <button
            type="submit"
            className="absolute right-1 top-1 px-1.5 py-0.5 rounded bg-blue-700 hover:bg-blue-600 text-[10px] font-bold text-white"
          >
            GO
          </button>
        </form>
      </div>

      {/* Suggested Quick Keywords Bar */}
      <div className="bg-cyber-900/40 border-b border-cyber-800 px-3 py-1 flex items-center gap-1.5 overflow-x-auto text-[11px] select-none shrink-0">
        <span className="text-slate-500 font-mono shrink-0">
          {currentChapter === 2 ? 'MedQuery 快速索引:' : '热搜索引:'}
        </span>
        {popularSearches.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickChipClick(chip)}
            className="px-2 py-0.5 rounded bg-cyber-800/80 hover:bg-cyber-700 border border-cyber-700 text-cyan-300 hover:text-white transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 overflow-y-auto p-5 bg-cyber-950/80">
        {searchResults && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-slate-400 text-xs border-b border-cyber-800 pb-2">
              找到 <strong className="text-cyan-300">{searchResults.length}</strong> 条与“{inputQuery}”相关的网页/档案记录：
            </div>

            {searchResults.length === 0 && (
              <div className="p-12 text-center space-y-3 bg-cyber-900/40 rounded border border-cyber-800">
                <AlertOctagon className="w-10 h-10 text-amber-500/80 mx-auto" />
                <div className="text-slate-300 font-bold">未检索到相关互联网/医疗档案记录</div>
                <div className="text-slate-500 text-xs max-w-sm mx-auto">
                  请尝试输入【SUB-0007】、【赵岚】、【关悦】、【CAND-2010-092】、【梁绍辉】或【沈明远】。
                </div>
              </div>
            )}

            <div className="space-y-3">
              {searchResults.map((pageId) => {
                const page = webPages.find((p) => p.id === pageId);
                if (!page) return null;
                return (
                  <div
                    key={page.id}
                    onClick={() => {
                      navigateToPage(page.id);
                      setSearchResults(null);
                    }}
                    className="p-4 rounded-lg bg-cyber-900 border border-cyber-700/80 hover:border-cyan-500 transition-all cursor-pointer group"
                  >
                    <div className="text-sm font-bold text-cyan-300 group-hover:underline flex items-center gap-1.5">
                      <span>{page.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{page.url}</div>
                    <div className="text-xs text-slate-300 mt-2">{page.summary}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentPage && !searchResults && (
          <div className="max-w-3xl mx-auto bg-cyber-900 border border-cyber-700/80 rounded-lg p-6 shadow-xl space-y-6">
            {/* Page Header */}
            <div className="border-b border-cyber-700 pb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                  {currentPage.category.toUpperCase()} ARCHIVE
                </span>
                <span>{currentPage.date}</span>
              </div>
              <h1 className="text-lg font-bold text-white">{currentPage.title}</h1>
              <div className="text-xs text-slate-400 mt-1 font-mono">发布单位: {currentPage.author}</div>
            </div>

            {/* Chapter 2: MedQuery Search Portal */}
            {currentPage.id === 'page_med_search' && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 bg-emerald-950/40 p-4 rounded-lg border border-emerald-700/60">
                  <img
                    src="./assets/st_luke_hospital_logo.jpg"
                    alt="Hospital Logo"
                    className="w-16 h-16 rounded object-cover border border-emerald-500/40 shadow-md"
                  />
                  <div>
                    <h2 className="text-base font-bold text-emerald-300">
                      圣路加第七联合医院 · 医疗数据中心 (MedQuery)
                    </h2>
                    <p className="text-xs text-slate-300">
                      St. Luke Seventh Hospital Integrated Medical Query Hub (v2.4)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => navigateToPage('page_sub_0007')}
                    className="p-3.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-600 text-left space-y-1 transition-all group"
                  >
                    <div className="font-bold text-cyan-300 text-xs flex items-center justify-between">
                      <span>调阅受试者档案 [SUB-0007]</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      患者：赵岚（天宇科技实习生） / 状态：已终结
                    </div>
                  </button>

                  <button
                    onClick={() => navigateToPage('page_candidate_092')}
                    className="p-3.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-amber-600/70 text-left space-y-1 transition-all group"
                  >
                    <div className="font-bold text-amber-300 text-xs flex items-center justify-between">
                      <span>优先受试候诊队列 [CAND-2010-092]</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      申请人：关悦（FA-9021 家属） / 状态：排队候诊中
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Chapter 2: SUB-0007 Patient Record */}
            {currentPage.id === 'page_sub_0007' && (
              <div className="space-y-4">
                <div className="bg-cyber-950 border border-cyber-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400 font-mono">
                    <span>【受试者身份与病程小结】</span>
                    <span className="text-slate-500">CASE: SUB-0007</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <img
                      src="./assets/portrait_zhao.jpg"
                      alt="赵岚证件照"
                      onClick={() => setActiveImageZoom('./assets/portrait_zhao.jpg')}
                      className="w-24 h-32 object-cover rounded border border-cyan-500/60 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div>
                        受试患者姓名：<WordPickupTag word="赵岚" category="character" />
                      </div>
                      <div>
                        受试编号：<WordPickupTag word="SUB-0007" category="timestamp" />
                      </div>
                      <div>
                        责任医师：<WordPickupTag word="梁绍辉" category="character" />（工号：<WordPickupTag word="DOC-0109" category="timestamp" />）
                      </div>
                      <div>
                        管床护士：<WordPickupTag word="苏曼" category="character" />（工号：<WordPickupTag word="NURSE-0322" category="timestamp" />）
                      </div>
                      <div>
                        官方伪造诊断：<WordPickupTag word="隐瞒家族遗传病" category="action_motive" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tampered EEG Document Zoom Banner */}
                <div className="bg-black/60 p-3.5 rounded border border-amber-700/60 flex items-center gap-4">
                  <img
                    src="./assets/eeg_sub0007_tampered.jpg"
                    alt="SUB-0007 异常脑电图"
                    onClick={() => setActiveImageZoom('./assets/eeg_sub0007_tampered.jpg')}
                    className="w-28 h-36 object-cover rounded border border-amber-600 shadow cursor-pointer hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                      [CLINICAL EEG TRACE & FRAUDULENT NOTES]
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      单据记录了注射后双侧额颞叶异常高波幅放电，并附有责任医师梁绍辉红笔手写划线涂改记录！
                    </div>
                    <div className="text-[11px] text-amber-300 font-mono">
                      ★ 点击单据可放大显微检视
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 2: CAND-2010-092 (Guan Yue) */}
            {currentPage.id === 'page_candidate_092' && (
              <div className="space-y-4">
                <div className="bg-amber-950/30 border border-amber-600/60 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 font-mono">
                    <span>【优先受试候诊档案】</span>
                    <span>CAND-2010-092</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div>
                      候诊患者：<WordPickupTag word="关悦" category="character" />
                    </div>
                    <div>
                      案号编号：<WordPickupTag word="CAND-2010-092" category="timestamp" />
                    </div>
                    <div>
                      关联家属：<WordPickupTag word="FA-9021" category="character" />
                    </div>
                    <div>
                      特批医师：<WordPickupTag word="梁绍辉" category="character" />
                    </div>
                    <div className="text-amber-300 font-serif border-l-2 border-amber-500 pl-2 mt-2">
                      “待天宇科技纳斯达克 IPO 报告发布后即刻安排注射。该患者为 FA-9021 家属，需特殊关照。”
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter 2: Silence Agreement Scanned Document */}
            {currentPage.id === 'page_silence_agreement' && (
              <div className="space-y-4">
                <div className="bg-black/60 p-3.5 rounded border border-red-800/70 flex items-center gap-4">
                  <img
                    src="./assets/settlement_agreement_confidential.jpg"
                    alt="保密协议扫描件"
                    onClick={() => setActiveImageZoom('./assets/settlement_agreement_confidential.jpg')}
                    className="w-28 h-36 object-cover rounded border border-red-700 shadow cursor-pointer hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="space-y-2">
                    <div className="text-red-400 font-bold text-xs uppercase tracking-wider font-mono">
                      [CONFIDENTIAL SETTLEMENT & WAIVER AGREEMENT]
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      法务公文证实：受害者家属被 <WordPickupTag word="强制签署保密与放弃追责协议" category="action_motive" />，财务总监 <WordPickupTag word="沈明远" category="character" /> 借此 <WordPickupTag word="侵吞专项补偿金" category="action_motive" />！
                    </div>
                    <div className="text-[11px] text-amber-300 font-mono">
                      ★ 点击可放大检视公章与签字条文
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shift / Nurse Roster Table */}
            {currentPage.tableData && (
              <div className="space-y-3 border-t border-cyber-800 pt-4">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span>人员名录与排班明细流水</span>
                </div>
                <div className="overflow-x-auto border border-cyber-700 rounded">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-cyber-800 text-slate-300 border-b border-cyber-700">
                      <tr>
                        {Object.keys(currentPage.tableData[0] || {}).map((header, idx) => (
                          <th key={idx} className="p-2 capitalize">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-800 bg-cyber-950">
                      {currentPage.tableData.map((row, i) => (
                        <tr key={i} className="hover:bg-cyber-900/60">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-2 text-slate-200">
                              <TextWithKeywords text={val} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* General Text Body */}
            <div className="text-sm text-slate-200 leading-relaxed border-t border-cyber-800 pt-4 font-serif">
              <TextWithKeywords text={currentPage.content} />
            </div>
          </div>
        )}
      </div>

      {/* Image Modal Zoom */}
      {activeImageZoom && (
        <div
          onClick={() => setActiveImageZoom(null)}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6 cursor-pointer animate-fade-in backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cyber-900 p-3 rounded-lg border-2 border-cyan-400 shadow-2xl max-w-2xl max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center pb-2 text-xs font-mono text-cyan-300">
              <span>高精度法医显微物证检视</span>
              <button
                onClick={() => setActiveImageZoom(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-cyber-800"
              >
                关闭 [ESC]
              </button>
            </div>
            <img
              src={activeImageZoom}
              alt="Zoomed Evidence"
              className="max-h-[72vh] w-auto object-contain rounded border border-cyber-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
