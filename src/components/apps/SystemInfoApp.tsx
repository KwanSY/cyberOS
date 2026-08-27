import { ShieldAlert, Cpu, Shield } from 'lucide-react';

export const SystemInfoApp: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-cyber-950 font-sans text-xs text-slate-200 overflow-y-auto space-y-6">
      <div className="flex items-center gap-4 bg-cyber-900 border border-cyber-700 p-4 rounded-lg">
        <div className="w-14 h-14 rounded-full bg-cyan-950 border-2 border-cyan-500 flex items-center justify-center text-cyan-300">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white font-mono">CyberOS 1.0 Forensic Suite</h2>
          <p className="text-slate-400 text-xs font-mono">Build 20100610 (Custom Electronic Forensic Edition)</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-800">
              WRITE-BLOCKER ACTIVE (只读保全)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="bg-cyber-900/70 p-4 rounded border border-cyber-800 space-y-2">
          <div className="font-bold text-cyan-300 flex items-center gap-2 pb-1 border-b border-cyber-800">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>取证专案元数据</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">案件编号:</span>
            <span className="text-amber-400 font-bold">CASE-20100610-01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">被调查主体:</span>
            <span className="text-slate-200">天宇科技·林默工作站</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">主审法医工号:</span>
            <span className="text-cyan-300">FA-9021</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">虚拟时间锚点:</span>
            <span className="text-slate-200">2010-06-10 09:30:00</span>
          </div>
        </div>

        <div className="bg-cyber-900/70 p-4 rounded border border-cyber-800 space-y-2">
          <div className="font-bold text-cyan-300 flex items-center gap-2 pb-1 border-b border-cyber-800">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>硬件与镜像状态</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">处理器:</span>
            <span className="text-slate-200">Intel Core 2 Quad Q9550</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">物理内存:</span>
            <span className="text-slate-200">4096 MB DDR2 ECC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">镜像哈希 (SHA256):</span>
            <span className="text-slate-400 text-[10px] truncate max-w-[140px]">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">镜像完整性校验:</span>
            <span className="text-emerald-400 font-bold">100% MATCH</span>
          </div>
        </div>
      </div>
    </div>
  );
};
