import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { soundService } from '../../services/soundService';
import { TextWithKeywords } from '../common/TextWithKeywords';
import {
  Inbox,
  FileEdit,
  Trash2,
  Paperclip,
  Search,
  Eye,
  Image as ImageIcon,
  Radio,
  Building,
} from 'lucide-react';

export const MailApp: React.FC = () => {
  const mails = useGameStore((s) => s.mails);
  const selectedMailId = useGameStore((s) => s.selectedMailId);
  const activeFolder = useGameStore((s) => s.activeMailFolder);
  const selectMail = useGameStore((s) => s.selectMail);
  const setActiveFolder = useGameStore((s) => s.setActiveMailFolder);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const currentMail = mails.find((m) => m.id === selectedMailId) || mails[0];

  const filteredMails = mails.filter((m) => {
    if (m.folder !== activeFolder) return false;
    if (!filterQuery) return true;
    return (
      m.subject.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.sender.toLowerCase().includes(filterQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  const unreadLeadsCount = mails.filter((m) => m.folder === 'leads' && !m.read).length;
  const unreadInboxCount = mails.filter((m) => m.folder === 'inbox' && !m.read).length;

  return (
    <div className="flex-1 flex overflow-hidden font-sans text-xs bg-cyber-950">
      {/* Sidebar Folders */}
      <div className="w-52 bg-cyber-900 border-r border-cyber-700/80 flex flex-col p-2 space-y-1 select-none shrink-0">
        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 font-mono flex items-center justify-between border-b border-cyber-800 pb-1.5 mb-1">
          <span>MAIL CHANNELS</span>
          <span className="text-[9px] bg-cyber-800 text-cyan-300 px-1 py-0.2 rounded">POP3/TLS</span>
        </div>

        {/* 1. 外部绝密专案通道 / 匿名线报 */}
        <div className="text-[10px] text-amber-400 font-mono px-2 pt-1 font-bold">
          [ 专案安全通道 ]
        </div>
        <button
          onClick={() => setActiveFolder('leads')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors ${
            activeFolder === 'leads'
              ? 'bg-amber-950/80 text-amber-200 font-bold border border-amber-600/70 shadow-sm'
              : 'text-slate-300 hover:bg-cyber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>外部绝密线报 (Zero)</span>
          </div>
          {unreadLeadsCount > 0 && (
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full animate-ping">
              {unreadLeadsCount}
            </span>
          )}
        </button>

        {/* 2. 林默企业内部邮箱 */}
        <div className="text-[10px] text-cyan-400 font-mono px-2 pt-2 font-bold">
          [ 林默工作站邮箱 ]
        </div>
        <button
          onClick={() => setActiveFolder('inbox')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors ${
            activeFolder === 'inbox'
              ? 'bg-blue-900/60 text-cyan-200 font-bold border border-blue-600/50 shadow-sm'
              : 'text-slate-300 hover:bg-cyber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Inbox className="w-3.5 h-3.5 text-cyan-400" />
            <span>工作收件箱 (Inbox)</span>
          </div>
          {unreadInboxCount > 0 && (
            <span className="bg-cyan-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
              {unreadInboxCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveFolder('drafts')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors ${
            activeFolder === 'drafts'
              ? 'bg-blue-900/60 text-cyan-200 font-bold border border-blue-600/50 shadow-sm'
              : 'text-slate-300 hover:bg-cyber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileEdit className="w-3.5 h-3.5 text-amber-400" />
            <span>本地草稿箱 (Drafts)</span>
          </div>
          <span className="text-slate-500 text-[10px]">1</span>
        </button>

        <button
          onClick={() => setActiveFolder('trash')}
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors ${
            activeFolder === 'trash'
              ? 'bg-blue-900/60 text-cyan-200 font-bold border border-blue-600/50 shadow-sm'
              : 'text-slate-300 hover:bg-cyber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>已删除邮件 (Trash)</span>
          </div>
        </button>

        <div className="mt-auto border-t border-cyber-800 pt-2 px-2 text-[10px] text-slate-500 font-mono space-y-0.5">
          <div className="flex items-center gap-1 text-slate-400">
            <Building className="w-3 h-3 text-cyan-400" />
            <span>lin_mo@tianyu-tech.com</span>
          </div>
          <div className="text-emerald-400/90 flex items-center gap-1 text-[9px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 审计只读连接已建立
          </div>
        </div>
      </div>

      {/* Middle Mail List */}
      <div className="w-72 bg-cyber-900/60 border-r border-cyber-800 flex flex-col shrink-0">
        {/* Search */}
        <div className="p-2 border-b border-cyber-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="搜索邮件..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-cyber-950 border border-cyber-700/80 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-cyber-800/60">
          {filteredMails.map((mail) => {
            const isSelected = mail.id === currentMail?.id;
            return (
              <div
                key={mail.id}
                onClick={() => selectMail(mail.id)}
                className={`p-3 cursor-pointer transition-colors relative ${
                  isSelected
                    ? 'bg-cyber-800/90 border-l-4 border-cyan-400'
                    : 'hover:bg-cyber-800/40 bg-cyber-950/40'
                }`}
              >
                {!mail.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400" />
                )}
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span
                    className={`font-semibold truncate max-w-[140px] ${
                      !mail.read ? 'text-cyan-300 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {mail.senderName}
                  </span>
                  <span className="text-slate-500 text-[10px] font-mono shrink-0">
                    {mail.date.split(' ')[0]}
                  </span>
                </div>
                <div
                  className={`text-xs truncate ${
                    !mail.read ? 'text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  {mail.subject}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {mail.content.replace(/\[\[|\]\]/g, '')}
                </div>
                {mail.attachments && mail.attachments.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-cyan-400 font-mono">
                    <Paperclip className="w-3 h-3" />
                    <span>附件 ({mail.attachments.length})</span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredMails.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-xs">
              该文件夹下暂无邮件
            </div>
          )}
        </div>
      </div>

      {/* Right Mail Content Body */}
      <div className="flex-1 bg-cyber-950 flex flex-col overflow-y-auto">
        {currentMail ? (
          <div className="p-5 space-y-4 max-w-3xl">
            {/* Subject Header */}
            <div className="border-b border-cyber-700/80 pb-3">
              <div className="flex items-center gap-2 mb-1.5">
                {currentMail.folder === 'leads' && (
                  <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    ★ 外部专案直递通道
                  </span>
                )}
                {currentMail.folder === 'inbox' && (
                  <span className="bg-blue-950 text-blue-300 border border-blue-700 px-2 py-0.5 rounded text-[10px] font-mono">
                    天宇科技内网邮件
                  </span>
                )}
                {currentMail.folder === 'drafts' && (
                  <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                    本地未发送草稿
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-white mb-2">
                {currentMail.subject}
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
                <div className="space-y-0.5">
                  <div>
                    <span className="text-slate-500">发件人：</span>
                    <span className="text-cyan-300 font-semibold">{currentMail.senderName}</span>{' '}
                    <span className="text-slate-500">&lt;{currentMail.sender}&gt;</span>
                  </div>
                  <div>
                    <span className="text-slate-500">接收端：</span>
                    <span className="text-slate-300">
                      {currentMail.folder === 'leads' ? 'FA-9021 专案工作站' : 'lin_mo@tianyu-tech.com'}
                    </span>
                  </div>
                </div>
                <div className="text-slate-400 text-[11px]">{currentMail.date}</div>
              </div>
            </div>

            {/* Email Text with interactive word pickup */}
            <div className="bg-cyber-900/60 p-4 rounded-lg border border-cyber-800 text-slate-200 text-sm leading-relaxed">
              <TextWithKeywords text={currentMail.content} />
            </div>

            {/* Attachments Section */}
            {currentMail.attachments && currentMail.attachments.length > 0 && (
              <div className="space-y-2 border-t border-cyber-800 pt-3">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                  <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                  <span>邮件附件 ({currentMail.attachments.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentMail.attachments.map((att, i) => (
                    <div
                      key={i}
                      className="bg-cyber-900 border border-cyber-700 rounded-lg p-3 flex items-center gap-3 hover:border-cyan-500 transition-all group"
                    >
                      <div className="w-12 h-12 rounded bg-cyber-950 flex items-center justify-center shrink-0 overflow-hidden border border-cyber-800">
                        {att.type === 'image' ? (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => {
                              soundService.playKeyClick();
                              setPreviewImage(att.url);
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-cyan-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-mono font-bold text-xs text-slate-200 truncate">
                          {att.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{att.size}</div>
                        <button
                          onClick={() => {
                            soundService.playKeyClick();
                            setPreviewImage(att.url);
                          }}
                          className="mt-1 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> 查看物证照片
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            请选择一封邮件进行审计
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cyber-900 p-3 rounded-lg border-2 border-cyan-500/80 shadow-2xl max-w-2xl max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center pb-2 text-xs font-mono text-cyan-300">
              <span>物证照片查看器 - Lucky</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-cyber-800"
              >
                关闭 [ESC]
              </button>
            </div>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[70vh] w-auto object-contain rounded border border-cyber-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
