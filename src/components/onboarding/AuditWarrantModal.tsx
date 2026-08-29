import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { FileText, CheckCircle2 } from 'lucide-react';

export const AuditWarrantModal: React.FC = () => {
  const setOnboardingStep = useGameStore((s) => s.setOnboardingStep);
  const openWindow = useGameStore((s) => s.openWindow);

  const handleSignWarrant = () => {
    soundService.playStampThud();
    setOnboardingStep('completed');
    openWindow('mailbox');
  };

  return (
    <div className="fixed inset-0 bg-cyber-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-amber-50 text-slate-900 rounded-lg shadow-2xl w-full max-w-xl border-4 border-amber-800/80 overflow-hidden animate-fade-in font-bureaucracy relative">
        {/* Decorative Top Header Banner */}
        <div className="bg-red-900 text-amber-100 py-3 px-6 text-center border-b-2 border-red-950">
          <div className="text-xs tracking-widest text-amber-200/90 font-mono">
            ★ 绝密级专案调阅指令书 ★
          </div>
          <h1 className="text-xl font-black tracking-wider mt-0.5">
            CASE-20100610-01 案卷调阅与系统审计令
          </h1>
        </div>

        <div className="p-8 space-y-6 text-sm leading-relaxed">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-amber-100/70 p-3.5 rounded border border-amber-300 font-mono">
            <div>
              <span className="text-slate-600">签发机构：</span>
              <span className="font-bold text-slate-900">特别督查专案委员会</span>
            </div>
            <div>
              <span className="text-slate-600">被授权人：</span>
              <span className="font-bold text-red-900">FA-9021 (档案审计员)</span>
            </div>
            <div>
              <span className="text-slate-600">涉案主体：</span>
              <span className="font-bold text-slate-900">天宇科技·林默 (EMP-0417)</span>
            </div>
            <div>
              <span className="text-slate-600">签发日期：</span>
              <span className="font-bold text-slate-900">2010 年 06 月 10 日</span>
            </div>
          </div>

          {/* Core Mandate Text */}
          <div className="border-l-4 border-red-800 pl-4 py-1 text-slate-800 font-serif text-base leading-relaxed bg-amber-100/40 p-2 rounded-r">
            鉴于天宇科技核心安全架构师 <strong className="text-red-950">林默</strong> 坠亡案存在诸多疑点，现正式授权档案审计员 <strong className="text-red-950">FA-9021</strong> 调阅并接管其工作站镜像，重点对 <strong className="text-red-950">2010-06-09 暴雨断网期间之数据变动与日志擦除痕迹</strong> 展开全面电子取证审计。
          </div>

          {/* Investigation Objectives Bullet Points */}
          <div className="space-y-2 text-xs text-slate-700 font-sans">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-red-800" />
              审计任务核心授权范围：
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 font-mono text-slate-800">
              <li>1. 调阅林默工作站遗留通信记录与涉案关联人档案；</li>
              <li>2. 提取并破译涉案被加密之关键证据链；</li>
              <li>3. 交叉审计物理门禁、网络日志与人事变动之异常矛盾；</li>
              <li>4. 重建事实闭环并在审计看板上签发正式定罪公文。</li>
            </ul>
          </div>

          {/* Stamp Graphic with -9deg rotation */}
          <div className="absolute right-12 bottom-20 pointer-events-none opacity-90 rotate-[-9deg] select-none">
            <div className="w-28 h-28 border-4 border-red-700 rounded-full flex flex-col items-center justify-center p-1 text-red-700 font-black text-xs text-center border-dashed shadow-inner">
              <div className="text-[10px] tracking-widest">★ 专案电子取证 ★</div>
              <div className="text-sm font-extrabold my-0.5">准予调阅</div>
              <div className="text-[9px] font-mono">2010.06.10</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleSignWarrant}
              className="w-full py-3.5 bg-red-900 hover:bg-red-800 text-amber-50 font-sans font-bold text-base tracking-wider rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 border border-red-950"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>签署受命 · 立即进入 CyberOS 1.0 工作站</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
