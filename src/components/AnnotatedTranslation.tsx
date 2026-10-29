import React from 'react';
import { CuratedTerm } from '../types/quran';
import { TermPopover } from './TermPopover';
import { AyahEndMarker } from './AyahEndMarker';

interface AnnotatedTranslationProps {
  text?: string;
  curatedTerms?: CuratedTerm[];
  verseRange?: [number, number];
}

export const TranslationAyahMarker: React.FC<{ vNum: number }> = ({ vNum }) => {
  return <AyahEndMarker vNum={vNum} size="sm" />;
};

export const AnnotatedTranslation: React.FC<AnnotatedTranslationProps> = ({
  text,
  curatedTerms = [],
  verseRange,
}) => {
  if (!text) return null;

  // Matches either bracketed curated terms (e.g. "[Muttaqin]") or the Ayat end symbol (۝)
  const regex = /(\[.*?\]|۝)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let ayahIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    const token = match[0];

    // Add text preceding the match
    if (match.index > lastIndex) {
      let preceding = text.substring(lastIndex, match.index);
      if (token === '۝') {
        preceding = preceding.trimEnd();
      }
      if (preceding.length > 0) {
        parts.push(preceding);
      }
    }

    if (token === '۝') {
      const currentAyah = (verseRange ? verseRange[0] : 1) + ayahIndex;
      ayahIndex++;
      parts.push(
        <TranslationAyahMarker
          key={`ayah-${currentAyah}-${match.index}`}
          vNum={currentAyah}
        />
      );
    } else {
      const termKey = token.slice(1, -1);
      const matchingTerm = curatedTerms.find(
        (t) =>
          t.term.toLowerCase() === termKey.toLowerCase() ||
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
    }

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
