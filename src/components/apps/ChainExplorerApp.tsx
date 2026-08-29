import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { WordPickupTag } from '../common/WordPickupTag';
import {
  Coins,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Copy,
  Layers,
  Database,
  Flame,
  AlertTriangle,
} from 'lucide-react';

export const ChainExplorerApp: React.FC = () => {
  const blockchain = useGameStore((s) => s.blockchain);
  const addWord = useGameStore((s) => s.addWord);

  const [searchAddr, setSearchAddr] = useState('0x7f9a8820c0de');
  const [selectedTxHash, setSelectedTxHash] = useState<string | null>(blockchain.transactions[0]?.txHash || null);

  const handleCopy = (text: string) => {
    soundService.playCardSnap();
    navigator.clipboard.writeText(text);
    addWord(text, 'timestamp');
  };

  const selectedTx = blockchain.transactions.find((tx) => tx.txHash === selectedTxHash) || blockchain.transactions[0];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden border border-emerald-900/60 rounded-b-lg">
      {/* Header & Search Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/80 flex items-center justify-center text-amber-400 shadow-md">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white">ChainExplorer (以太坊主网 &amp; 离岸算力信托)</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                BLOCK #10654210 (FINALIZED)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              智能合约状态审计与自动化节点清零交易穿透
            </div>
          </div>
        </div>

        {/* Contract Search Form */}
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchAddr}
            onChange={(e) => setSearchAddr(e.target.value)}
            placeholder="查询智能合约地址..."
            className="w-full bg-black/80 border border-slate-700 focus:border-amber-500 rounded-lg pl-8 pr-3 py-1 text-xs text-amber-300 outline-none font-mono placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950">
        {/* Contract Summary Card */}
        <div className="bg-slate-900/90 border border-amber-500/60 rounded-xl p-5 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>SMART CONTRACT OVERVIEW</span>
              </div>
              <h2 className="text-base font-black text-white font-mono flex items-center gap-2">
                <span>{blockchain.contractName}</span>
                <span className="text-xs bg-black px-2 py-0.5 rounded text-amber-300 border border-amber-900">
                  {blockchain.contractAddress}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(blockchain.contractAddress)}
                className="px-3 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-600 text-amber-300 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="提取合约地址入词库"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>拾取合约地址</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-black/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">设立资本机构 (Owner)</div>
              <div className="text-amber-300 font-bold">
                <WordPickupTag word="Aegis Horizon" />
              </div>
              <div className="text-[10px] text-slate-500">Cayman Biotech Trust Ltd.</div>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">链上悬赏资金池 (Balance)</div>
              <div className="text-emerald-400 font-black text-base">{blockchain.balance}</div>
              <div className="text-[10px] text-slate-500">≈ $180,000,000 USD</div>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">清零执行机制 (Mechanism)</div>
              <div className="text-red-400 font-bold">
                <WordPickupTag word="静默数字清洗" />
              </div>
              <div className="text-[10px] text-slate-500">Auto-purge node upon detection</div>
            </div>
          </div>
        </div>

        {/* Transactions Table & Inspector */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>智能合约链上交易记录 (Transactions - {blockchain.transactions.length})</span>
            </div>
            <span className="text-[11px] text-slate-500">ALL TXS VERIFIED BY MERKLE PROOF</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 bg-black/40">
                  <th className="p-2.5">TX HASH</th>
                  <th className="p-2.5">METHOD / ACTION</th>
                  <th className="p-2.5">FROM</th>
                  <th className="p-2.5">TO</th>
                  <th className="p-2.5">VALUE</th>
                  <th className="p-2.5 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {blockchain.transactions.map((tx) => {
                  const isPurge = tx.method.includes('purgeNode');
                  const isSelected = tx.txHash === selectedTxHash;
                  return (
                    <tr
                      key={tx.txHash}
                      onClick={() => {
                        soundService.playKeyClick();
                        setSelectedTxHash(tx.txHash);
                      }}
                      className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-800/80 font-bold' : ''
                      }`}
                    >
                      <td className="p-2.5 text-amber-400 underline">{tx.txHash}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                            isPurge
                              ? 'bg-red-950 text-red-300 border-red-800'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {tx.method}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-300">{tx.from}</td>
                      <td className="p-2.5 text-slate-400">{tx.to}</td>
                      <td className="p-2.5 text-emerald-400 font-bold">{tx.value}</td>
                      <td className="p-2.5 text-right">
                        <span className="text-emerald-400 inline-flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SUCCESS</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Transaction Inspector Callout */}
        {selectedTx && (
          <div className="bg-black/90 p-4 rounded-xl border border-red-900/60 font-mono text-xs space-y-2">
            <div className="text-red-400 font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              <span>[TRANSACTION TRACE]: {selectedTx.txHash}</span>
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              ● 调用方法: <strong className="text-red-300">{selectedTx.method}</strong>
              <br />
              ● 详情信息: {selectedTx.details || '自动划扣赏金并强制注销洋葱公钥。'}
              <br />
              ● 目标执行结果: 对应黑客节点全网数字资产与身份即刻进入 <strong className="text-amber-300">0x0000...DEAD (不可逆永久销毁)</strong>。
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
