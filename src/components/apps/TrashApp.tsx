import React, { useState } from 'react';
import { soundService } from '../../services/soundService';
import { Trash2, FileText } from 'lucide-react';

const DELETED_FRAGMENTS = [
  {
    id: 'trash_1',
    title: '未发送便签_20100609_2130.txt',
    size: '340 B',
    date: '2010-06-09 21:30',
    content: `【林默未发送的内部警告便签】
如果陈建国继续强制要求开放奇美拉数据集的对外 API，我将直接向国家药监与网络安全督查局递交证据。
绝不能让患者的神经基因图谱变成他私人换取海外股权的筹码！
远端镜像服务已经开启，日志双向备份就绪。`,
  },
  {
    id: 'trash_2',
    title: 'sys_backup_script.sh.bak',
    size: '1.2 KB',
    date: '2010-06-08 17:00',
    content: `#!/bin/bash
# Lin Mo automated forensic daemon
# Synchronizes /logs/server_local.log to /logs/remote_mirror.bak securely
rsync -avz /logs/server_local.log /logs/remote_mirror.bak
echo "Forensic daemon active."`,
  },
];

export const TrashApp: React.FC = () => {
  const [selectedFrag, setSelectedFrag] = useState(DELETED_FRAGMENTS[0]);

  return (
    <div className="flex-1 flex overflow-hidden font-sans text-xs bg-cyber-950">
      <div className="w-56 bg-cyber-900 border-r border-cyber-700 p-2 space-y-1 select-none shrink-0">
        <div className="text-[11px] font-bold text-slate-400 p-1 flex items-center gap-1.5 font-mono">
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>已删除文件碎片 (2)</span>
        </div>

        {DELETED_FRAGMENTS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundService.playKeyClick();
              setSelectedFrag(item);
            }}
            className={`w-full p-2 rounded text-left flex items-start gap-2 transition-colors ${
              selectedFrag.id === item.id
                ? 'bg-cyber-800 text-cyan-200 border border-cyber-600'
                : 'text-slate-300 hover:bg-cyber-850'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="truncate">
              <div className="font-bold truncate text-[11px]">{item.title}</div>
              <div className="text-[10px] text-slate-500 font-mono">{item.size}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 bg-cyber-950 overflow-y-auto space-y-3 font-mono">
        <div className="border-b border-cyber-800 pb-2 flex justify-between items-center text-slate-400 text-xs">
          <span className="font-bold text-white">{selectedFrag.title}</span>
          <span className="text-[10px]">{selectedFrag.date}</span>
        </div>

        <div className="bg-cyber-900/60 p-4 rounded border border-cyber-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
          {selectedFrag.content}
        </div>
      </div>
    </div>
  );
};
