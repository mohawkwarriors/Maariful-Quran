import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { X, BookOpen, Layers, Star, Compass, ArrowRight } from 'lucide-react';
import { WordDeepDiveData } from '../services/quranLexicon';
import { formatArabicEnglishInsight } from '../utils/textFormatter';

interface WordDeepDiveModalProps {
  data: WordDeepDiveData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const WordDeepDiveModal: React.FC<WordDeepDiveModalProps> = ({
  data,
  open,
  onOpenChange,
  trigger,
  onMouseEnter,
  onMouseLeave,
}) => {
  // Check if transliteration contains Arabic script (which was causing duplication and overlap)
  const isTransliterationArabic = data.transliteration
    ? /[\u0600-\u06FF]/.test(data.transliteration) || data.transliteration.trim() === data.word.trim()
    : true;
  const cleanTransliteration = !isTransliterationArabic ? data.transliteration : null;

  // Format grammar note and insight to ensure Arabic script precedes English transliteration: definition
  const formattedPartOfSpeech = data.partOfSpeech ? formatArabicEnglishInsight(data.partOfSpeech) : '';
  const formattedInsight = data.tafseerNote ? formatArabicEnglishInsight(data.tafseerNote) : '';

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <span
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="inline-block"
      >
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      </span>

      <Popover.Portal>
        <Popover.Content
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="z-50 w-[460px] sm:w-[520px] md:w-[560px] max-w-[94vw] p-3.5 sm:p-4 bg-white dark:bg-[#1E1E23] border border-stone-200 dark:border-stone-700/80 rounded-xl shadow-2xl text-stone-900 dark:text-stone-100 text-xs animate-in fade-in zoom-in-95 duration-150 space-y-2.5"
          sideOffset={8}
        >
          {/* 1. Header: Word, Root, Transliteration, Part of Speech & Close */}
          <div className="border-b border-stone-100 dark:border-stone-800 pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  dir="rtl"
                  className="font-quran text-2xl sm:text-3xl text-[#CD7743] dark:text-[#E08955] leading-none select-text"
                >
                  {data.word}
                </span>
                {data.root && (
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-[#5F4B3E]/10 dark:bg-[#5F4B3E]/20 text-[#5F4B3E] dark:text-[#8C7262] border border-[#5F4B3E]/30 shrink-0">
                    Root: {data.root}
                  </span>
                )}
                {cleanTransliteration && (
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                    {cleanTransliteration}
                  </span>
                )}
                {formattedPartOfSpeech && (
                  <span className="text-[11px] text-[#596B8E] dark:text-[#788BB3]">
                    · {formattedPartOfSpeech}
                  </span>
                )}
              </div>

              <Popover.Close
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded p-1 transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </Popover.Close>
            </div>
          </div>

          {/* 2. Rarity Banner (Compact single line) */}
          {data.isRare && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#CD7743]/10 dark:bg-[#CD7743]/18 text-[#CD7743] dark:text-[#E08955] text-[11px]">
              <Star className="w-3 h-3 text-[#CD7743] dark:text-[#E08955] shrink-0 fill-current" />
              <span className="font-semibold">Key Theological Term:</span>
              <span className="truncate opacity-90">
                {data.rarityNote || `${data.occurrenceCount} occurrences across the Quran.`}
              </span>
            </div>
          )}

          {/* 3. Primary & Other Meanings (Compact Box) */}
          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-[#25252B] border border-stone-200/70 dark:border-stone-800 text-xs space-y-1">
            <div className="leading-snug">
              <span className="font-semibold text-stone-900 dark:text-stone-100">Primary: </span>
              <span className="text-stone-800 dark:text-stone-200 font-medium">{data.primaryMeaning}</span>
            </div>
            {data.otherMeanings && data.otherMeanings.length > 0 && (
              <div className="text-[11px] text-stone-600 dark:text-stone-400 flex items-start gap-1 leading-tight">
                <span className="text-[#596B8E] dark:text-[#788BB3] font-semibold shrink-0">Nuances:</span>
                <span>{data.otherMeanings.join(' · ')}</span>
              </div>
            )}
          </div>

          {/* 4. Related Words from Same Root (Compact Chip Flow) */}
          {data.relatedWords && data.relatedWords.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#596B8E] dark:text-[#788BB3] flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#596B8E] dark:text-[#788BB3]" />
                <span>Related Words (Same Root)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.relatedWords.slice(0, 4).map((rw, rwIdx) => (
                  <div
                    key={`rw-${rwIdx}`}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-50 dark:bg-[#25252B] border border-stone-200/60 dark:border-stone-800 text-[11px]"
                  >
                    <span className="font-quran text-sm text-[#CD7743] dark:text-[#E08955]">
                      {rw.arabic}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 font-mono text-[10px]">
                      {rw.transliteration}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-700 dark:text-stone-300 font-medium">
                      {rw.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Where Else in the Quran (Compact Reference Rows) */}
          {data.otherQuranVerses && data.otherQuranVerses.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#4C7971] dark:text-[#639C92] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#4C7971] dark:text-[#639C92]" />
                  <span>Where Else in the Qur'an ({data.otherQuranVerses.length} Key Passages)</span>
                </div>
              </div>
              <div className="space-y-1">
                {data.otherQuranVerses.slice(0, 2).map((ref, rIdx) => (
                  <div
                    key={`qref-${rIdx}`}
                    className="p-1.5 px-2 rounded-md bg-[#4C7971]/8 dark:bg-[#4C7971]/15 border border-[#4C7971]/20 text-[11px] leading-tight space-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-[#4C7971] dark:text-[#639C92] font-mono text-[10px]">
                        [{ref.reference}] Surah {ref.surahName}
                      </span>
                      {ref.arabicSnippet && (
                        <span
                          dir="rtl"
                          className="font-quran text-xs text-stone-800 dark:text-stone-200 truncate max-w-[220px]"
                        >
                          {ref.arabicSnippet}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 italic line-clamp-1">
                      "{ref.englishText}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Classical Tafseer Note */}
          {data.tafseerNote && (
            <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[11px] leading-snug text-stone-600 dark:text-stone-300">
              <span className="font-semibold text-[#5F4B3E] dark:text-[#8C7262]">
                Tafseer Insight:
              </span>{' '}
              {formattedInsight}
            </div>
          )}

          <Popover.Arrow className="fill-white dark:fill-[#1E1E23]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
