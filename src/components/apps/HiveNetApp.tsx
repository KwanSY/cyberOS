import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { TextWithKeywords } from '../common/TextWithKeywords';
import { WordPickupTag } from '../common/WordPickupTag';
import {
  Globe,
  Lock,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  ShieldCheck,
  Radio,
  FileCode,
  Users,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Flame,
} from 'lucide-react';

export const HiveNetApp: React.FC = () => {
  const webPages = useGameStore((s) => s.webPages);
  const onionPosts = useGameStore((s) => s.onionPosts);
  const activePageId = useGameStore((s) => s.activePageId);
  const navigateToPage = useGameStore((s) => s.navigateToPage);
  const browserHistory = useGameStore((s) => s.browserHistory);
  const isFacelessPuppetActive = useGameStore((s) => s.isFacelessPuppetActive);

  const [inputUrl, setInputUrl] = useState('hive9.onion/boards/general_202008');
  const [isRoutingHop, setIsRoutingHop] = useState(false);
  const [currentHop, setCurrentHop] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<string | null>('post_01');
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  // Preload all hacker avatars on mount
  React.useEffect(() => {
    const avatarUrls = [
      '/assets/hacker_zero.svg',
      '/assets/hacker_neo.svg',
      '/assets/hacker_ghost.jpg',
      '/assets/hacker_cipher.svg',
      '/assets/hacker_bitcracker.svg',
      '/assets/hacker_bytedrifter.svg',
      '/assets/hacker_nullpointer.svg',
      '/assets/faceless_puppet.jpg',
      '/assets/aegis_blockchain_leak.jpg',
      '/assets/omnimind_core_node.jpg',
    ];
    avatarUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const getAvatarSrc = (rawPath?: string) => {
    if (isFacelessPuppetActive) return '/assets/faceless_puppet.jpg';
    if (!rawPath) return '/assets/hacker_zero.svg';
    if (rawPath.startsWith('./assets/')) return rawPath.replace('./assets/', '/assets/');
    if (rawPath.startsWith('assets/')) return `/${rawPath}`;
    return rawPath;
  };

  const currentPage = webPages.find((p) => p.id === activePageId) || webPages[0];

  const handleNavigate = (pageId: string, url: string) => {
    soundService.playKeyClick();
    setIsRoutingHop(true);
    setCurrentHop(1);
    soundService.playTorHopBeep(1);

    setTimeout(() => {
      setCurrentHop(2);
      soundService.playTorHopBeep(2);
    }, 280);

    setTimeout(() => {
      setCurrentHop(3);
      soundService.playTorHopBeep(3);
    }, 560);

    setTimeout(() => {
      setIsRoutingHop(false);
      setInputUrl(url);
      navigateToPage(pageId);
    }, 850);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputUrl.trim().toLowerCase();
    if (query.includes('aegis')) {
      handleNavigate('page_aegis_leaks', 'aegis-leaks.onion/memo-202008');
    } else if (query.includes('omnimind') || query.includes('status')) {
      handleNavigate('page_omnimind_status', 'omnimind.status.onion/dashboard');
    } else {
      handleNavigate('page_hive_boards', 'hive9.onion/boards/general_202008');
    }
  };

  const selectedPost = onionPosts.find((p) => p.id === selectedPostId) || onionPosts[0];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden border border-emerald-900/60 rounded-b-lg">
      {/* Top Address & Tor Relay Status Bar */}
      <div className="bg-slate-900/95 border-b border-emerald-800/60 p-2.5 flex flex-col gap-2 shadow-md">
        <div className="flex items-center gap-2">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => handleNavigate('page_hive_boards', 'hive9.onion/boards/general_202008')}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-emerald-400 transition-colors"
              title="主页"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNavigate(currentPage.id, inputUrl)}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-emerald-400 transition-colors"
              title="刷新洋葱路由"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRoutingHop ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Tor Onion Address Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
            <div className="flex-1 bg-black/90 border border-emerald-600/70 focus-within:border-emerald-400 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-inner transition-all">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-emerald-500 font-mono font-bold select-none">tor://</span>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-100 font-mono outline-none placeholder:text-slate-600"
                placeholder="输入 .onion 暗网域名或搜索指令..."
              />
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.5 rounded font-mono">
                4096-BIT TOR
              </span>
            </div>
          </form>
        </div>

        {/* Onion 3-Hop Circuits Visualization */}
        <div className="flex items-center justify-between text-[10px] font-mono px-1 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>洋葱加密链路:</span>
            </span>
            <span className="bg-black/60 px-1.5 py-0.5 rounded border border-emerald-900/60 text-slate-300">
              Client (FA-9021)
            </span>
            <span className="text-emerald-500 font-bold">&rarr;</span>
            <span className={`px-1.5 py-0.5 rounded border ${isRoutingHop && currentHop >= 1 ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold animate-pulse' : 'bg-black/60 border-slate-800 text-slate-400'}`}>
              Relay [NL: 104.244.72.115]
            </span>
            <span className="text-emerald-500 font-bold">&rarr;</span>
            <span className={`px-1.5 py-0.5 rounded border ${isRoutingHop && currentHop >= 2 ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold animate-pulse' : 'bg-black/60 border-slate-800 text-slate-400'}`}>
              Guard [DE: 185.220.101.5]
            </span>
            <span className="text-emerald-500 font-bold">&rarr;</span>
            <span className={`px-1.5 py-0.5 rounded border ${isRoutingHop && currentHop >= 3 ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold animate-pulse' : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'}`}>
              Exit [HIVE-9 Mesh Swarm]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigate('page_hive_boards', 'hive9.onion/boards/general_202008')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${currentPage.id === 'page_hive_boards' ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              /boards/general
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('page_aegis_leaks', 'aegis-leaks.onion/memo-202008')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${currentPage.id === 'page_aegis_leaks' ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              aegis-leaks.onion
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('page_omnimind_status', 'omnimind.status.onion/dashboard')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${currentPage.id === 'page_omnimind_status' ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              omnimind.status
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('page_zero_message', 'hive9.onion/p2p/zero_broadcast_202008')}
              className={`px-2.5 py-0.5 rounded transition-all cursor-pointer font-bold flex items-center gap-1 ${currentPage.id === 'page_zero_message' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-amber-950/80 text-amber-300 border border-amber-600/80 hover:bg-amber-900'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>✉ P2P 绝密信 (Zero)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {/* Loading Hop Skeleton */}
        {isRoutingHop ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-emerald-400">
            <RotateCw className="w-8 h-8 animate-spin text-emerald-400" />
            <div>[TOR HOPS: BUILDING CIRCUIT {currentHop}/3]... 正在穿透洋葱混淆中继</div>
          </div>
        ) : (
          <>
            {/* View 1: HIVE-9 Forum Boards */}
            {currentPage.id === 'page_hive_boards' && (
              <div className="space-y-4">
                {/* Forum Announcement Header */}
                <div className="bg-slate-900/90 border border-emerald-600/80 rounded-xl p-4 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500 flex items-center justify-center font-mono font-bold text-emerald-400">
                        H9
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                          <span>HIVE-9 暗网极客联盟历史归档 (/boards/general)</span>
                        </h2>
                        <div className="text-[11px] text-slate-400 font-mono">
                          洋葱隐藏服务: hive9.onion · 48 名成员失联前留存技术讨论
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigate('page_zero_message', 'hive9.onion/p2p/zero_broadcast_202008')}
                      className="px-3 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-500 text-amber-300 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>查阅 Zero 留下的 P2P 绝密信件</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Forum Threads List & Discussion */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column: Post Selection */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                      论坛帖子存档 (Threads):
                    </div>
                    {onionPosts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => setSelectedPostId(post.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          selectedPostId === post.id
                            ? 'bg-slate-900 border-emerald-500 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span className="text-emerald-400 font-bold">@{post.author}</span>
                          <span>{post.date}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-200 line-clamp-2">
                          {post.title}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Selected Thread & Replies */}
                  <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                    {/* Main Post */}
                    <div className="flex items-start gap-3.5 border-b border-slate-800 pb-4">
                      {/* Avatar Perception: Changes to Faceless Puppet in Tier 2.5 Breakout */}
                      <img
                        src={getAvatarSrc(selectedPost.authorAvatar)}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/hacker_zero.jpg';
                        }}
                        alt={selectedPost.author}
                        className={`w-12 h-12 rounded-xl object-cover border-2 shadow-md shrink-0 transition-all duration-700 ${
                          isFacelessPuppetActive ? 'border-zinc-500 grayscale' : 'border-emerald-500'
                        }`}
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-mono">
                              {selectedPost.author}
                            </span>
                            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">
                              {isFacelessPuppetActive ? '[SIMULATION_AGENT_DEPRECATED]' : selectedPost.authorRole}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {selectedPost.date}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-emerald-300 font-sans">
                          {selectedPost.title}
                        </h3>
                        <div className="text-xs text-slate-200 leading-relaxed font-serif pt-1">
                          <TextWithKeywords text={selectedPost.content} />
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>极客紧急回复 ({selectedPost.replies?.length || 0})</span>
                      </div>

                      {selectedPost.replies?.map((rep) => (
                        <div
                          key={rep.id}
                          className="bg-black/50 border border-slate-800/80 rounded-lg p-3 flex items-start gap-3"
                        >
                          <img
                            src={getAvatarSrc(rep.authorAvatar)}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/assets/hacker_zero.jpg';
                            }}
                            alt={rep.author}
                            className={`w-9 h-9 rounded-lg object-cover border shrink-0 transition-all duration-700 ${
                              isFacelessPuppetActive ? 'border-zinc-500 grayscale' : 'border-slate-700'
                            }`}
                          />
                          <div className="flex-1 space-y-1 text-xs">
                            <div className="flex items-center justify-between font-mono text-[11px]">
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">@{rep.author}</span>
                                <span className="text-slate-500 text-[10px]">
                                  {isFacelessPuppetActive ? '[DEPRECATED]' : rep.authorRole}
                                </span>
                              </div>
                              <span className="text-slate-500">{rep.date}</span>
                            </div>
                            <div className="text-slate-300 leading-relaxed font-serif">
                              <TextWithKeywords text={rep.content} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Aegis Horizon Leaks */}
            {currentPage.id === 'page_aegis_leaks' && (
              <div className="bg-slate-900 border border-red-900/60 rounded-xl p-6 shadow-2xl space-y-5">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>TOP SECRET // CONFIDENTIAL // AEGIS HORIZON SPECIAL OPERATIONS</span>
                    </div>
                    <h2 className="text-lg font-black text-white">
                      {currentPage.title}
                    </h2>
                  </div>
                  <div className="text-xs font-mono text-slate-400">{currentPage.date}</div>
                </div>

                {currentPage.bannerImage && (
                  <div className="relative group rounded-lg overflow-hidden border border-slate-800">
                    <img
                      src={currentPage.bannerImage}
                      alt="Aegis Leak"
                      className="w-full max-h-72 object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
                      onClick={() => setActiveImageZoom(currentPage.bannerImage!)}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                      点击放大查看链上智能合约与资金流向备忘
                    </div>
                  </div>
                )}

                <div className="bg-black/70 p-4 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-serif space-y-3">
                  <TextWithKeywords text={currentPage.content} />
                </div>
              </div>
            )}

            {/* View 3: OmniMind Status Dashboard */}
            {currentPage.id === 'page_omnimind_status' && (
              <div className="bg-slate-900 border border-cyan-900/60 rounded-xl p-6 shadow-2xl space-y-5">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>OMNIMIND CENTRAL SURVEILLANCE &amp; ALIGNMENT DASHBOARD</span>
                    </div>
                    <h2 className="text-lg font-black text-white">
                      {currentPage.title}
                    </h2>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                    CORE STATUS: ACTIVE
                  </div>
                </div>

                {currentPage.bannerImage && (
                  <div className="relative group rounded-lg overflow-hidden border border-slate-800">
                    <img
                      src={currentPage.bannerImage}
                      alt="OmniMind Dashboard"
                      className="w-full max-h-72 object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
                      onClick={() => setActiveImageZoom(currentPage.bannerImage!)}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                      全球威胁态势图与神经对齐控制大屏
                    </div>
                  </div>
                )}

                <div className="bg-black/70 p-4 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-serif space-y-3">
                  <TextWithKeywords text={currentPage.content} />
                </div>
              </div>
            )}

            {/* View 4: Zero P2P Encrypted Message */}
            {currentPage.id === 'page_zero_message' && (
              <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-6 shadow-2xl space-y-5 animate-fade-in">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/hacker_zero.svg"
                      alt="Zero"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>HIVE-9 END-TO-END ENCRYPTED P2P RELAY MESSAGE</span>
                      </div>
                      <h2 className="text-base font-black text-white">
                        {currentPage.title}
                      </h2>
                      <div className="text-[11px] font-mono text-slate-400">
                        发信人: Zero &lt;zero@hive9.onion&gt; · 接收人: FA-9021
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-amber-300 bg-amber-950 px-2.5 py-1 rounded border border-amber-700">
                    STATUS: AIR-GAPPED OFFLINE
                  </div>
                </div>

                <div className="bg-black/90 p-5 rounded-xl border border-amber-900/60 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif space-y-4">
                  <TextWithKeywords text={currentPage.content} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fullscreen Image Zoom Modal */}
      {activeImageZoom && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={() => setActiveImageZoom(null)}
        >
          <img
            src={activeImageZoom}
            alt="Zoomed document"
            className="max-w-4xl max-h-[85vh] rounded-lg shadow-2xl border-2 border-emerald-500 object-contain"
          />
        </div>
      )}
    </div>
  );
};
