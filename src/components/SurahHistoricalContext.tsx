import React, { useState } from 'react';
import { HistoricalContext } from '../types/quran';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SurahHistoricalContextProps {
  overview?: string;
  context?: HistoricalContext;
  surahNumber: number;
  surahName: string;
}

export const SurahHistoricalContext: React.FC<SurahHistoricalContextProps> = ({
  overview,
  context,
  surahNumber,
  surahName,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Combine historical backdrop and occasion of revelation
  const historicalNarrative =
    context?.background ||
    [context?.historicalBackdrop, context?.asbabAlNuzul].filter(Boolean).join(' ');

  // If neither overview nor historical narrative exists, do not render
  if (!overview && !historicalNarrative) return null;

  return (
    <div className="max-w-4xl xl:max-w-5xl mx-auto text-left rounded-2xl bg-white dark:bg-[#222227] border border-[#E7E3DA] dark:border-[#2E2E34] shadow-xs overflow-hidden transition-all">
      {/* Header bar / Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-5 py-3 sm:py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/80 dark:hover:bg-[#26262C] transition-colors cursor-pointer select-none"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#CD7743] dark:text-[#E08955] font-reader truncate">
            Background
          </span>
        </div>

        <div className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* The combined overview and historical background narrative matching the rest of the reading text */}
      {isExpanded && (
        <div className="px-5 pb-5 sm:px-7 sm:pb-7 pt-0 border-t border-stone-100 dark:border-stone-800/60">
          <div className="pt-3.5 space-y-4 text-[16px] sm:text-[17px] leading-[1.85] text-[#292524] dark:text-[#D6D3D1] font-reader">
            {overview && (
              <p>
                {overview}
              </p>
            )}
            {historicalNarrative && (
              <p>
                {historicalNarrative}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
