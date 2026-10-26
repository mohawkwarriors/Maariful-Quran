import React from 'react';
import { CuratedTerm } from '../types/quran';
import { TermPopover } from './TermPopover';

interface AnnotatedTranslationProps {
  text?: string;
  curatedTerms?: CuratedTerm[];
  verseRange?: [number, number];
}

interface TranslationAyahMarkerProps {
  vNum: number;
}

export const TranslationAyahMarker: React.FC<TranslationAyahMarkerProps> = ({ vNum }) => {
  return (
    <span
      className="relative inline-flex items-center justify-center shrink-0 align-middle mx-1.5 select-none w-[24px] h-[24px] transition-transform hover:scale-110 cursor-default"
      title={`Ayah ${vNum}`}
      aria-label={`Ayah ${vNum}`}
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full text-[#CD7743] dark:text-[#E08955] drop-shadow-2xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="20,1.5 25.66,6.33 33.08,6.92 33.67,14.34 38.5,20 33.67,25.66 33.08,33.08 25.66,33.67 20,38.5 14.34,33.67 6.92,33.08 6.33,25.66 1.5,20 6.33,14.34 6.92,6.92 14.34,6.33"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle
          cx="20"
          cy="20"
          r="13"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.04"
        />
      </svg>
      <span
        className="relative z-10 flex items-center justify-center text-center font-bold text-[#CD7743] dark:text-[#E08955] leading-none select-none font-sans"
        style={{
          fontSize: vNum >= 100 ? '9.5px' : vNum >= 10 ? '11px' : '12px',
          letterSpacing: vNum >= 100 ? '-0.5px' : 'normal',
          transform: 'translateY(0.5px)',
        }}
      >
        {vNum}
      </span>
    </span>
  );
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
