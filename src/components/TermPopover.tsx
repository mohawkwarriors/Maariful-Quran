import React, { useState, useRef, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { BookOpen, X, Layers, ArrowUpRight } from 'lucide-react';
import { CuratedTerm } from '../types/quran';
import { VOCABULARY_KNOWLEDGE } from '../services/vocabularyKnowledge';
import { getWordDeepDive } from '../services/quranLexicon';
import { formatArabicEnglishInsight } from '../utils/textFormatter';
import { triggerOpenRootExplorer } from '../lib/utils';

interface TermPopoverProps {
  termText: string;
  termData?: CuratedTerm;
}

export const TermPopover: React.FC<TermPopoverProps> = ({ termText, termData }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Look up enriched knowledge based on termText
  const cleanKey = termText.toLowerCase().replace(/[^\w\s-]/g, '').trim();

  // Alias dictionary for morphological inflections
  const aliasKeyMap: Record<string, string> = {
    kaffar: 'kaffar',
    kafaru: 'kafaru',
    kafar: 'kaffar',
    kufr: 'kufr',
    kuffar: 'kaffar',
    ghishawah: 'ghishawah',
    khatm: 'khatm',
    marad: 'marad',
    andad: 'andad',
    fasad: 'fasad',
    islah: 'islah',
  };

  const resolvedKey = aliasKeyMap[cleanKey] || cleanKey;

  const knownData =
    VOCABULARY_KNOWLEDGE[resolvedKey] ||
    VOCABULARY_KNOWLEDGE[cleanKey] ||
    Object.entries(VOCABULARY_KNOWLEDGE).find(([k]) => resolvedKey.includes(k) || k.includes(resolvedKey))?.[1];

  // Deep dive lexicon fallback if still not in curated vocabulary table
  const lexiconFallback = !termData && !knownData ? getWordDeepDive(termText) : null;

  const rawMeaning =
    termData?.literalMeaning ||
    knownData?.literalMeaning ||
    lexiconFallback?.primaryMeaning ||
    'Classical Arabic theological term.';

  const rawContext =
    termData?.theologicalContext ||
    knownData?.theologicalContext ||
    lexiconFallback?.tafseerNote ||
    `In Ma'ariful Qur'an, Mufti Muhammad Shafi examines the linguistic root, spiritual dimensions, and practical rulings pertaining to this term.`;

  const effectiveData: CuratedTerm = {
    term: termData?.term || knownData?.term || (lexiconFallback ? `${termText} (${lexiconFallback.root})` : termText),
    arabicRoot: termData?.arabicRoot || knownData?.arabicRoot || lexiconFallback?.root,
    literalMeaning: rawMeaning,
    relatedWords:
      termData?.relatedWords ||
      knownData?.relatedWords ||
      lexiconFallback?.relatedWords.map((rw) => `${rw.arabic} (${rw.transliteration}): ${rw.meaning}`) ||
      [],
    theologicalContext: formatArabicEnglishInsight(rawContext),
    volumeReference: termData?.volumeReference || knownData?.volumeReference || "Ma'ariful Qur'an Exegesis",
  };

  // Hover handlers for desktop with smooth delay tolerance
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-baseline text-inherit border-b border-dotted border-[#CD7743]/80 hover:text-[#CD7743] dark:hover:text-[#E08955] hover:border-solid transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD7743] rounded-xs px-0.5 font-medium"
            title="Hover or click to view root, meaning, and exegesis"
          >
            {termText}
          </button>
        </Popover.Trigger>
      </span>

      <Popover.Portal>
        <Popover.Content
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="z-50 w-[500px] sm:w-[580px] max-w-[95vw] max-h-[85vh] overflow-y-auto p-5 sm:p-6 bg-white dark:bg-[#202025] border border-stone-200 dark:border-stone-700/80 rounded-2xl shadow-2xl text-[#1F2937] dark:text-[#F3F4F6] text-xs sm:text-[13px] animate-in fade-in zoom-in-95 duration-150 space-y-3.5"
          sideOffset={8}
        >
          {/* 1. Header: Word, Root, Close Button */}
          <div className="flex items-start justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif-heading font-bold text-lg text-[#CD7743] dark:text-[#E08955]">
                  {effectiveData.term}
                </span>
                {effectiveData.arabicRoot && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      triggerOpenRootExplorer(effectiveData.arabicRoot);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-[#5F4B3E]/10 dark:bg-[#5F4B3E]/20 text-[#5F4B3E] dark:text-[#8C7262] font-mono font-medium border border-[#5F4B3E]/30 hover:bg-[#5F4B3E]/20 hover:border-[#5F4B3E]/50 transition-all cursor-pointer group/root"
                    title={`Click to explore triliteral root ${effectiveData.arabicRoot} in Root Explorer`}
                  >
                    <span>Root: {effectiveData.arabicRoot}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60 group-hover/root:opacity-100 group-hover/root:translate-x-0.5 group-hover/root:-translate-y-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* 2. Meaning */}
              <div className="text-xs text-stone-600 dark:text-stone-300 italic font-reader">
                <span className="font-semibold text-stone-500 dark:text-stone-400 not-italic">Meaning: </span>
                {effectiveData.literalMeaning}
              </div>
            </div>

            <Popover.Close
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md p-1 transition-colors cursor-pointer shrink-0"
              aria-label="Close popover"
            >
              <X className="w-4 h-4" />
            </Popover.Close>
          </div>

          {/* 3. Related Words (Tertiary #596B8E) */}
          {effectiveData.relatedWords && effectiveData.relatedWords.length > 0 && (
            <div className="space-y-1.5 bg-[#596B8E]/8 dark:bg-[#596B8E]/15 p-2.5 rounded-xl border border-[#596B8E]/25">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#596B8E] dark:text-[#788BB3] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#596B8E] dark:text-[#788BB3]" />
                <span>Related Words (Same Root)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {effectiveData.relatedWords.map((word, idx) => (
                  <span
                    key={`rel-${idx}`}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#28282E] text-stone-700 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700/60"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. Description (Theological Exegesis from Ma'ariful Qur'an without any AI sparkle icons) */}
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Description & Theological Context
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300 font-reader">
              {effectiveData.theologicalContext}
            </p>
          </div>

          {/* 5. Source Reference */}
          {effectiveData.volumeReference && (
            <div className="flex items-center gap-1.5 pt-2 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
              <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span className="font-medium">Source: {effectiveData.volumeReference}</span>
            </div>
          )}

          <Popover.Arrow className="fill-white dark:fill-[#202025]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
