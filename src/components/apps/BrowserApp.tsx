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
  Building2,
  ShieldAlert,
  FileKey,
  Users,
  Clock,
  ArrowRight,
  Stethoscope,
  FileText,
  Scale,
  Sparkles,
} from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const currentChapter = useGameStore((s) => s.currentChapter);
  const webPages = useGameStore((s) => s.webPages);
  const activePageId = useGameStore((s) => s.activePageId);
  const navigateToPage = useGameStore((s) => s.navigateToPage);
  const browserHistory = useGameStore((s) => s.browserHistory);

  const [inputQuery, setInputQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[] | null>(null);
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  const isCh2 = currentChapter === 2;
  const homePageId = isCh2 ? 'page_med_search' : 'page_portal';
  const currentPage = webPages.find((p) => p.id === activePageId) || null;
  const isAtHome = !searchResults && (!currentPage || currentPage.id === homePageId);

  const handleSearchSubmit = (queryToSearch?: string) => {
    const rawQuery = typeof queryToSearch === 'string' ? queryToSearch : inputQuery;
    const query = rawQuery.trim().toLowerCase();
    if (!query) return;

    soundService.playKeyClick();

    // Direct routing shortcuts for Chapter 2
    if (isCh2) {
      if (query.includes('车祸') || query.includes('坠海') || query.includes('事故') || query.includes('滨海')) {
        navigateToPage('page_news_nurse_accident');
        setSearchResults(null);
        return;
      }
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
      if (query.includes('排班') || query.includes('nurse-0322')) {
        navigateToPage('page_nurse_shift');
        setSearchResults(null);
        return;
      }
    }

    // Generic match in keywords, title, summary, content, author, table data
    const matched = webPages.filter((p) => {
      const inKeywords = p.keywords?.some((k) => k.toLowerCase().includes(query));
      const inTitle = p.title.toLowerCase().includes(query);
      const inSummary = p.summary.toLowerCase().includes(query);
      const inContent = p.content.toLowerCase().includes(query);
      const inAuthor = p.author?.toLowerCase().includes(query);
      const inUrl = p.url.toLowerCase().includes(query);
      const inTable = p.tableData?.some((row) =>
        Object.values(row).some((val) => val.toLowerCase().includes(query))
      );
      return inKeywords || inTitle || inSummary || inContent || inAuthor || inUrl || inTable;
    });

    if (matched.length === 1) {
      navigateToPage(matched[0].id);
      setSearchResults(null);
    } else {
      setSearchResults(matched.map((p) => p.id));
      navigateToPage(null);
    }
  };

  const handleGoHome = () => {
    soundService.playKeyClick();
    navigateToPage(homePageId);
    setSearchResults(null);
  };

  const handleNavigate = (pageId: string) => {
    soundService.playKeyClick();
    navigateToPage(pageId);
    setSearchResults(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-cyber-950 font-sans text-xs overflow-hidden h-full">
      {/* Top Browser Navigation & Address Bar */}
      <div className="bg-cyber-900 border-b border-cyber-700/80 p-2 flex items-center gap-2 select-none shrink-0 shadow-md">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              soundService.playKeyClick();
              if (searchResults) {
                setSearchResults(null);
              } else if (browserHistory.length > 1) {
                const prev = browserHistory[browserHistory.length - 2];
                navigateToPage(prev);
              }
            }}
            disabled={!searchResults && browserHistory.length <= 1}
            className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-cyber-800 transition-colors"
            title="后退"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleGoHome}
            className={`p-1.5 rounded transition-colors ${
              isAtHome
                ? 'text-cyan-400 bg-cyber-800'
                : 'text-slate-400 hover:text-white hover:bg-cyber-800'
            }`}
            title="门户主页"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center bg-cyber-950 border border-cyber-700 rounded px-2.5 py-1 text-slate-300 font-mono text-[11px] overflow-hidden">
          <Lock className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
          <span className="text-slate-500 mr-1 select-none">http://</span>
          <span className="text-cyan-300 truncate">
            {searchResults
              ? isCh2
                ? 'medquery.st-luke.internal/search?q=' + encodeURIComponent(inputQuery)
                : 'intranet.tianyu-tech.com/search?q=' + encodeURIComponent(inputQuery)
              : currentPage
              ? currentPage.url.replace(/^https?:\/\//, '')
              : isCh2
              ? 'medquery.st-luke.internal/'
              : 'intranet.tianyu-tech.com/'}
          </span>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
          className="w-56 sm:w-72 relative shrink-0"
        >
          <input
            type="text"
            placeholder={
              isCh2
                ? '检索医疗数据库...'
                : '检索企业内网档案...'
            }
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="w-full bg-cyber-950 border border-cyber-700 rounded pl-7 pr-12 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
          <button
            type="submit"
            className="absolute right-1 top-1 px-2 py-0.5 rounded bg-blue-700 hover:bg-blue-600 text-[10px] font-bold text-white transition-colors"
          >
            搜索
          </button>
        </form>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-cyber-950/90">
        {/* 1. SEARCH RESULTS VIEW */}
        {searchResults && (
          <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-cyber-800 pb-3">
              <div className="text-slate-300 text-xs flex items-center gap-2">
                <span>检索关键词：</span>
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono font-bold">
                  {inputQuery || '(全部)'}
                </span>
                <span className="text-slate-500">
                  (找到 <strong className="text-cyan-300">{searchResults.length}</strong> 条相关档案)
                </span>
              </div>
              <button
                onClick={handleGoHome}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
              >
                <Home className="w-3.5 h-3.5" />
                <span>返回门户首页</span>
              </button>
            </div>

            {searchResults.length === 0 && (
              <div className="p-12 text-center space-y-3 bg-cyber-900/40 rounded-lg border border-cyber-800">
                <AlertOctagon className="w-10 h-10 text-amber-500/80 mx-auto" />
                <div className="text-slate-200 font-bold text-sm">未检索到相关档案记录</div>
                <div className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                  请检查输入的关键词或姓名编号拼写，或返回门户首页通过部门导航卡片浏览内部系统。
                </div>
                <button
                  onClick={handleGoHome}
                  className="mt-2 px-4 py-1.5 bg-cyber-800 hover:bg-cyber-700 border border-cyber-600 rounded text-cyan-300 text-xs font-semibold"
                >
                  返回门户首页
                </button>
              </div>
            )}

            <div className="space-y-3">
              {searchResults.map((pageId) => {
                const page = webPages.find((p) => p.id === pageId);
                if (!page) return null;
                return (
                  <div
                    key={page.id}
                    onClick={() => handleNavigate(page.id)}
                    className="p-4 rounded-lg bg-cyber-900 border border-cyber-700/80 hover:border-cyan-500 hover:bg-cyber-850 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-2 py-0.2 rounded">
                        {page.category}
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">{page.date}</span>
                    </div>
                    <div className="text-sm font-bold text-cyan-300 group-hover:underline flex items-center gap-1.5 mt-1">
                      <span>{page.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{page.url}</div>
                    <div className="text-xs text-slate-300 mt-2 line-clamp-2">{page.summary}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CHAPTER 1: TIANYU TECH INTRANET PORTAL HOMEPAGE */}
        {!searchResults && !isCh2 && currentPage?.id === 'page_portal' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Portal Banner Header */}
            <div className="bg-gradient-to-r from-blue-950/80 via-cyber-900 to-slate-900 border border-cyber-700 rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-lg bg-cyber-950 border border-cyan-500/50 flex items-center justify-center p-1 shadow-inner shrink-0">
                    <img
                      src="./assets/tianyu_logo.jpg"
                      alt="Tianyu Logo"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-base font-bold text-white tracking-wide">
                        天宇科技 · 企业内网信息门户
                      </h1>
                      <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 px-1.5 py-0.2 rounded font-bold">
                        INTRANET HUB
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tianyu Technology Enterprise Intranet &amp; Clinical Information Portal
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-400 space-y-0.5 border-t sm:border-t-0 sm:border-l border-cyber-800 pt-2 sm:pt-0 sm:pl-4">
                  <div className="text-emerald-400 flex items-center sm:justify-end gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>审计只读通道已建立</span>
                  </div>
                  <div className="text-slate-500">Node: TY-GATE-08F</div>
                </div>
              </div>

              {/* Portal In-Page Search */}
              <div className="mt-4 pt-3 border-t border-cyber-800/80">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="在天宇内网中检索档案..."
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchSubmit();
                      }}
                      className="w-full bg-cyber-950/90 border border-cyber-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-bold text-xs shadow transition-colors"
                  >
                    站内检索
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Corporate Governance & Core Team */}
            <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-cyber-800 pb-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>核心团队架构与人员名录</span>
                </div>
                <button
                  onClick={() => handleNavigate('page_chen_profile')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold hover:underline"
                >
                  <span>查阅高管专栏 (陈建国)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3">
                <p>
                  天宇科技（Tianyu Technology）成立于 2002 年，致力于生物医药大数据与临床计算架构。
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-cyber-950 p-3 rounded-lg border border-cyber-800 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span>【管理高层】</span>
                      <span className="text-[10px] text-slate-500 font-mono">16F 高管层</span>
                    </div>
                    <div className="text-slate-300 text-xs">
                      ● <WordPickupTag word="陈建国" category="character" />（工号：
                      <WordPickupTag word="EMP-0003" category="location_evidence" />）：研发副总裁、执行董事。2004 年加入公司，分管海外商务拓展与医疗数据计算平台。
                    </div>
                    <div className="text-slate-300 text-xs">
                      ● <WordPickupTag word="王思远" category="character" />：海外商务拓展总监，负责离岸合规业务对接。
                    </div>
                  </div>

                  <div className="bg-cyber-950 p-3 rounded-lg border border-cyber-800 space-y-1">
                    <div className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                      <span>【技术与安全核心】</span>
                      <span className="text-[10px] text-slate-500 font-mono">8F 研发部</span>
                    </div>
                    <div className="text-slate-300 text-xs">
                      ● <WordPickupTag word="林默" category="character" />（工号：
                      <WordPickupTag word="EMP-0417" category="location_evidence" />）：基础安全架构师。<WordPickupTag word="2006" category="timestamp" /> 年 7 月入职，构建了公司内网加密存储系统与三期临床数据隔离网闸。
                    </div>
                    <div className="text-slate-300 text-xs">
                      ● <WordPickupTag word="赵凯" category="character" />：IT基础运维主管，负责机房基础设施与物理线路。
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Department Systems Quick Cards */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 font-mono px-1">
                [ 内部部门档案与系统直达 ]
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Chen Profile Card */}
                <div
                  onClick={() => handleNavigate('page_chen_profile')}
                  className="bg-cyber-900 border border-cyber-700/80 hover:border-cyan-500 hover:bg-cyber-850 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-bold">
                        高管专栏
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">2010-04-12</span>
                    </div>
                    <div className="font-bold text-sm text-cyan-300 group-hover:underline">
                      副总裁 陈建国 先生离岸合作与数据节点设立
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      陈建国副总裁主导海外跨国医疗战略合作与离岸资产管理，暗中设立专用服务器境外数据节点。
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                    <span>查阅专栏档案</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 2. Project Chimera Card */}
                <div
                  onClick={() => handleNavigate('page_chimera')}
                  className="bg-cyber-900 border border-red-900/60 hover:border-red-500 hover:bg-cyber-850 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
                        ★ 绝密 TOP SECRET
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">2010-06-05</span>
                    </div>
                    <div className="font-bold text-sm text-red-300 group-hover:underline">
                      奇美拉（Project Chimera）三期临床试验技术规范
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      包含 1,200 名神经靶向药物临床受试患者全基因测序及生理指标，核心加密文件存储于 15 楼机房。
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-red-400 font-semibold">
                    <span>调阅三期技术规范</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 3. Gate Access Log Card */}
                <div
                  onClick={() => handleNavigate('page_access_log')}
                  className="bg-cyber-900 border border-cyber-700/80 hover:border-cyan-500 hover:bg-cyber-850 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                        安防出勤系统
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">2010-06-10</span>
                    </div>
                    <div className="font-bold text-sm text-cyan-300 group-hover:underline">
                      天宇大厦内网安防系统 - 6月9日 门禁出入流水记录
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      2010年6月9日晚间（暴雨当夜）大厦各出入口及敏感机房门禁刷卡打卡流水。
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>调阅门禁流水记录</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* 4. Security Alert Bulletin Card */}
                <div
                  onClick={() => handleNavigate('page_security_alert')}
                  className="bg-cyber-900 border border-amber-900/60 hover:border-amber-500 hover:bg-cyber-850 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-bold">
                        安保部紧急通报
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">2010-06-10</span>
                    </div>
                    <div className="font-bold text-sm text-amber-300 group-hover:underline">
                      安保部紧急事件通报：雷暴夜机房异常与监控复核
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      暴雨雷击致外网中断调查报告，附 15 楼机房走廊监控抓拍复核与陈建国刷卡离厦记录。
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>查看通报详情</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CHAPTER 2: MEDQUERY HOSPITAL PORTAL HOMEPAGE */}
        {!searchResults && isCh2 && currentPage?.id === 'page_med_search' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Hospital Portal Header */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-cyber-900 to-slate-900 border border-emerald-700/80 rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src="./assets/st_luke_hospital_logo.jpg"
                    alt="Hospital Logo"
                    className="w-14 h-14 rounded-lg object-cover border border-emerald-500/50 shadow-md shrink-0"
                  />
                  <div>
                    <h1 className="text-base font-bold text-emerald-300">
                      圣路加第七联合医院 · 医疗数据中心 (MedQuery)
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      St. Luke Seventh Hospital Integrated Medical Query Hub (v2.4)
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-400 border-t sm:border-t-0 sm:border-l border-cyber-800 pt-2 sm:pt-0 sm:pl-4">
                  <div className="text-emerald-400 font-semibold">● 临床数据节点在线</div>
                  <div className="text-slate-500">Terminal: MED-QUERY-07</div>
                </div>
              </div>

              {/* MedQuery Search */}
              <div className="mt-4 pt-3 border-t border-cyber-800/80">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="在 MedQuery 中检索医疗档案..."
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearchSubmit();
                      }}
                      className="w-full bg-cyber-950/90 border border-cyber-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-white font-bold text-xs shadow transition-colors"
                  >
                    检索档案
                  </button>
                </div>
              </div>
            </div>

            {/* Chapter 2 Entry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* SUB-0007 */}
              <div
                onClick={() => handleNavigate('page_sub_0007')}
                className="bg-cyber-900 border border-cyber-700 hover:border-cyan-500 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-bold">
                      受试者病历档案
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">2010-05-28</span>
                  </div>
                  <div className="font-bold text-sm text-cyan-300 group-hover:underline">
                    受试者 SUB-0007（赵岚）临床终结与出院小结
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    奇美拉-N项目 07 号受试者临床反应判定书、异常脑电图及官方出院小结。
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span>调阅 07 号病历档案</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* CAND-2010-092 */}
              <div
                onClick={() => handleNavigate('page_candidate_092')}
                className="bg-cyber-900 border border-amber-800/80 hover:border-amber-500 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-bold">
                      优先候诊队列
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">2010-06-12</span>
                  </div>
                  <div className="font-bold text-sm text-amber-300 group-hover:underline">
                    优先临床受试队列 CAND-2010-092（关悦）
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    神经靶向药物 Chimera-N 二期人体临床优先入组审批表（FA-9021 家属）。
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>调阅候诊档案</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Silence Agreement */}
              <div
                onClick={() => handleNavigate('page_silence_agreement')}
                className="bg-cyber-900 border border-red-900/60 hover:border-red-500 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
                      法务绝密备忘
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">2010-05-30</span>
                  </div>
                  <div className="font-bold text-sm text-red-300 group-hover:underline">
                    法务通报：关于受试者 SUB-0007 协议签署公函
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    强制签署放弃追责和解协议、侵吞2000万专项补偿金及舆情阻断公函。
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-red-400 font-semibold">
                  <span>调阅法务公函</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Nurse Shift Roster */}
              <div
                onClick={() => handleNavigate('page_nurse_shift')}
                className="bg-cyber-900 border border-cyber-700 hover:border-emerald-500 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                      护士排班档案
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">2008-04-01</span>
                  </div>
                  <div className="font-bold text-sm text-emerald-300 group-hover:underline">
                    急诊与神经重症监护科 2008 年度排班与员工名录
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    神经重症医学科在职护理人员工号、入职登记日（苏曼 NURSE-0322）及岗位分配表。
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>调阅护士名录</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* News Nurse Accident */}
              <div
                onClick={() => handleNavigate('page_news_nurse_accident')}
                className="bg-cyber-900 border border-red-900/60 hover:border-red-500 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">
                      社会突发快讯
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">2010-06-03</span>
                  </div>
                  <div className="font-bold text-sm text-red-300 group-hover:underline">
                    滨海公路深夜单方车辆坠海事故（遇难护士为苏曼）
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    昨日深夜一辆白色轿车冲破滨海公路护栏坠海，遇难司机确认为圣路加医院重症监护护士苏曼。
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-red-400 font-semibold">
                  <span>查看事故通报</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* News IPO */}
              <div
                onClick={() => handleNavigate('page_news_ipo')}
                className="bg-cyber-900 border border-blue-900/60 hover:border-blue-500 p-4 rounded-xl cursor-pointer transition-all group shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-bold">
                      全球财经快讯
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">2010-06-14</span>
                  </div>
                  <div className="font-bold text-sm text-blue-300 group-hover:underline">
                    财经快讯：天宇科技携手远景生命启动纳斯达克 IPO 冲刺
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    财务总监沈明远宣布 Chimera 获得突破性成果，估值预计超过 30 亿美元，强行掩盖神经毒性。
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-cyber-800 flex items-center justify-between text-xs text-blue-400 font-semibold">
                  <span>查阅财经报道</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. GENERAL SUBPAGE VIEW (with Top Breadcrumbs & Bottom Interconnected Links) */}
        {!searchResults && currentPage && (!isAtHome || (!isCh2 && currentPage.id !== 'page_portal') || (isCh2 && currentPage.id !== 'page_med_search')) && (
          <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
            {/* Top Breadcrumb & Return to Home Navigation */}
            <div className="flex items-center justify-between bg-cyber-900/60 border border-cyber-800 px-4 py-2 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  onClick={handleGoHome}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{isCh2 ? '圣路加医疗数据中心' : '天宇内网门户'}</span>
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300 truncate max-w-[260px] sm:max-w-md font-mono">
                  {currentPage.title}
                </span>
              </div>
              <button
                onClick={handleGoHome}
                className="text-slate-400 hover:text-white px-2.5 py-1 rounded bg-cyber-800 border border-cyber-700 text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回主页</span>
              </button>
            </div>

            {/* Document Article Card */}
            <div className="bg-cyber-900 border border-cyber-700/80 rounded-xl p-6 shadow-xl space-y-5">
              {/* Header */}
              <div className="border-b border-cyber-700 pb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                  <span className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 text-[10px] font-bold">
                    {currentPage.category.toUpperCase()} ARCHIVE
                  </span>
                  <span>{currentPage.date}</span>
                </div>
                <h1 className="text-lg font-bold text-white leading-snug">{currentPage.title}</h1>
                <div className="text-xs text-slate-400 mt-1 font-mono">发布单位: {currentPage.author}</div>
              </div>

              {/* Special View: SUB-0007 Patient Record */}
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
                          责任医师：<WordPickupTag word="梁绍辉" category="character" />（工号：
                          <WordPickupTag word="DOC-0109" category="timestamp" />）
                        </div>
                        <div>
                          管床护士：<WordPickupTag word="苏曼" category="character" />（工号：
                          <WordPickupTag word="NURSE-0322" category="timestamp" />）
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
                        [CLINICAL EEG TRACE &amp; FRAUDULENT NOTES]
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

              {/* Special View: CAND-2010-092 (Guan Yue) */}
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

              {/* Special View: Silence Agreement */}
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
                        [CONFIDENTIAL SETTLEMENT &amp; WAIVER AGREEMENT]
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        法务公文证实：受害者家属被{' '}
                        <WordPickupTag
                          word="强制签署保密与放弃追责协议"
                          category="action_motive"
                        />
                        ，财务总监 <WordPickupTag word="沈明远" category="character" /> 借此{' '}
                        <WordPickupTag word="侵吞专项补偿金" category="action_motive" />！
                      </div>
                      <div className="text-[11px] text-amber-300 font-mono">
                        ★ 点击可放大检视公章与签字条文
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Special View: Chen Profile Portrait Banner */}
              {currentPage.id === 'page_chen_profile' && (
                <div className="bg-cyber-950 p-4 rounded-lg border border-cyber-700 flex gap-4 items-center">
                  <img
                    src="./assets/portrait_chen.jpg"
                    alt="陈建国"
                    onClick={() => setActiveImageZoom('./assets/portrait_chen.jpg')}
                    className="w-24 h-32 object-cover rounded border border-cyan-500/60 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="font-bold text-white text-sm">陈建国 (Chen Jianguo)</div>
                    <div>职务：天宇科技研发副总裁 / 执行董事</div>
                    <div>
                      工号：<WordPickupTag word="EMP-0003" category="location_evidence" />
                    </div>
                    <div>主管：海外商务拓展与医疗数据计算平台</div>
                  </div>
                </div>
              )}

              {/* Special View: Security Alert CCTV Banner */}
              {currentPage.id === 'page_security_alert' && (
                <div className="bg-black/60 p-3 rounded-lg border border-amber-700/60 flex items-center gap-4">
                  <img
                    src="./assets/cctv_server_corridor.jpg"
                    alt="CCTV 监控抓拍"
                    onClick={() => setActiveImageZoom('./assets/cctv_server_corridor.jpg')}
                    className="w-36 h-24 object-cover rounded border border-amber-600 shadow cursor-pointer hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="text-amber-400 font-bold font-mono">[15F 机房走廊红外抓拍截图]</div>
                    <div>事发时段：2010-06-09 23:38 机房走廊独立抓拍画面</div>
                    <div className="text-[11px] text-amber-300 font-mono">★ 点击可放大查看监控细节</div>
                  </div>
                </div>
              )}

              {/* Table Data (Gate Logs / Shift Roster) */}
              {currentPage.tableData && (
                <div className="space-y-3 border-t border-cyber-800 pt-4">
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <span>系统记录明细流水</span>
                  </div>
                  <div className="overflow-x-auto border border-cyber-700 rounded-lg">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-cyber-800 text-slate-300 border-b border-cyber-700">
                        <tr>
                          {Object.keys(currentPage.tableData[0] || {}).map((header, idx) => (
                            <th key={idx} className="p-2.5 capitalize text-slate-300">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyber-800 bg-cyber-950">
                        {currentPage.tableData.map((row, i) => (
                          <tr key={i} className="hover:bg-cyber-900/60 transition-colors">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="p-2.5 text-slate-200">
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

              {/* Bottom Interconnected Systems & Related References */}
              <div className="border-t border-cyber-800 pt-5 space-y-3">
                <div className="text-xs font-bold text-slate-400 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>【关联内网系统与延伸档案】</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Chapter 1 Cross Links */}
                  {!isCh2 && currentPage.id === 'page_chen_profile' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_chimera')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            研发中心：奇美拉三期试验规范
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查看三期受试数据安全管控规则
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_access_log')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            安防系统：6月9日门禁出入流水
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            核对陈建国与林默当晚刷卡记录
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {!isCh2 && currentPage.id === 'page_chimera' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_chen_profile')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            高管专栏：副总裁陈建国档案
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            核查境外数据中继节点 IP
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_security_alert')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-amber-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-amber-300 group-hover:underline">
                            安保督察：雷暴夜机房异常通报
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查看 15 楼机房监控抓拍与事件调查
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {!isCh2 && currentPage.id === 'page_access_log' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_security_alert')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-amber-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-amber-300 group-hover:underline">
                            安保督察：雷暴夜机房异常通报
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            比对 23:35 刷卡不在场伪证与监控
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_chen_profile')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            高管专栏：副总裁陈建国档案
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查看 16 楼高管办公区与海外业务
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {!isCh2 && currentPage.id === 'page_security_alert' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_access_log')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            安防系统：6月9日门禁出入流水
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            核对 1 楼闸机刷卡时间流水
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_chimera')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            研发中心：奇美拉三期试验规范
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            核实 15 楼机房存放的数据包资产
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {/* Chapter 2 Cross Links */}
                  {isCh2 && currentPage.id === 'page_sub_0007' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_silence_agreement')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-red-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-red-300 group-hover:underline">
                            法务通报：SUB-0007 保密和解公函
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查看强制签署协议与补偿金平账记录
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_nurse_shift')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-emerald-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-emerald-300 group-hover:underline">
                            护士名录：ICU 护士排班档案
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查验管床护士苏曼工号与入职日期
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {isCh2 && currentPage.id === 'page_candidate_092' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_news_ipo')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-blue-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-blue-300 group-hover:underline">
                            财经快讯：天宇科技 30亿 IPO 冲刺
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            核实批示意见中的 IPO 上市计划
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_sub_0007')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            病历档案：07 号受试者赵岚
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            比对一期/二期临床实际毒理反应
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {isCh2 && currentPage.id === 'page_silence_agreement' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_news_ipo')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-blue-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-blue-300 group-hover:underline">
                            财经快讯：天宇科技 30亿 IPO 冲刺
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            核实沈明远操盘掩盖事故与上市动机
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_sub_0007')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            病历档案：07 号受试者赵岚
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            调阅受害者原始病程与脑电图
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {isCh2 && currentPage.id === 'page_nurse_shift' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_sub_0007')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-cyan-300 group-hover:underline">
                            病历档案：07 号受试者赵岚
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查看苏曼管床记录与责任医师梁绍辉
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_silence_agreement')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-red-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-red-300 group-hover:underline">
                            法务通报：SUB-0007 保密协议
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查看针对护士苏曼的行踪布控通报
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {isCh2 && currentPage.id === 'page_news_ipo' && (
                    <>
                      <button
                        onClick={() => handleNavigate('page_silence_agreement')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-red-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-red-300 group-hover:underline">
                            法务通报：SUB-0007 保密和解公函
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            查看沈明远截留专项补偿金的公函
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      </button>
                      <button
                        onClick={() => handleNavigate('page_candidate_092')}
                        className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-amber-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-amber-300 group-hover:underline">
                            候诊档案：关悦 CAND-2010-092
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            核实假药二期临床特批名单
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      </button>
                    </>
                  )}

                  {/* Return to Portal Home Link */}
                  <button
                    onClick={handleGoHome}
                    className="p-2.5 rounded-lg bg-cyber-950 hover:bg-cyber-800 border border-cyber-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-all flex items-center justify-between group sm:col-span-2"
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-slate-200">
                        返回 {isCh2 ? '圣路加医疗数据中心综合门户' : '天宇科技企业内网信息门户'}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* High-Resolution Evidence Image Modal Zoom */}
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
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-cyber-800 hover:bg-cyber-700 transition-colors"
              >
                关闭 [ESC]
              </button>
            </div>
            <img
              src={activeImageZoom}
              alt="Zoomed Evidence"
              className="max-h-[72vh] w-auto object-contain rounded border border-cyber-800 shadow-inner"
            />
          </div>
        </div>
      )}
    </div>
  );
};
