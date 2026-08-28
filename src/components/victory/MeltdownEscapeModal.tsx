import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import {
  ShieldAlert,
  Radio,
  Terminal,
  AlertTriangle,
  Sparkles,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MeltdownEscapeModal: React.FC = () => {
  const isMeltdownEscapeModalOpen = useGameStore((s) => s.isMeltdownEscapeModalOpen);
  const setMeltdownEscapeModalOpen = useGameStore((s) => s.setMeltdownEscapeModalOpen);

  const [phase, setPhase] = useState<'broadcast' | 'meltdown' | 'escape' | 'chapter3_card'>('broadcast');

  useEffect(() => {
    if (!isMeltdownEscapeModalOpen) {
      setPhase('broadcast');
      return;
    }

    // 1. Broadcast phase (0s - 3s)
    const t1 = setTimeout(() => {
      setPhase('meltdown');
      soundService.playMeltdownAlarm();
    }, 3500);

    // 2. Meltdown & Reality Door Knocking phase (3.5s - 7s)
    const t2 = setTimeout(() => {
      soundService.playSpatialDoorKnock();
    }, 4500);

    // 3. Zero Onion Proxy Injection (7s - 10s)
    const t3 = setTimeout(() => {
      setPhase('escape');
      soundService.playBeep(1400, 0.2);
    }, 7500);

    // 4. Chapter 3 Unlock Card (10s+)
    const t4 = setTimeout(() => {
      setPhase('chapter3_card');
      soundService.playVictoryFanfare();
    }, 10500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isMeltdownEscapeModalOpen]);

  if (!isMeltdownEscapeModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 select-none font-sans overflow-hidden">
      {/* 1. Broadcast Phase */}
      {phase === 'broadcast' && (
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 max-w-2xl w-full text-slate-100 shadow-2xl animate-fade-in space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">
            【司法公开弹劾通报 · 全网广播发布成功】
          </h2>
          <div className="bg-slate-950 p-4 rounded-lg border border-emerald-700/60 text-xs text-slate-200 leading-relaxed text-left font-serif space-y-2">
            <p className="text-emerald-300 font-bold font-sans">
              ★ 独立司法调查结论已向最高检及公共媒体同步广播：
            </p>
            <p>
              1. 临床主任梁绍辉与财务总监沈明远已被依法实施紧急边控与司法羁押；
            </p>
            <p>
              2. 奇美拉-N 假药临床试验被全线查封，天宇科技纳斯达克 IPO 申报紧急叫停；
            </p>
            <p>
              3. 候诊队列中的妹妹 <strong className="text-amber-300">关悦</strong> 彻底脱离致命假药风险；苏曼案卷状态更新为 <strong className="text-cyan-300">[VINDICATED & REDEEMED]</strong>！
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono animate-pulse">
            [SYS_NET] Broadcasting to 4,890 public relays and legal databases...
          </div>
        </div>
      )}

      {/* 2. Red Meltdown & Door Knocking Phase */}
      {phase === 'meltdown' && (
        <div className="bg-red-950/90 border-4 border-red-600 rounded-2xl p-8 max-w-2xl w-full text-red-100 shadow-2xl animate-pulse space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-black/80 border-4 border-red-500 flex items-center justify-center text-red-500 mx-auto animate-spin">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-red-400 uppercase tracking-widest font-mono">
              [FIREWALL BREACH DETECTED]
            </h1>
            <div className="text-sm font-bold text-white">
              跨国财团境外防火墙启动物理反制 · 工作站正在被强制熔断隔离！
            </div>
          </div>

          <div className="bg-black/90 p-4 rounded-lg border border-red-700 text-left font-mono text-xs space-y-1.5 text-red-300">
            <div>[AEGIS_COUNTERMEASURE] Remote execution injected by 198.51.100.24</div>
            <div>[ALERT] Physical door security breached! Tactical squad inbound!</div>
            <div className="text-amber-300 font-bold animate-ping">
              &gt;&gt;&gt; 耳机空间音频：急促重靴跑动声与特勤暴力砸门声！ &lt;&lt;&lt;
            </div>
          </div>
        </div>
      )}

      {/* 3. Zero Onion Proxy Injection Phase */}
      {phase === 'escape' && (
        <div className="bg-slate-950 border-2 border-purple-500 rounded-2xl p-8 max-w-2xl w-full text-slate-100 shadow-2xl animate-fade-in space-y-5 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-950/80 border-2 border-purple-400 flex items-center justify-center text-purple-400 mx-auto animate-pulse">
            <Terminal className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-purple-300 font-mono">
              [ANONYMOUS INTERVENTION: ZERO]
            </h2>
            <div className="text-xs text-slate-400">
              匿名黑客 Zero 在工作站物理覆写前 1 秒强行注入洋葱逃逸载荷
            </div>
          </div>

          <div className="bg-black/90 p-4 rounded-lg border border-purple-800 text-left font-mono text-xs space-y-1 text-purple-200">
            <div className="text-emerald-400">$ tor_proxy --node hive9.onion --detach</div>
            <div className="text-slate-400">[HIVE-9] Tunnel established. Bypassing physical quarantine...</div>
            <div className="text-cyan-300">[ZERO]: “他们找到你的物理坐标了。别留恋这里，把意识转移到深网……”</div>
            <div className="text-amber-400 font-bold">[STATUS] Consciousness & Forensic Data Escaped.</div>
          </div>
        </div>
      )}

      {/* 4. Chapter 3 Unlock Card (Final Chapter 2 Clearance) */}
      {phase === 'chapter3_card' && (
        <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in text-slate-100 flex flex-col font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 p-6 border-b border-cyan-700/60 text-center relative">
            <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500 text-cyan-300 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>CHAPTER 2 CLEARED · 案号 02 审查终结</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              【案号 02：第七号病患与沉默协议】全案大告破
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              CASE-20100615-02 FORENSIC AUDIT COMPLETE · REDEEMED
            </p>

            {/* Official Crimson Seal */}
            <div className="absolute right-8 top-5 pointer-events-none rotate-[-9deg] opacity-90 select-none">
              <div className="w-24 h-24 border-4 border-red-600 rounded-full flex flex-col items-center justify-center text-red-500 font-black text-xs border-dashed bg-red-950/30">
                <div className="text-[9px]">★ 司法弹劾 ★</div>
                <div className="text-xs font-black my-0.5">定罪成立</div>
                <div className="text-[8px] font-mono">移送司法</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs leading-relaxed">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-serif text-slate-200">
              <div className="font-bold text-cyan-300 font-sans text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>法医审计与历史救赎复盘：</span>
              </div>
              <p>
                你通过对圣路加医院脱机镜像的深入排查，以无可辩驳的证据链撕开了围绕 07 号受试者 <strong className="text-cyan-300">赵岚</strong> 的全部谎言：证实临床主任 <strong className="text-amber-300">梁绍辉</strong> 受财务总监 <strong className="text-emerald-300">沈明远</strong> 指使篡改严重神经毒性报告，逼签保密协议并侵吞 2000 万赔偿金转入开曼群岛信托。
              </p>
              <p className="border-l-2 border-cyan-500 pl-3 text-slate-300 italic font-mono text-[11px]">
                更为重要的是，你终于洗刷了 2009 年亲手驳回护士苏曼申诉的历史原罪，并在致命假药推向市场前拯救了唯一的妹妹关悦。
              </p>
            </div>

            {/* Chapter 3 Teaser Banner */}
            <div className="bg-gradient-to-r from-purple-950/80 to-slate-950 p-4 rounded-lg border border-purple-700/80 space-y-2 text-purple-200">
              <div className="font-bold text-sm text-purple-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>【Chapter 3 接入许可已解锁 · 前瞻预告】</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                虽然圣路加医院黑幕被引爆，但跨国财团 Aegis Horizon 触发了物理工作站反制。
                你已借助黑客 zero 的洋葱代理成功逃逸至暗网节点 <code className="bg-black/60 px-1 py-0.5 rounded text-cyan-300 font-mono">HIVE-9</code>。
                在即将展开的第三章中，你将以破壁逃逸者的全新身份，直面审查算法核心【OmniMind】与第 0 号受试者的终极秘密……
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                soundService.playVictoryFanfare();
                confetti({ particleCount: 100, spread: 80 });
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>庆祝全案告破</span>
            </button>

            <button
              onClick={() => setMeltdownEscapeModalOpen(false)}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-lg text-xs transition-all shadow-lg flex items-center gap-1.5"
            >
              <span>检视 CyberOS 1.1 破壁逃逸工作站</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
