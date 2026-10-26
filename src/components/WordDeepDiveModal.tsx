import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Popover from '@radix-ui/react-popover';
import { X, BookOpen, Layers, Star, Compass, ArrowUpRight } from 'lucide-react';
import { WordDeepDiveData } from '../services/quranLexicon';
import { formatArabicEnglishInsight, parseRootDisplay } from '../utils/textFormatter';
import { triggerOpenRootExplorer, cn } from '../lib/utils';

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
  // Mobile breakpoint detection (< 640px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsMobile(mql.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Check if transliteration contains Arabic script (which was causing duplication and overlap)
  const isTransliterationArabic = data.transliteration
    ? /[\u0600-\u06FF]/.test(data.transliteration) || data.transliteration.trim() === data.word.trim()
    : true;
  const cleanTransliteration = !isTransliterationArabic ? data.transliteration : null;

  // Format grammar note and insight to ensure Arabic script precedes English transliteration: definition
  const formattedPartOfSpeech = data.partOfSpeech ? formatArabicEnglishInsight(data.partOfSpeech) : '';
  const formattedInsight = data.tafseerNote ? formatArabicEnglishInsight(data.tafseerNote) : '';

  // Tier 3 study toggle (Passages vs Tafseer Insight)
  const hasVerses = Boolean(data.otherQuranVerses && data.otherQuranVerses.length > 0);
  const hasInsight = Boolean(data.tafseerNote);
  const [activeTab, setActiveTab] = useState<'passages' | 'tafseer'>('passages');

  useEffect(() => {
    if (!hasVerses && hasInsight) {
      setActiveTab('tafseer');
    } else {
      setActiveTab('passages');
    }
  }, [hasVerses, hasInsight]);

  const handleRootClick = (rootText?: string) => {
    if (!rootText) return;
    onOpenChange(false);
    triggerOpenRootExplorer(rootText);
  };

  const cardContent = (
    <div className="space-y-3.5">
      {/* 1. Header: Word, Transliteration, Root Button, Part of Speech & Close */}
      <div className="border-b border-stone-100 dark:border-stone-800 pb-3 space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap min-w-0">
            <span
              dir="rtl"
              className="font-quran text-2xl sm:text-3xl text-[#CD7743] dark:text-[#E08955] leading-[1.6] inline-block px-1 select-text"
            >
              {data.word}
            </span>

            {cleanTransliteration && (
              <span className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-100">
                {cleanTransliteration}
              </span>
            )}

            {data.root && (() => {
              const parsedRoot = parseRootDisplay(data.root);
              if (!parsedRoot) return null;
              return (
                <button
                  type="button"
                  onClick={() => handleRootClick(data.root)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-lg bg-[#5F4B3E]/8 dark:bg-[#5F4B3E]/18 border border-[#5F4B3E]/25 hover:border-[#CD7743]/50 hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/20 transition-all cursor-pointer group shrink-0 shadow-2xs"
                  title={`Click to explore root ${data.root} in Root Explorer`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Root
                  </span>
                  <span
                    dir="rtl"
                    className="font-quran text-[15px] sm:text-[16px] text-[#CD7743] dark:text-[#E08955] leading-none px-1.5 py-0.5 rounded-md bg-white dark:bg-[#1E1E23] border border-stone-200/70 dark:border-stone-700/60 shadow-3xs select-text"
                  >
                    {parsedRoot.arabic}
                  </span>
                  {parsedRoot.latin && (
                    <span className="font-mono text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                      ({parsedRoot.latin})
                    </span>
                  )}
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 group-hover:text-[#CD7743] dark:group-hover:text-[#E08955] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              );
            })()}
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subtitle Row: Grammatical Part of Speech with safe vertical clearance */}
        {formattedPartOfSpeech && (
          <div className="text-xs text-[#596B8E] dark:text-[#788BB3] font-medium leading-normal pl-0.5">
            {formattedPartOfSpeech}
          </div>
        )}
      </div>

      {/* 2. Rarity Banner (if Key Theological Term) */}
      {data.isRare && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#CD7743]/10 dark:bg-[#CD7743]/18 text-[#CD7743] dark:text-[#E08955] text-xs">
          <Star className="w-3.5 h-3.5 fill-current shrink-0" />
          <span className="font-semibold">Key Theological Term:</span>
          <span className="truncate opacity-90">
            {data.rarityNote || `${data.occurrenceCount} occurrences across the Quran.`}
          </span>
        </div>
      )}

      {/* 3. Primary & Other Meanings (Tier 1: High Readability Callout) */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-stone-50 dark:bg-[#25252B] border border-stone-200/80 dark:border-stone-800 text-xs sm:text-[13px] space-y-1.5">
        <div className="flex items-baseline gap-2 flex-wrap leading-snug">
          <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 shrink-0">
            Primary:
          </span>
          <span className="text-sm sm:text-[15px] font-semibold text-stone-900 dark:text-stone-100">
            {data.primaryMeaning}
          </span>
        </div>
        {data.otherMeanings && data.otherMeanings.length > 0 && (
          <div className="text-xs text-stone-600 dark:text-stone-300 flex items-start gap-1.5 leading-relaxed pt-1.5 border-t border-stone-200/60 dark:border-stone-800/80">
            <span className="text-[#596B8E] dark:text-[#788BB3] font-semibold shrink-0">Nuances:</span>
            <span className="opacity-95">{data.otherMeanings.join(' · ')}</span>
          </div>
        )}
      </div>

      {/* 4. Related Words from Same Root (Tier 2: Clean Sub-Card Grid with Generous Arabic Line Height) */}
      {data.relatedWords && data.relatedWords.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#596B8E] dark:text-[#788BB3] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#596B8E] dark:text-[#788BB3]" />
            <span>Related Words (Same Root)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.relatedWords.slice(0, 4).map((rw, rwIdx) => (
              <div
                key={`rw-${rwIdx}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#25252B] border border-stone-200/70 dark:border-stone-800 text-xs shadow-2xs hover:border-[#596B8E]/40 transition-colors"
              >
                <span
                  dir="rtl"
                  className="font-quran text-[16px] sm:text-[17px] leading-[1.6] text-[#CD7743] dark:text-[#E08955] inline-flex items-center justify-center min-w-[42px] px-2 py-0.5 rounded-lg bg-white dark:bg-[#1E1E23] border border-stone-200/60 dark:border-stone-700/60 shadow-3xs shrink-0 select-text"
                >
                  {rw.arabic}
                </span>
                <div className="min-w-0 flex-1 flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-stone-700 dark:text-stone-200 font-mono text-[11px] font-semibold shrink-0">
                    {rw.transliteration}
                  </span>
                  <span className="text-stone-300 dark:text-stone-600 shrink-0">·</span>
                  <span
                    className="text-stone-600 dark:text-stone-300 font-medium text-[11px] sm:text-xs leading-snug truncate"
                    title={rw.meaning}
                  >
                    {rw.meaning}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 & 6. Tier 3: Context & Exegesis (Progressive Disclosure Switcher) */}
      {(hasVerses || hasInsight) && (
        <div className="space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800">
          {/* Segmented Switcher if both sections exist */}
          {hasVerses && hasInsight && (
            <div className="flex items-center p-0.5 rounded-lg bg-stone-100 dark:bg-[#25252A] border border-stone-200/60 dark:border-stone-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('passages')}
                className={cn(
                  'flex-1 py-1 px-2.5 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs',
                  activeTab === 'passages'
                    ? 'bg-white dark:bg-[#1E1E23] text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                )}
              >
                <Compass className="w-3.5 h-3.5 text-[#4C7971] dark:text-[#639C92]" />
                <span>Passages ({data.otherQuranVerses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tafseer')}
                className={cn(
                  'flex-1 py-1 px-2.5 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs',
                  activeTab === 'tafseer'
                    ? 'bg-white dark:bg-[#1E1E23] text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                )}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#5F4B3E] dark:text-[#8C7262]" />
                <span>Tafseer Insight</span>
              </button>
            </div>
          )}

          {/* Active Tab Panel: Passages */}
          {hasVerses && activeTab === 'passages' && (
            <div className="space-y-1.5">
              {!hasInsight && (
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#4C7971] dark:text-[#639C92] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#4C7971] dark:text-[#639C92]" />
                  <span>Where Else in the Qur'an ({data.otherQuranVerses.length} Key Passages)</span>
                </div>
              )}
              <div className="space-y-1.5">
                {data.otherQuranVerses.slice(0, 2).map((ref, rIdx) => (
                  <div
                    key={`qref-${rIdx}`}
                    className="p-2 sm:p-2.5 px-3 rounded-lg bg-[#4C7971]/8 dark:bg-[#4C7971]/15 border border-[#4C7971]/20 text-[11px] flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <span className="font-semibold text-[#4C7971] dark:text-[#639C92] font-mono text-[10px] block">
                        [{ref.reference}] Surah {ref.surahName}
                      </span>
                      <p className="text-stone-600 dark:text-stone-300 italic line-clamp-2 leading-snug">
                        "{ref.englishText}"
                      </p>
                    </div>

                    {ref.arabicSnippet && (
                      <div className="shrink-0 flex items-center self-center">
                        <span
                          dir="rtl"
                          className="font-quran text-[13px] sm:text-[14px] leading-[1.6] text-stone-800 dark:text-stone-200 truncate max-w-[190px] sm:max-w-[240px] px-0.5 inline-block text-right select-text"
                        >
                          {ref.arabicSnippet}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Tab Panel: Tafseer Insight */}
          {hasInsight && (activeTab === 'tafseer' || !hasVerses) && (
            <div className="p-3 rounded-xl bg-[#5F4B3E]/8 dark:bg-[#5F4B3E]/15 border border-[#5F4B3E]/20 text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-200 space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5F4B3E] dark:text-[#8C7262] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#5F4B3E] dark:text-[#8C7262]" />
                <span>Classical Tafseer Insight</span>
              </div>
              <p>{formattedInsight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Responsive Render: Slide-up Bottom Sheet on mobile (<640px)
  if (isMobile) {
    return (
      <>
        <span onClick={() => onOpenChange(!open)} className="inline-block cursor-pointer">
          {trigger}
        </span>
        {open &&
          typeof document !== 'undefined' &&
          createPortal(
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
              />
              {/* Bottom Sheet Drawer */}
              <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-[#1E1E23] border-t border-stone-200 dark:border-stone-800 p-4 sm:p-5 pb-8 shadow-2xl z-10 animate-in slide-in-from-bottom duration-250 text-stone-900 dark:text-stone-100"
              >
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-3 shrink-0" />
                {cardContent}
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  // Desktop View: Hover / Click Floating Popover
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
          className="z-50 w-[480px] sm:w-[540px] max-w-[94vw] p-4 sm:p-5 bg-white dark:bg-[#1E1E23] border border-stone-200 dark:border-stone-700/80 rounded-2xl shadow-2xl text-stone-900 dark:text-stone-100 text-xs animate-in fade-in zoom-in-95 duration-150"
          sideOffset={8}
        >
          {cardContent}
          <Popover.Arrow className="fill-white dark:fill-[#1E1E23]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
