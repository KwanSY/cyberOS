import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { WordCategory } from '../../types/game';
import { Sparkles, Check } from 'lucide-react';

interface WordPickupTagProps {
  word: string;
  category?: WordCategory;
  className?: string;
  children?: React.ReactNode;
}

export const WordPickupTag: React.FC<WordPickupTagProps> = ({
  word,
  category,
  className = '',
  children,
}) => {
  const addWord = useGameStore((s) => s.addWord);
  const collectedWords = useGameStore((s) => s.collectedWords);
  const [animating, setAnimating] = useState(false);

  const isCollected = collectedWords.some(
    (w) => w.text.toLowerCase() === word.trim().toLowerCase()
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addWord(word, category);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 800);
  };

  return (
    <span
      onClick={handleClick}
      title={isCollected ? `已收录词条：${word}` : `点击拾取词块：【${word}】`}
      className={`relative inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-all duration-150 select-none font-medium text-sm group ${
        isCollected
          ? 'bg-blue-950/80 text-blue-300 border border-blue-600/50 hover:border-blue-400'
          : 'bg-amber-950/60 text-amber-200 border border-amber-500/60 hover:bg-amber-900/80 hover:border-amber-400 hover:scale-105'
      } ${className}`}
    >
      {children || word}
      {isCollected ? (
        <Check className="w-3 h-3 text-emerald-400 ml-0.5 inline opacity-80" />
      ) : (
        <Sparkles className="w-3 h-3 text-amber-400 ml-0.5 inline animate-pulse opacity-90 group-hover:rotate-12" />
      )}

      {/* Floating pickup animation */}
      {animating && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-lg pointer-events-none animate-float-up whitespace-nowrap z-50">
          + 已收录
        </span>
      )}
    </span>
  );
};
