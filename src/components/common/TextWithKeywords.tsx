import React from 'react';
import { WordPickupTag } from './WordPickupTag';

interface TextWithKeywordsProps {
  text: string;
  className?: string;
}

export const TextWithKeywords: React.FC<TextWithKeywordsProps> = ({ text, className = '' }) => {
  // Parse [[keyword]] tokens
  const parts = text.split(/(\[\[.*?\]\])/g);

  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('[[') && part.endsWith(']]')) {
          const keyword = part.slice(2, -2).trim();
          return <WordPickupTag key={index} word={keyword} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};
