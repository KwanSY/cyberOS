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
} from 'lucide-react';

const POPULAR_SEARCHES = [
  '天宇科技',
  '陈建国',
  'Project Chimera',
  '门禁记录',
  '安保部事件通报',
];

export const BrowserApp: React.FC = () => {
  const webPages = useGameStore((s) => s.webPages);
  const activePageId = useGameStore((s) => s.activePageId);
  const navigateToPage = useGameStore((s) => s.navigateToPage);
  const browserHistory = useGameStore((s) => s.browserHistory);

  const [inputQuery, setInputQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  const currentPage = webPages.find((p) => p.id === activePageId) || null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim().toLowerCase();
    if (!query) return;

    soundService.playKeyClick();

    // Match keywords or content
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
    <div className="flex-1 flex flex-col bg-cyber-950 font-sans text-xs overflow-hidden">
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
              navigateToPage('page_portal');
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
            {currentPage ? currentPage.url.replace(/^https?:\/\//, '') : 'netquery.archive/search'}
          </span>
        </div>

        {/* Quick Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-64 relative">
          <input
            type="text"
            placeholder="搜索内网公示 / 互联网归档..."
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
        <span className="text-slate-500 font-mono">热搜索引:</span>
        {POPULAR_SEARCHES.map((chip, idx) => (
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
              找到 <strong className="text-cyan-300">{searchResults.length}</strong> 条与“{inputQuery}”相关的网页归档：
            </div>

            {searchResults.length === 0 && (
              <div className="p-12 text-center space-y-3 bg-cyber-900/40 rounded border border-cyber-800">
                <AlertOctagon className="w-10 h-10 text-amber-500/80 mx-auto" />
                <div className="text-slate-300 font-bold">未检索到相关互联网归档记录</div>
                <div className="text-slate-500 text-xs max-w-sm mx-auto">
                  请尝试输入案件关联实体词，如【天宇科技】、【陈建国】、【奇美拉】、【门禁记录】或【安保部】。
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

            {/* Special Layouts by Category */}
            {currentPage.id === 'page_portal' && (
              <div className="space-y-5">
                {/* Company Logo Banner */}
                <div className="flex items-center gap-4 bg-cyber-950/70 p-4 rounded border border-cyber-700">
                  <img
                    src="/assets/tianyu_logo.jpg"
                    alt="Logo"
                    className="w-16 h-16 rounded object-cover border border-cyan-500/40"
                  />
                  <div>
                    <h2 className="text-base font-bold text-cyan-300">天宇科技发展有限公司</h2>
                    <p className="text-xs text-slate-400">Tianyu Technology R&D Corporation (2002-2010)</p>
                  </div>
                </div>

                {/* Team Badges Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Lin Mo ID Badge Card */}
                  <div className="bg-cyber-950 border-2 border-cyber-600 rounded-lg p-4 space-y-3">
                    <div className="text-xs font-bold text-cyan-400 font-mono flex items-center justify-between">
                      <span>【安全架构师员工档案】</span>
                      <span className="text-[10px] text-slate-500">EMP-0417</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <img
                        src="/assets/portrait_lin.jpg"
                        alt="林默员工证"
                        onClick={() => setActiveImageZoom('/assets/portrait_lin.jpg')}
                        className="w-24 h-32 object-cover rounded border border-cyan-500/60 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div>
                          姓名：<WordPickupTag word="林默" category="character" />
                        </div>
                        <div>
                          工号：<WordPickupTag word="EMP-0417" category="location_evidence" />
                        </div>
                        <div>
                          入职年份：<WordPickupTag word="2006" category="timestamp" /> 年 7 月
                        </div>
                        <div>部门：基础安全架构部</div>
                        <div className="text-[11px] text-amber-300 pt-1 font-mono">
                          ★ 点击证件照可放大查阅
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chen Jianguo ID Badge Card */}
                  <div className="bg-cyber-950 border-2 border-cyber-600 rounded-lg p-4 space-y-3">
                    <div className="text-xs font-bold text-amber-400 font-mono flex items-center justify-between">
                      <span>【管理高层执行董事档案】</span>
                      <span className="text-[10px] text-slate-500">EMP-0003</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <img
                        src="/assets/portrait_chen.jpg"
                        alt="陈建国员工证"
                        onClick={() => setActiveImageZoom('/assets/portrait_chen.jpg')}
                        className="w-24 h-32 object-cover rounded border border-amber-500/60 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div>
                          姓名：<WordPickupTag word="陈建国" category="character" />
                        </div>
                        <div>
                          职务：<span className="font-bold text-white">研发副总裁</span>
                        </div>
                        <div>
                          工号：<span className="font-mono text-slate-300">EMP-0003</span>
                        </div>
                        <div>入职年份：2004 年 3 月</div>
                        <div className="text-[11px] text-amber-300 pt-1 font-mono">
                          ★ 统管海外数据与医疗平台
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chimera Confidential Document Page */}
            {currentPage.id === 'page_chimera' && (
              <div className="space-y-4">
                <div className="bg-black/50 p-3 rounded border border-red-900/60 flex items-center gap-4">
                  <img
                    src="/assets/confidential_chimera.jpg"
                    alt="绝密公文"
                    onClick={() => setActiveImageZoom('/assets/confidential_chimera.jpg')}
                    className="w-32 h-44 object-cover rounded border border-red-700 shadow cursor-pointer hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="space-y-2">
                    <div className="text-red-400 font-bold text-xs uppercase tracking-widest font-mono">
                      [CLASSIFIED CLINICAL TRIAL PROTOCOL]
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      包含 1,200 名神经靶向临床受试者全周期随访生理数据，核心加密归档为：
                      <div className="mt-1">
                        <WordPickupTag word="chimera_v3_patient_data.tar.gz" category="location_evidence" />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      存放位置：<WordPickupTag word="15楼机房" category="location_evidence" /> 独立存储矩阵。
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Incident CCTV Page */}
            {currentPage.id === 'page_security_alert' && (
              <div className="space-y-4">
                <div className="bg-cyber-950 p-4 rounded-lg border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 font-mono">
                    <span>15 楼机房走廊监控抓拍复核 (CAM-15F-CORRIDOR)</span>
                    <span>23:38:14</span>
                  </div>
                  <div className="relative rounded overflow-hidden border border-cyber-700">
                    <img
                      src="/assets/cctv_server_corridor.jpg"
                      alt="CCTV Capture"
                      onClick={() => setActiveImageZoom('/assets/cctv_server_corridor.jpg')}
                      className="w-full h-64 object-cover cursor-pointer hover:scale-102 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded">
                      ● REC 2010-06-09 23:38:14
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    安防监控在 <WordPickupTag word="2010-06-09 23:38" category="timestamp" /> 抓拍到身着深色风衣男子潜入 <WordPickupTag word="15楼机房" category="location_evidence" />，经体态特征鉴定系副总裁 <WordPickupTag word="陈建国" category="character" />。证实 23:35 的 1 楼打卡系 <WordPickupTag word="伪造1楼门禁打卡记录" category="action_motive" />！
                  </div>
                </div>
              </div>
            )}

            {/* Access Logs Table */}
            {currentPage.tableData && (
              <div className="space-y-3 border-t border-cyber-800 pt-4">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span>门禁闸机出入明细流水 (2010-06-09 晚间)</span>
                </div>
                <div className="overflow-x-auto border border-cyber-700 rounded">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-cyber-800 text-slate-300 border-b border-cyber-700">
                      <tr>
                        <th className="p-2">时间</th>
                        <th className="p-2">人员/工号</th>
                        <th className="p-2">地点/闸机</th>
                        <th className="p-2">动作状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-800 bg-cyber-950">
                      {currentPage.tableData.map((row, i) => (
                        <tr key={i} className="hover:bg-cyber-900/60">
                          <td className="p-2 text-cyan-300 font-bold">{row.time}</td>
                          <td className="p-2 text-slate-200">{row.person}</td>
                          <td className="p-2 text-amber-300">{row.location}</td>
                          <td className="p-2 text-slate-300">{row.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Text Body */}
            <div className="text-sm text-slate-200 leading-relaxed border-t border-cyber-800 pt-4">
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
              <span>高精度物证显微检视</span>
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
