import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Popover from '@radix-ui/react-popover';
import { X, Layers, Compass, ExternalLink } from 'lucide-react';
import { WordDeepDiveData } from '../services/quranLexicon';
import { getEjtaalUrl, getLanesRootInfo } from '../services/lanesLexicon';
import { formatArabicEnglishInsight, parseRootDisplay } from '../utils/textFormatter';

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

  // Extract genuine transliteration (never English translation)
  let cleanTransliteration = '';
  let morphologyText = data.partOfSpeech || '';

  // 1. If partOfSpeech has "Transliteration: <phonetic text>", extract it
  if (/transliteration\s*:\s*/i.test(morphologyText)) {
    const match = morphologyText.match(/transliteration\s*:\s*([^;,\n]+)/i);
    if (match) {
      cleanTransliteration = match[1].trim();
      morphologyText = morphologyText.replace(/transliteration\s*:\s*([^;,\n]+)[;\n]?/i, '').trim();
    }
  }

  // 2. If data.transliteration is present and not matching translation or Arabic
  if (!cleanTransliteration && data.transliteration) {
    const isArabic = /[\u0600-\u06FF]/.test(data.transliteration) || data.transliteration.trim() === data.word.trim();
    const normalizeForCompare = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const transNorm = normalizeForCompare(data.transliteration);
    const meaningNorm = normalizeForCompare(data.primaryMeaning);
    const isTranslationEcho =
      transNorm.length > 0 &&
      meaningNorm.length > 0 &&
      (transNorm === meaningNorm ||
       meaningNorm.startsWith(transNorm) ||
       transNorm.startsWith(meaningNorm) ||
       (transNorm.length >= 3 && meaningNorm.includes(transNorm)));

    if (!isArabic && !isTranslationEcho && data.transliteration !== 'Quranic Term') {
      cleanTransliteration = data.transliteration.trim();
    }
  }

  // Format grammar note and insight cleanly (only if genuine morphological content remains)
  const formattedPartOfSpeech = morphologyText ? formatArabicEnglishInsight(morphologyText) : '';

  // Filter out any legacy placeholder related words (strictly genuine words only)
  const authenticRelatedWords = (data.relatedWords || []).filter(
    (rw) =>
      rw.transliteration !== 'Aṣl' &&
      rw.transliteration !== 'Lafẓ' &&
      rw.transliteration !== 'Ma\'na' &&
      rw.arabic !== 'مَعْنَى' &&
      rw.arabic !== data.root &&
      rw.meaning !== 'Foundational root meaning' &&
      rw.meaning !== 'Contextual manifestation in verse'
  );

  // Filter out any legacy synthetic verse fallbacks (strictly genuine occurrences only)
  const authenticVerses = (data.otherQuranVerses || []).filter(
    (v) =>
      !(
        (v.reference === '2:255' || v.reference === '1:6') &&
        data.word !== 'اللَّهُ' &&
        data.word !== 'اهْدِنَا' &&
        !data.primaryMeaning.toLowerCase().includes('ever-living') &&
        !data.primaryMeaning.toLowerCase().includes('straight')
      )
  );

  // Retrieve classical Lane's Lexicon information for this root
  const lanesInfo = data.root ? getLanesRootInfo(data.root) : null;
  const parsedRoot = data.root ? parseRootDisplay(data.root) : null;
  const ejtaalLink = data.root ? getEjtaalUrl(data.root) : null;

  const isSameAsTransliteration = Boolean(
    cleanTransliteration &&
    data.primaryMeaning &&
    cleanTransliteration.trim().toLowerCase() === data.primaryMeaning.trim().toLowerCase()
  );

  const cardContent = (
    <div className="space-y-3">
      {/* 1. Header: Arabic Word with Phonetic Subtitle on the left, Primary English Translation next to it */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 pb-0.5">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Arabic Script & Transliteration Subtitle */}
          <div className="flex flex-col items-center shrink-0">
            <span
              dir="rtl"
              className="font-quran text-3xl sm:text-4xl text-[#CD7743] dark:text-[#E08955] leading-[1.3] inline-block px-1 pb-1 select-text"
            >
              {data.word}
            </span>

            {cleanTransliteration && !isSameAsTransliteration && (
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 tracking-wide select-text px-1 mt-1 sm:mt-1.5">
                {cleanTransliteration}
              </span>
            )}
          </div>

          {/* Primary English Translation */}
          <div className="flex-1 min-w-0 pt-1 sm:pt-1.5">
            <span className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100 leading-snug select-text block">
              {data.primaryMeaning}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors cursor-pointer shrink-0"
          aria-label="Close word details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. CARD 1: Morphology / Part of Speech & Alternative Translations */}
      {(formattedPartOfSpeech || (data.otherMeanings && data.otherMeanings.length > 0)) && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-stone-50 dark:bg-[#25252B] border border-stone-200/80 dark:border-stone-800 space-y-2">
          {/* Morphology / Part of Speech (verbal noun, preposition, etc.) */}
          {formattedPartOfSpeech && (
            <div className="text-xs text-[#596B8E] dark:text-[#788BB3] font-medium leading-normal select-text">
              {formattedPartOfSpeech}
            </div>
          )}

          {/* Alternative Translations rendered as clean bullet points */}
          {data.otherMeanings && data.otherMeanings.length > 0 && (
            <div className={`${formattedPartOfSpeech ? 'pt-2 border-t border-stone-200/60 dark:border-stone-800/80' : ''} space-y-1.5`}>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                Alternative Translations
              </span>
              <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                {data.otherMeanings.map((meaning, idx) => (
                  <li key={`alt-${idx}`} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#CD7743] dark:text-[#E08955] text-xs leading-none select-none shrink-0 mt-0.5">•</span>
                    <span className="select-text">{meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 3. CARD 2: Classical Root Word (Arabic letters optically aligned with English text) */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-[#5F4B3E]/6 dark:bg-[#5F4B3E]/14 border border-[#5F4B3E]/20 dark:border-[#5F4B3E]/30 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Classical Root:
          </span>
          {data.root && parsedRoot ? (
            <>
              <span
                dir="rtl"
                className="font-quran text-[17px] sm:text-[18px] text-[#CD7743] dark:text-[#E08955] leading-none select-text inline-flex items-center -translate-y-0.5"
              >
                {parsedRoot.arabic}
              </span>
              {parsedRoot.latin && (
                <span className="font-mono text-xs font-semibold text-stone-600 dark:text-stone-300">
                  ({parsedRoot.latin})
                </span>
              )}
            </>
          ) : (
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 italic">
              Non-Derivative Particle (حرف مبني)
            </span>
          )}
        </div>

        <p className="text-xs sm:text-[12.5px] leading-relaxed text-stone-700 dark:text-stone-300 select-text">
          {data.root && parsedRoot
            ? (lanesInfo?.laneDefinition || data.rootMeaning || 'No classical root information available from this source.')
            : 'In Classical Arabic grammar (Nahw), particles, prepositions, and pronouns are indeclinable (mabni) and non-derivative, serving connective syntactic functions rather than carrying triliteral roots.'}
        </p>

        <div className="pt-1.5 border-t border-[#5F4B3E]/15 dark:border-[#5F4B3E]/25">
          {data.root && parsedRoot && ejtaalLink ? (
            <a
              href={ejtaalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#596B8E] dark:text-[#788BB3] hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors inline-flex items-center gap-1 group font-medium"
              title="Open root in Edward William Lane's Lexicon on Ejtaal.net"
            >
              <span>Source: Edward William Lane, Madd al-Qāmūs ({lanesInfo?.lanePage || 'Book 1'}) — Ejtaal.net</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <span className="text-[11px] text-stone-400 dark:text-stone-500 italic">
              Source: Classical Arabic Syntax (Naḥw & Ṣarf)
            </span>
          )}
        </div>
      </div>

      {/* 4. CARD 3: Related Words (Uniform full-width single-line rows) */}
      <div className="space-y-2">
        <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#596B8E] dark:text-[#788BB3] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#596B8E] dark:text-[#788BB3]" />
          <span>Related Words (Same Root)</span>
        </div>
        {authenticRelatedWords.length > 0 ? (
          <div className="space-y-1.5">
            {authenticRelatedWords.slice(0, 4).map((rw, rwIdx) => (
              <div
                key={`rw-${rwIdx}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#25252B] border border-stone-200/70 dark:border-stone-800 text-xs shadow-2xs hover:border-[#596B8E]/40 transition-colors"
              >
                <span
                  dir="rtl"
                  className="font-quran text-[17px] sm:text-[18px] leading-none text-[#CD7743] dark:text-[#E08955] shrink-0 select-text -translate-y-0.5"
                >
                  {rw.arabic}
                </span>
                <span className="text-stone-800 dark:text-stone-200 font-semibold text-xs tracking-wide shrink-0">
                  {rw.transliteration}
                </span>
                <span className="text-stone-300 dark:text-stone-600 shrink-0 select-none">·</span>
                <span
                  className="text-stone-600 dark:text-stone-300 font-medium text-xs leading-snug truncate"
                  title={rw.meaning}
                >
                  {rw.meaning}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2.5 px-3 rounded-xl bg-stone-50 dark:bg-[#25252B] border border-stone-200/70 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 italic">
            No related words available from this source.
          </div>
        )}
      </div>

      {/* 5. CARD 4: Other Occurrences in the Qur'an */}
      <div className="space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800">
        <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#4C7971] dark:text-[#639C92] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#4C7971] dark:text-[#639C92]" />
          <span>Other Occurrences in the Qur'an</span>
        </div>
        {authenticVerses.length > 0 ? (
          <div className="space-y-1.5">
            {authenticVerses.slice(0, 3).map((ref, rIdx) => (
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
        ) : (
          <div className="p-2.5 px-3 rounded-xl bg-stone-50 dark:bg-[#25252B] border border-stone-200/70 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 italic">
            No other occurrences indexed for this word from this source.
          </div>
        )}
      </div>
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
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
              />
              <div
                role="dialog"
                aria-modal="true"
                className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-[#1E1E23] border-t border-stone-200 dark:border-stone-800 p-4 sm:p-5 pb-8 shadow-2xl z-10 animate-in slide-in-from-bottom duration-250 text-stone-900 dark:text-stone-100"
              >
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
