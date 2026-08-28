import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { TextWithKeywords } from '../common/TextWithKeywords';
import { FileText, Pin, Sparkles, Heart } from 'lucide-react';

export const NotepadApp: React.FC = () => {
  const notepadContent = useGameStore((s) => s.notepadContent);
  const currentChapter = useGameStore((s) => s.currentChapter);

  return (
    <div className="flex-1 flex flex-col bg-amber-50 font-sans text-slate-800 text-xs select-none overflow-hidden h-full">
      {/* Top Header */}
      <div className="bg-amber-100/90 border-b border-amber-300 px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 font-mono">
          <FileText className="w-4 h-4 text-amber-700" />
          <span>审计员桌面私人便签 (Notepad.exe)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-700 font-mono">
          <Pin className="w-3.5 h-3.5" />
          <span>已置顶</span>
        </div>
      </div>

      {/* Note Body */}
      <div className="flex-1 p-4 bg-amber-50/90 font-serif leading-relaxed text-sm overflow-y-auto space-y-3">
        <div className="bg-amber-100/60 p-3.5 rounded border border-amber-200 shadow-inner">
          <div className="text-xs font-bold text-amber-900 mb-2 font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>私人备忘待办：</span>
          </div>
          <div className="whitespace-pre-wrap text-slate-800 leading-loose text-xs font-sans">
            <TextWithKeywords text={notepadContent} />
          </div>
        </div>

        {currentChapter === 2 ? (
          <div className="text-[11px] text-amber-800/90 bg-amber-200/50 p-2.5 rounded border border-amber-300 font-mono">
            ★ 提示：点击便签中的【关悦】与【CAND-2010-092】可直接拾取至词块库，并在 MedQuery 医疗内网中调阅排队状态。
          </div>
        ) : (
          <div className="text-[11px] text-amber-800/90 bg-amber-200/40 p-2.5 rounded border border-amber-300/70 font-sans flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500 shrink-0 fill-red-500" />
            <span>至亲备忘：妹妹关悦正在圣路加医院排队候诊二期临床。工作再忙，也别忘了给妹妹过生日。</span>
          </div>
        )}
      </div>
    </div>
  );
};
