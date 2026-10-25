import React from 'react';
import { CuratedTerm } from '../types/quran';
import { TermPopover } from './TermPopover';

interface AnnotatedTranslationProps {
  text?: string;
  curatedTerms?: CuratedTerm[];
}

export const AnnotatedTranslation: React.FC<AnnotatedTranslationProps> = ({ text, curatedTerms = [] }) => {
  if (!text) return null;

  // Matches words inside brackets, e.g. "[Muttaqin]" or "[Sirat al-Mustaqim]"
  const regex = /\[(.*?)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text preceding the bracket
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const termKey = match[1];
    const matchingTerm = curatedTerms.find(
      (t) => t.term.toLowerCase() === termKey.toLowerCase() ||
             t.term.toLowerCase().includes(termKey.toLowerCase()) ||
             termKey.toLowerCase().includes(t.term.toLowerCase())
    );

    parts.push(
      <TermPopover
        key={`term-${match.index}-${termKey}`}
        termText={termKey}
        termData={matchingTerm}
      />
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <div className="leading-relaxed text-[17px] text-[#2D3748] dark:text-[#E2E8F0]">
      {parts}
    </div>
  );
};
