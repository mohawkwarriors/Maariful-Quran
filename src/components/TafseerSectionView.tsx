import React, { useState, useRef, useEffect } from 'react';
import { ThematicSection, PhraseCard, SubSection } from '../types/quran';
import { AnnotatedTranslation } from './AnnotatedTranslation';
import { WordDeepDiveModal } from './WordDeepDiveModal';
import { getWordDeepDive } from '../services/quranLexicon';
import { TafseerStudyCard, StudyCardType } from './TafseerStudyCard';
import { TafseerQuoteCard, QuoteType } from './TafseerQuoteCard';
import { SURAH_TRANSLITERATED_NAMES, matchAyahFromSection } from '../utils/quranCitation';
import { interleaveStudyCards, RawCommentaryBlock } from '../utils/cardPlacement';
import { ChevronDown, ChevronUp, Bookmark, ArrowUpRight } from 'lucide-react';

interface TafseerSectionViewProps {
  section: ThematicSection;
  viewMode: 'separate' | 'inline';
  isActive: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

interface WordItemProps {
  word: string;
  meaning: string;
  root?: string;
  grammarNote?: string;
}

const toArabicNumeral = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join('');
};

const AyahEndMarker: React.FC<{ vNum: number }> = ({ vNum }) => {
  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 self-center mx-1.5 sm:mx-2 select-none w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] transition-transform hover:scale-105"
      title={`Ayah ${vNum}`}
      aria-label={`Ayah ${vNum}`}
    >
      {/* Simplified, Elegant Islamic 8-Pointed Star Rosette (Rub el Hizb Motif) */}
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full text-[#CD7743] dark:text-[#E08955] drop-shadow-2xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Unified 8-pointed Islamic Star perimeter */}
        <polygon
          points="20,1.5 25.66,6.33 33.08,6.92 33.67,14.34 38.5,20 33.67,25.66 33.08,33.08 25.66,33.67 20,38.5 14.34,33.67 6.92,33.08 6.33,25.66 1.5,20 6.33,14.34 6.92,6.92 14.34,6.33"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Inner concentric ring framing the numeral */}
        <circle
          cx="20"
          cy="20"
          r="13"
          stroke="currentColor"
          strokeWidth="1"
          fill="currentColor"
          fillOpacity="0.04"
        />
        {/* 4 subtle cardinal ornament accents */}
        <circle cx="20" cy="4" r="1.1" fill="currentColor" />
        <circle cx="20" cy="36" r="1.1" fill="currentColor" />
        <circle cx="4" cy="20" r="1.1" fill="currentColor" />
        <circle cx="36" cy="20" r="1.1" fill="currentColor" />
      </svg>

      {/* Dead-Center Eastern Arabic Numeral with tailored font-size for triple digits */}
      <span
        dir="rtl"
        className="relative z-10 flex items-center justify-center text-center font-bold text-[#CD7743] dark:text-[#E08955] leading-none select-none"
        style={{
          fontFamily: "'Amiri', 'Scheherazade New', serif",
          fontSize: vNum >= 100 ? '11.5px' : vNum >= 10 ? '13px' : '15px',
          letterSpacing: vNum >= 100 ? '-0.4px' : 'normal',
          transform: 'translateY(-0.5px)',
        }}
      >
        {toArabicNumeral(vNum)}
      </span>
    </div>
  );
};

const WordItem: React.FC<WordItemProps> = ({ word, meaning, root, grammarNote }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Deep dive data with root, other meanings, related words, and cross-Quran occurrences
  const deepDiveData = getWordDeepDive(word, meaning, root, grammarNote);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  const trigger = (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className="inline-flex flex-col items-center justify-between group cursor-pointer text-center px-2 sm:px-2.5 pt-1.5 pb-2 rounded-xl hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/15 transition-all select-text shrink-0 min-w-[56px] sm:min-w-[64px] max-w-[150px] sm:max-w-[170px]"
      title="Hover on desktop or click for root, related words & Quranic occurrences"
    >
      {/* Arabic Word Container - Generous vertical clearance for harakat & deep descenders like ع, ي, ر */}
      <div className="w-full flex items-center justify-center min-h-[48px] sm:min-h-[52px] px-1 pb-1.5 overflow-visible">
        <span
          dir="rtl"
          className="font-quran text-[26px] sm:text-[29px] md:text-[31px] leading-[1.7] sm:leading-[1.8] text-stone-900 dark:text-stone-100 group-hover:text-[#CD7743] dark:group-hover:text-[#E08955] transition-colors block text-center select-text overflow-visible"
        >
          {word}
        </span>
      </div>

      {/* English translation: dedicated top margin ensuring it never collides with Arabic descenders */}
      <div dir="ltr" className="w-full flex items-center justify-center min-h-[22px] sm:min-h-[24px] px-0.5 mt-2 sm:mt-2.5">
        <span className="text-[11px] sm:text-[11.5px] text-stone-600 dark:text-stone-300 group-hover:text-[#CD7743] dark:group-hover:text-[#E08955] font-reader transition-colors text-center leading-normal break-words line-clamp-2">
          {meaning}
        </span>
      </div>
    </div>
  );

  return (
    <WordDeepDiveModal
      data={deepDiveData}
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

const parseVerseMarker = (raw: string) => {
  const match = raw.match(/^\[\s*(Verses?)\s*([\d\s\-–—,and]+)\s*\]$/i);
  if (!match) return { isPlural: false, displayTitle: raw, primaryNum: 1 };

  const isPlural = match[1].toLowerCase().startsWith('verses');
  const rangeText = match[2].trim();
  const firstNumMatch = rangeText.match(/\d+/);
  const primaryNum = firstNumMatch ? parseInt(firstNumMatch[0], 10) : 1;
  const displayTitle = isPlural ? `Verses ${rangeText}` : `Verse ${rangeText}`;

  return { isPlural, displayTitle, primaryNum };
};

const TafseerVerseHeading: React.FC<{
  label: string;
  verseSnippet?: string;
}> = ({ label, verseSnippet }) => {
  const { displayTitle, primaryNum } = parseVerseMarker(label);

  const handleClick = () => {
    const targetEl =
      document.getElementById(`verse-card-${primaryNum}`) ||
      document.getElementById('translation-block');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.classList.add('ring-2', 'ring-[#CD7743]/60', 'transition-all');
      setTimeout(() => {
        targetEl.classList.remove('ring-2', 'ring-[#CD7743]/60');
      }, 1800);
    }
  };

  return (
    <div
      id={`tafseer-verse-${primaryNum}`}
      className="not-prose pt-7 pb-2.5 first:pt-2 first:mb-4 select-none w-full border-b border-[#ECE5DA]/70 dark:border-[#38332C]/70 group/badge"
    >
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center justify-between gap-3 text-left transition-all cursor-pointer"
        title={`Click to jump to Verse ${primaryNum} in the text`}
        aria-label={`Jump to ${displayTitle}`}
      >
        {/* Left Side: Rosette + Title + Translation Snippet (Flushed with Text Margin) */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          {/* Simplified Islamic 8-Pointed Star Rosette with Numeral */}
          <div className="relative inline-flex items-center justify-center w-7 h-7 sm:w-7.5 sm:h-7.5 shrink-0 transition-transform group-hover/badge:scale-105">
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
              className="relative z-10 flex items-center justify-center font-bold text-[#CD7743] dark:text-[#E08955] leading-none select-none font-sans"
              style={{
                fontSize: primaryNum >= 100 ? '9.5px' : primaryNum >= 10 ? '11px' : '12px',
                letterSpacing: primaryNum >= 100 ? '-0.5px' : 'normal',
                transform: 'translateY(0.5px)',
              }}
            >
              {primaryNum}
            </span>
          </div>

          {/* Verse Title & Translation Snippet */}
          <div className="flex items-baseline gap-2 text-left min-w-0 flex-1">
            <span className="font-serif-heading text-[16.5px] sm:text-[18px] font-bold text-stone-900 dark:text-stone-100 tracking-wide group-hover/badge:text-[#CD7743] dark:group-hover/badge:text-[#E08955] transition-colors shrink-0">
              {displayTitle}
            </span>

            {verseSnippet && (
              <span
                className="text-xs sm:text-[13.5px] text-stone-500 dark:text-stone-400 italic font-reader truncate max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
                title={verseSnippet}
              >
                · "{verseSnippet}"
              </span>
            )}
          </div>
        </div>

        {/* Trailing hairline extending across remaining width */}
        <div className="h-px flex-1 bg-gradient-to-r from-[#CD7743]/20 via-[#CD7743]/10 to-transparent mx-2 hidden md:block max-w-[120px]" />

        {/* Right side Jump icon / hint */}
        <div className="flex items-center gap-1 text-[11px] font-reader text-stone-400 dark:text-stone-500 opacity-60 group-hover/badge:opacity-100 group-hover/badge:text-[#CD7743] dark:group-hover/badge:text-[#E08955] transition-all shrink-0">
          <span className="hidden sm:inline">Jump to verse</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/badge:translate-x-0.5 group-hover/badge:-translate-y-0.5 transition-transform" />
        </div>
      </button>
    </div>
  );
};

const isSubheading = (line: string): boolean => {
  const l = line.trim();
  if (!l) return false;
  // Exclude verse markers, horizontal dividers, banner dividers, pure Arabic lines
  if (/^\[\s*Verses?/i.test(l)) return false;
  if (/^[─\-_=~*]{3,}$/.test(l) || /^───.*───$/.test(l)) return false;
  if (/^[\u0600-\u06FF\s]+$/.test(l)) return false;

  // Length constraint: Subheadings are concise titles, between 3 and 65 characters
  if (l.length < 3 || l.length > 65) return false;

  // Dialogue or quotation marks indicate quotes or speech, not section titles
  if (/[“"”]/.test(l)) return false;

  // Sentences or citations ending in terminal punctuation
  if (/[.,;—–\-)\]!]$/.test(l)) return false;

  // Numbered or lettered list items: e.g. "1. ", "a) "
  if (/^\d+\.\s+/.test(l) || /^[a-z]\)\s+/i.test(l)) return false;

  // If ending with a colon, exclude common lead-in phrases
  if (l.endsWith(':')) {
    if (
      /\b(?:says|said|find|reports|writes|reads|follows|following|continued|recited|example|namely|short|poet|words|verse)\b/i.test(
        l
      )
    ) {
      return false;
    }
  }

  // Heading should start with a capital letter
  if (!/^[A-Z]/.test(l)) return false;

  // Exclude common standalone sentence connectors / pronouns / book colophon boilerplate
  if (
    /^(?:he|she|it|they|we|and|or|but|in short|for example|on the other hand|commentary:?|note:?|al-?hamdulillah|ends here)$/i.test(
      l
    ) ||
    /^(?:The Commentary on|Surah [A-Za-z\s`'-]+ ends here|Question:|Answer:)/i.test(l)
  ) {
    return false;
  }

  return true;
};

const TafseerSubheading: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="not-prose pt-8 sm:pt-9 pb-2 first:pt-1 group/subhead select-text">
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Warm amber book-spine accent pill */}
        <div className="w-1.5 h-4.5 sm:h-5 rounded-full bg-[#CD7743] dark:bg-[#E08955] shrink-0" />

        {/* Sub-section Header Title */}
        <h3 className="font-serif-heading font-bold text-[17.5px] sm:text-[19px] md:text-[20px] text-stone-900 dark:text-stone-100 tracking-wide leading-snug">
          {title}
        </h3>
      </div>

      {/* Subtle hairline gradient dividing line */}
      <div className="h-px bg-gradient-to-r from-[#CD7743]/25 via-stone-200/40 dark:via-stone-800/50 to-transparent mt-2.5 max-w-xl" />
    </div>
  );
};

const splitIntoParagraphs = (commentary: string): string[] => {
  if (!commentary) return [];

  const initialChunks = commentary.split(/\n\s*\n/);
  const result: string[] = [];

  for (const chunk of initialChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) {
      result.push(trimmed);
      continue;
    }

    let currentPara: string[] = [];
    for (const line of lines) {
      if (currentPara.length === 0) {
        currentPara.push(line);
        continue;
      }

      const prevLine = currentPara[currentPara.length - 1];

      const isSub = isSubheading(line) || isSubheading(prevLine);
      const isVerseMarker = /^\[\s*Verses?/i.test(line) || /^\[\s*Verses?/i.test(prevLine);
      const isDivider = /^[─\-_=~*]{3,}$/.test(line) || /^[─\-_=~*]{3,}$/.test(prevLine);
      const isQuoteLine = /^[“"]/.test(line) || /^[“"]/.test(prevLine);
      const isArabicLine = /^[\u0600-\u06FF\s]+$/.test(line) || /^[\u0600-\u06FF\s]+$/.test(prevLine);
      const isNumberedItem = /^\d+\.\s+/.test(line);

      const isPrevTerminated = /[.?!”")'\]:—–-]$/.test(prevLine);
      const isCurrCapital = /^[A-Z0-9“"‘'\[]/.test(line);

      if (
        isSub ||
        isVerseMarker ||
        isDivider ||
        isQuoteLine ||
        isArabicLine ||
        isNumberedItem ||
        (isPrevTerminated && isCurrCapital)
      ) {
        result.push(currentPara.join('\n'));
        currentPara = [line];
      } else {
        currentPara.push(line);
      }
    }

    if (currentPara.length > 0) {
      result.push(currentPara.join('\n'));
    }
  }

  // Break dense monolithic paragraphs (> 950 chars) at clear topic transition sentences
  const finalParas: string[] = [];
  for (const p of result) {
    if (p.length > 950 && !p.includes('\n')) {
      const subparts = p.split(
        /(?<=[.?!])\s+(?=(?:This goes to prove|But, in order to guard against|Secondly,|The other doctrinal point|On the other hand,|In short,|To sum up,|In view of this|In fact, such Muslims))\b/
      );
      if (subparts.length > 1) {
        for (const sp of subparts) {
          const sTrim = sp.trim();
          if (sTrim) finalParas.push(sTrim);
        }
        continue;
      }
    }
    finalParas.push(p);
  }

  return finalParas;
};

const TafseerCommentaryBlock: React.FC<{
  commentary: string;
  sectionSummary?: string;
  summaryPoints: string[];
  subsections?: SubSection[];
  versesData?: Array<{
    vNum: number;
    verseTranslation?: string;
  }>;
  surahNumber?: number;
  surahName?: string;
  verseRange?: [number, number];
  phraseCards?: PhraseCard[];
}> = ({
  commentary,
  sectionSummary,
  summaryPoints,
  subsections,
  versesData,
  surahNumber,
  surahName,
  verseRange,
  phraseCards,
}) => {
  // Quick lookup for verse English translations from versesData
  const verseSnippetMap = React.useMemo(() => {
    const map = new Map<number, string>();
    if (versesData) {
      versesData.forEach((vd) => {
        if (vd.verseTranslation) {
          map.set(vd.vNum, vd.verseTranslation);
        }
      });
    }
    return map;
  }, [versesData]);

  // Parse commentary paragraphs and replace raw [Verse X], Hadith quotes, and scholar citations
  const parsedCommentaryBlocks = React.useMemo(() => {
    if (!commentary) return [];

    const rawParagraphs = splitIntoParagraphs(commentary);
    const blocks: RawCommentaryBlock[] = [];
    let currentVerseHeadingNumber: number | null = null;

    const duaRegex =
      /((?:(?:(?:The\s+)?Prayer\s+for\s+[^\n]+|Du['’`]?a\s+(?:for|when|after|before)\s+[^\n]+|Supplication\s+(?:for|of)\s+[^\n]+)\n(?:[^\n]*?(?:taught|teaches|instructs|pray|supplicat)[^\n]*:\s*\n)?(?:[\u0600-\u06FF\s]+\n)?[“"][^”"\n]+[”"]|[^\n]*?(?:taught\s+(?:man|us|the\s+believers|Muslims)\s+(?:what\s+to\s+pray|how\s+to\s+pray|this\s+prayer|this\s+du['’`]?a|a\s+special\s+du['’`]?a)|teaches\s+Muslims\s+to\s+make\s+a\s+special\s+du['’`]?a|supplicated\s+(?:with\s+these\s+words|in\s+these\s+words)|used\s+to\s+make\s+this\s+(?:prayer|du['’`]?a))[^\n]*:\s*\n(?:[\u0600-\u06FF\s]+\n)?[“"][^”"\n]+[”"]|(?:رَ‌?بَّنَا|اللَّهُمَّ|رَبِّ)[\u0600-\u06FF\s،]+\n[“"][^”"\n]+[”"]))/gi;

    const hadithRegex =
      /((?:The\s+Sahih\s+of\s+[A-Za-z]+|According\s+to\s+a\s+hadith|In\s+a\s+hadith|The\s+Holy\s+Prophet\s*(?:\([^)]+\))?\s*(?:said|has\s+said|continued|reported))[^\n]*:[\s\S]*?\([a-zA-Z\s`'-]+\))/gi;

    const processParagraph = (textToProcess: string): RawCommentaryBlock[] => {
      const t = textToProcess.trim();
      if (!t) return [];

      // 1. Check if Dua / Supplication exists (embedded or multi-line)
      duaRegex.lastIndex = 0;
      const duaMatch = duaRegex.exec(t);
      if (duaMatch) {
        const matchStart = duaMatch.index;
        const matchEnd = matchStart + duaMatch[0].length;
        const before = t.slice(0, matchStart).trim();
        const duaContent = duaMatch[0].trim();
        const after = t.slice(matchEnd).trim();

        const result: RawCommentaryBlock[] = [];

        if (before) {
          result.push(...processParagraph(before));
        }
        result.push({
          type: 'quote',
          quoteType: 'dua',
          content: duaContent,
        });
        if (after) {
          result.push(...processParagraph(after));
        }
        return result;
      }

      // 2. Check if a structured Hadith is embedded in the text
      hadithRegex.lastIndex = 0;
      const hadithMatch = hadithRegex.exec(t);
      if (hadithMatch) {
        const matchStart = hadithMatch.index;
        const matchEnd = matchStart + hadithMatch[0].length;
        const before = t.slice(0, matchStart).trim();
        const hadithContent = hadithMatch[0].trim();
        const after = t.slice(matchEnd).trim();

        const result: RawCommentaryBlock[] = [];

        if (before) {
          result.push(...processParagraph(before));
        }
        result.push({
          type: 'quote',
          quoteType: 'hadith',
          content: hadithContent,
        });
        if (after) {
          result.push(...processParagraph(after));
        }
        return result;
      }

      // 3. Check Subheadings within this text segment
      const lines = t.split('\n');
      if (lines.length === 1 && isSubheading(lines[0])) {
        return [{ type: 'subheading', content: lines[0].trim() }];
      }

      if (lines.some((l) => isSubheading(l))) {
        const result: RawCommentaryBlock[] = [];

        let currentLines: string[] = [];
        for (const line of lines) {
          if (isSubheading(line)) {
            if (currentLines.length > 0) {
              const seg = currentLines.join('\n').trim();
              if (seg) {
                result.push(...processParagraph(seg));
              }
              currentLines = [];
            }
            result.push({ type: 'subheading', content: line.trim() });
          } else {
            currentLines.push(line);
          }
        }

        if (currentLines.length > 0) {
          const seg = currentLines.join('\n').trim();
          if (seg) {
            result.push(...processParagraph(seg));
          }
        }
        return result;
      }

      // 4. Standalone Hadith Quote
      const isStandaloneHadith =
        /^(?:(?:The\s+)?Sahih\s+(?:of\s+)?(?:Muslim|Bukhari|al-Bukhari)|(?:In\s+a\s+|According\s+to\s+a\s+)?(?:Hadith|Tradition)\b|The\s+Holy\s+Prophet\s*(?:\([^)]+\)|ﷺ)?\s*(?:said|has\s+said|continued|reported)|The\s+Messenger\s+of\s+Allah\s*(?:\([^)]+\)|ﷺ)?\s*(?:said|has\s+said))\b/i.test(
          t
        ) && (/[:"“]/.test(t) || /Allah\s+says:/i.test(t));

      if (isStandaloneHadith) {
        return [{ type: 'quote', quoteType: 'hadith', content: t }];
      }

      // 4. Standalone Dua Quote
      const isStandaloneDua =
        /^(?:(?:The\s+)?Prayer\s+for\s+|Du['’`]?a\s+(?:for|when|after|before)\s+|Supplication\s+(?:for|of)\s+)/i.test(
          t
        ) && (/[“"]/.test(t) || /[\u0600-\u06FF]{4,}/.test(t));

      if (isStandaloneDua) {
        return [{ type: 'quote', quoteType: 'dua', content: t }];
      }

      // 5. Scholar / Classical Exegete Quote
      const isScholar =
        /^(?:Imam\s+(?:Razi|Abu\s+Hanifah|Shafi|Malik|al-Ghazali|al-Qurtubi|al-Baghawi|Ibn\s+Kathir)|The\s+famous\s+commentator\s+(?:al-Suyuti|Qurtubi|Razi)|According\s+to\s+(?:the\s+great\s+commentator|the\s+well-known\s+commentator|Imam\s+Abu\s+Hanifah|al-Suyuti|Qurtubi|Ibn\s+Kathir|Muqatil|Ibn\s+Abbas)|Al-Qurtubi\s+remarks)\b/i.test(
          t
        ) &&
        /(?:says|said|writes|explains|states|remarks|notes|postulated)\b|[:"]/i.test(
          t
        ) &&
        t.length < 650;

      if (isScholar) {
        return [{ type: 'quote', quoteType: 'scholar', content: t }];
      }

      // 6. Qur'an Scripture citation quote within exegesis
      const isQuranQuote =
        (/["“][^"”]{10,}["”]\s*\(\d+:\s*\d+(?:[-–—]\d+)?\)/.test(t) ||
          (/^\s*["“]/.test(t) && /\(\d+:\s*\d+(?:[-–—]\d+)?\)/.test(t))) &&
        t.length < 500;

      if (isQuranQuote) {
        const matched = matchAyahFromSection(undefined, t, phraseCards);
        const resolvedVerse =
          matched ??
          currentVerseHeadingNumber ??
          (verseRange ? (verseRange[0] === verseRange[1] ? verseRange[0] : `${verseRange[0]}–${verseRange[1]}`) : undefined);
        return [{ type: 'quote', quoteType: 'quran', content: t, verseNumber: resolvedVerse }];
      }

      // 7. Regular prose text
      return [{ type: 'text', content: t }];
    };

    let i = 0;
    while (i < rawParagraphs.length) {
      const trimmed = rawParagraphs[i].trim();
      if (!trimmed) {
        i++;
        continue;
      }

      // Filter out redundant raw ASCII divider lines like ────────────────────────────────────────
      if (/^[─\-_=~*]{3,}$/.test(trimmed)) {
        i++;
        continue;
      }

      // Check if this paragraph is a verse heading like [Verse 1] or [Verses 4–5]
      if (/^\[\s*Verses?\s*[\d\s\-–—,and]+\s*\]$/i.test(trimmed)) {
        const { primaryNum } = parseVerseMarker(trimmed);
        currentVerseHeadingNumber = primaryNum;
        blocks.push({
          type: 'verse-heading',
          raw: trimmed,
        });
        i++;
        continue;
      }

      // Check if trimmed is predominantly Arabic (e.g. Qur'an Ayah or Hadith citation)
      // and followed by an English translation or citation in the next paragraph
      const arMatches = (trimmed.match(/[\u0600-\u06FF]/g) || []).length;
      const latinMatches = (trimmed.match(/[a-zA-Z]/g) || []).length;
      const isArabic = arMatches >= 6 && latinMatches <= 4 && trimmed.length < 600;

      if (isArabic && i + 1 < rawParagraphs.length) {
        const nextPara = rawParagraphs[i + 1].trim();
        const isNextHeading = /^\[\s*Verses?/i.test(nextPara) || isSubheading(nextPara);
        const hasCite = /\(\d+:\s*\d+(?:[-–—]\d+)?\)/.test(nextPara);
        const hasQuotes = /["“][^"”]{5,}["”]/.test(nextPara) || nextPara.startsWith('"') || nextPara.startsWith('“');
        const isShortTrans = nextPara.length < 500 && !isNextHeading;

        if (!isNextHeading && (hasCite || hasQuotes || isShortTrans)) {
          const isHadith = /(?:Prophet|Hadith|Tradition|Bukhari|Muslim|Messenger)/i.test(nextPara);
          const quoteType: QuoteType = isHadith ? 'hadith' : 'quran';
          let verseNumber: number | string | undefined = undefined;
          if (quoteType === 'quran') {
            const matched = matchAyahFromSection(trimmed, nextPara, phraseCards);
            verseNumber =
              matched ??
              currentVerseHeadingNumber ??
              (verseRange ? (verseRange[0] === verseRange[1] ? verseRange[0] : `${verseRange[0]}–${verseRange[1]}`) : undefined);
          }
          blocks.push({
            type: 'quote',
            quoteType,
            arabic: trimmed,
            english: nextPara,
            content: `${trimmed}\n\n${nextPara}`,
            verseNumber,
          });
          i += 2;
          continue;
        }
      }

      blocks.push(...processParagraph(trimmed));
      i++;
    }

    // Defensive coalescing pass: prevent back-to-back blank subheadings
    const cleanedBlocks: RawCommentaryBlock[] = [];
    for (let k = 0; k < blocks.length; k++) {
      const curr = blocks[k];
      const prev = cleanedBlocks[cleanedBlocks.length - 1];

      if (curr.type === 'subheading' && prev && prev.type === 'subheading') {
        const isContinuation =
          /^(?:or|and|to|of|for|in|with)\b/i.test(curr.content) || /^[a-z]/.test(curr.content);
        const separator = isContinuation ? ' ' : ' — ';
        prev.content = `${prev.content.replace(/[:—–-]$/, '')}${separator}${curr.content}`;
      } else {
        cleanedBlocks.push(curr);
      }
    }

    return cleanedBlocks;
  }, [commentary, phraseCards, verseRange]);

  // Interleave Fiqh (Ahkam), Asbab al-Nuzul, and Spiritual Insights cards throughout the section's commentary
  const commentaryBlocks = React.useMemo(() => {
    return interleaveStudyCards(parsedCommentaryBlocks, subsections);
  }, [parsedCommentaryBlocks, subsections]);

  return (
    <div className="space-y-5 pt-2">
      {/* Header bar without toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#CD7743] dark:text-[#E08955]">
          Tafseer
        </span>
        <span className="text-xs text-stone-400 dark:text-stone-500 font-reader">
          Ma'ariful Qur'an Commentary
        </span>
      </div>

      {/* Baked-in Key Takeaways Card */}
      {(sectionSummary || (summaryPoints && summaryPoints.length > 0)) && (
        <TafseerStudyCard
          type="takeaways"
          summary={sectionSummary}
          points={summaryPoints}
        />
      )}

      {/* Full Commentary Flow with Inlined Topical Study Cards */}
      <div className="space-y-6">
        <div className="text-[16px] sm:text-[17px] leading-[1.85] text-[#292524] dark:text-[#D6D3D1] space-y-4 font-reader">
          {commentaryBlocks.map((block, idx) => {
            if (block.type === 'verse-heading') {
              const { primaryNum } = parseVerseMarker(block.raw);
              const snippet = verseSnippetMap.get(primaryNum);
              return (
                <TafseerVerseHeading
                  key={`cvh-${idx}-${block.raw}`}
                  label={block.raw}
                  verseSnippet={snippet}
                />
              );
            }

            if (block.type === 'subheading') {
              return (
                <TafseerSubheading
                  key={`csub-${idx}-${block.content.slice(0, 20)}`}
                  title={block.content}
                />
              );
            }

            if (block.type === 'quote') {
              return (
                <TafseerQuoteCard
                  key={`cq-${idx}`}
                  type={block.quoteType}
                  rawText={block.content}
                  arabic={block.arabic}
                  english={block.english}
                  source={block.source}
                  surahNumber={surahNumber}
                  surahName={surahName}
                  verseNumber={block.verseNumber}
                />
              );
            }

            if (block.type === 'study-card') {
              return (
                <div key={`cstudy-${idx}-${block.card.title}`} className="my-6">
                  <TafseerStudyCard
                    type={block.card.type as StudyCardType}
                    title={block.card.title}
                    content={block.card.content}
                  />
                </div>
              );
            }

            return (
              <p key={`cp-${idx}`} className="leading-[1.85] whitespace-pre-line">
                {block.content}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TafseerSectionView: React.FC<TafseerSectionViewProps> = ({
  section,
  viewMode,
  isActive,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
  const surahName = SURAH_TRANSLITERATED_NAMES[section.surahNumber];

  // Distill key takeaways and wisdom points for quick summary mode
  const summaryPoints = React.useMemo(() => {
    if (!section.commentary) return [];
    const paragraphs = section.commentary
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(
        (p) =>
          p.length > 25 &&
          !p.startsWith('[Verse') &&
          !/^[─\-_=~*]{3,}$/.test(p)
      );

    if (paragraphs.length <= 1) {
      const sentences = section.commentary
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 30);
      return sentences.slice(0, 3);
    }

    return paragraphs.slice(0, 3).map((p) => {
      const firstSentence = p.split(/(?<=[.?!])\s+/)[0];
      return firstSentence && firstSentence.length > 35
        ? firstSentence.replace(/^[\s•\-\d.)]+/, '').trim()
        : p.slice(0, 160) + '...';
    });
  }, [section.commentary]);

  // Build structured verse data for combined mode
  const versesData = React.useMemo(() => {
    const list: {
      vNum: number;
      words: WordItemProps[];
      verseTranslation: string;
    }[] = [];

    // Map existing phrase cards by verseNumber
    const cardsByVerse = new Map<number, PhraseCard[]>();
    if (section.phraseCards && section.phraseCards.length > 0) {
      section.phraseCards.forEach((card) => {
        const vNum = card.verseNumber || section.verseRange[0];
        const arr = cardsByVerse.get(vNum) || [];
        arr.push(card);
        cardsByVerse.set(vNum, arr);
      });
    }

    const startV = section.verseRange[0];
    const endV = section.verseRange[1];

    for (let v = startV; v <= endV; v++) {
      const cards = cardsByVerse.get(v);
      const words: WordItemProps[] = [];
      const translations: string[] = [];

      if (cards && cards.length > 0) {
        cards.forEach((card) => {
          if (card.englishPhrase) {
            translations.push(card.englishPhrase);
          }

          if (card.vocabulary && card.vocabulary.length > 0) {
            card.vocabulary.forEach((voc) => {
              words.push({
                word: voc.word,
                meaning: voc.meaning,
                root: voc.root,
                grammarNote: voc.grammarNote,
              });
            });
          } else if (card.arabicPhrase) {
            // Fallback: split phrase into words
            const splitWords = card.arabicPhrase.trim().split(/\s+/);
            splitWords.forEach((sw) => {
              if (sw) {
                const deep = getWordDeepDive(sw);
                words.push({
                  word: sw,
                  meaning: deep.primaryMeaning || card.englishPhrase,
                  root: deep.root,
                  grammarNote: deep.partOfSpeech,
                });
              }
            });
          }
        });
      }

      // If verse has words, include it
      if (words.length > 0) {
        list.push({
          vNum: v,
          words,
          verseTranslation: translations.join(' '),
        });
      }
    }

    // Fallback if no cards were matched
    if (list.length === 0 && section.phraseCards) {
      section.phraseCards.forEach((card, idx) => {
        const vNum = card.verseNumber || startV + idx;
        const words: WordItemProps[] = [];
        if (card.vocabulary && card.vocabulary.length > 0) {
          card.vocabulary.forEach((voc) => {
            words.push({
              word: voc.word,
              meaning: voc.meaning,
              root: voc.root,
              grammarNote: voc.grammarNote,
            });
          });
        } else {
          words.push({
            word: card.arabicPhrase,
            meaning: card.englishPhrase,
          });
        }
        list.push({
          vNum,
          words,
          verseTranslation: card.englishPhrase,
        });
      });
    }

    return list;
  }, [section.phraseCards, section.verseRange]);

  return (
    <section
      id={section.id}
      data-section-id={section.id}
      className="tafseer-section-optimized scroll-mt-20 py-5 sm:py-7 px-2.5 sm:px-6 md:px-8 border-b border-[#E8E5DF] dark:border-[#2E2E33]"
    >
      {/* Section Header with Collapse Toggle */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-[#596B8E] dark:text-[#788BB3] uppercase tracking-wider mb-1.5">
            <span className="text-[#CD7743] dark:text-[#E08955] font-semibold">
              Verses {section.verseRange[0]}–{section.verseRange[1]}
            </span>
            <span aria-hidden="true">·</span>
            <span>Juz {section.juzNumber}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{section.revelationType}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif-heading font-semibold text-[#1C1917] dark:text-[#F3F4F6] tracking-tight">
            {section.title}
          </h2>
          {section.summary && (
            <p className="mt-1.5 text-sm sm:text-[15px] text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
              {section.summary}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-1">
          {/* Bookmark Section Button (Icon only - no text) */}
          {onToggleBookmark && (
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                isBookmarked
                  ? 'bg-[#CD7743]/15 dark:bg-[#CD7743]/25 text-[#CD7743] dark:text-[#E08955] border-[#CD7743]/50 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-800/50 hover:text-red-600'
                  : 'border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#25252A] hover:bg-stone-50 dark:hover:bg-[#2B2B32] text-stone-400 hover:text-[#CD7743] dark:hover:text-[#E08955]'
              }`}
              title={isBookmarked ? 'Bookmarked — click to unbookmark' : 'Bookmark this section'}
              aria-label={isBookmarked ? `Unbookmark section ${section.title}` : `Bookmark section ${section.title}`}
            >
              <Bookmark
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isBookmarked
                    ? 'fill-[#CD7743] text-[#CD7743]'
                    : 'text-stone-400 dark:text-stone-400'
                }`}
              />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSectionCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-[#25252A] hover:bg-stone-50 dark:hover:bg-[#2B2B32] text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-[#CD7743] dark:hover:text-[#E08955] transition-all cursor-pointer shadow-2xs"
            title={isSectionCollapsed ? 'Expand section' : 'Collapse section'}
            aria-label={isSectionCollapsed ? `Expand section ${section.title}` : `Collapse section ${section.title}`}
          >
            {isSectionCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#CD7743] dark:text-[#E08955]" />
                <span>Expand Section</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#596B8E] dark:text-[#788BB3]" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isSectionCollapsed && (
        <>
          {viewMode === 'separate' ? (
        /* ================= STANDARD SEPARATE VIEW ================= */
        <div className="space-y-6">
          {/* Arabic Mushaf Block: Majestic book spread presentation */}
          <div
            dir="rtl"
            className="font-quran text-[26px] sm:text-[30px] md:text-[32px] leading-[2.2] sm:leading-[2.4] text-right text-[#111827] dark:text-[#F9FAFB] p-5 sm:p-8 rounded-2xl bg-[#FCFAF7] dark:bg-[#1E1E22] border border-[#ECE7DF] dark:border-[#2D2D33] shadow-xs select-text tracking-wide"
          >
            {section.arabicText}
          </div>

          {/* Translation Block */}
          <div id="translation-block" className="p-4 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#202024]/80 border border-[#EBE7DF] dark:border-[#2B2B30] shadow-2xs scroll-mt-24">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
              Translation
            </div>
            <AnnotatedTranslation
              text={section.translation}
              curatedTerms={section.curatedTerms}
              verseRange={section.verseRange}
            />
          </div>

          {/* Tafseer Commentary Block with Baked-in Key Takeaways and Unified Study Cards */}
          <TafseerCommentaryBlock
            commentary={section.commentary}
            sectionSummary={section.summary}
            summaryPoints={summaryPoints}
            subsections={section.subsections}
            versesData={versesData}
            surahNumber={section.surahNumber}
            surahName={surahName}
            verseRange={section.verseRange}
            phraseCards={section.phraseCards}
          />
        </div>
      ) : (
        /* ================= INLINE WORD-BY-WORD FLOW (ALWAYS ARABIC ORDER) ================= */
        <div className="space-y-3 sm:space-y-4">

          {/* Verses Stack: Compact, space-efficient cards for each verse */}
          <div className="space-y-2 sm:space-y-2.5">
            {versesData.map(({ vNum, words, verseTranslation }) => (
              <div
                key={`verse-card-${vNum}`}
                id={`verse-card-${vNum}`}
                className="p-2 sm:p-3 rounded-xl bg-white dark:bg-[#1E1E23] border border-[#EBE6DC] dark:border-[#2C2C32] shadow-2xs space-y-1.5 transition-all scroll-mt-24"
              >
                {/* Flowing Word-by-Word Units (Always Arabic RTL order) with Islamic Rosette Ayah Indicator at end */}
                <div
                  dir="rtl"
                  className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 py-1 px-0.5 sm:px-1"
                >
                  {words.map((item, wIdx) => {
                    const isLastWord = wIdx === words.length - 1;
                    if (isLastWord) {
                      return (
                        <div
                          key={`word-end-${vNum}`}
                          className="inline-flex items-center gap-1 sm:gap-1.5 shrink-0"
                        >
                          <WordItem
                            key={`word-${vNum}-${wIdx}`}
                            word={item.word}
                            meaning={item.meaning}
                            root={item.root}
                            grammarNote={item.grammarNote}
                          />
                          <AyahEndMarker vNum={vNum} />
                        </div>
                      );
                    }
                    return (
                      <WordItem
                        key={`word-${vNum}-${wIdx}`}
                        word={item.word}
                        meaning={item.meaning}
                        root={item.root}
                        grammarNote={item.grammarNote}
                      />
                    );
                  })}
                  {words.length === 0 && <AyahEndMarker vNum={vNum} />}
                </div>

                {/* Compact Cohesive English Translation (Centered) */}
                {verseTranslation && (
                  <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800/60 text-center">
                    <p className="font-reader text-[13px] sm:text-[14px] leading-snug text-stone-700 dark:text-stone-300 max-w-3xl mx-auto text-center">
                      <span className="font-semibold text-[#CD7743] dark:text-[#E08955] mr-1.5 not-italic">({vNum})</span>
                      <span className="italic">"{verseTranslation}"</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tafseer Commentary Block with Baked-in Key Takeaways and Unified Study Cards */}
          <div className="pt-4 border-t border-[#E8E5DF] dark:border-[#2E2E33]">
            <TafseerCommentaryBlock
              commentary={section.commentary}
              sectionSummary={section.summary}
              summaryPoints={summaryPoints}
              subsections={section.subsections}
              versesData={versesData}
              surahNumber={section.surahNumber}
              surahName={surahName}
              verseRange={section.verseRange}
              phraseCards={section.phraseCards}
            />
          </div>
        </div>
      )}
        </>
      )}
    </section>
  );
};
