import React from 'react';
import { BookOpen, Quote, Sparkles } from 'lucide-react';
import { parseQuranCitation, formatQuranCitationFooter } from '../utils/quranCitation';
import { parseHadithCitation } from '../utils/hadithCitation';
import { parseScholarCitation } from '../utils/scholarCitation';

export type QuoteType = 'hadith' | 'scholar' | 'quran' | 'dua';

export interface TafseerQuoteCardProps {
  type: QuoteType;
  rawText?: string;
  arabic?: string;
  english?: string;
  source?: string;
  surahNumber?: number;
  surahName?: string;
  verseNumber?: number | string;
}

const formatCitationLabel = (text: string): string | null => {
  const match = text.match(/\(([^)]+)\)\s*[."”']*\s*$/);
  if (!match) return null;
  const raw = match[1].trim();

  // Check surah:verse like (38:27) or (2:220) or (64:2) or (87:1-2)
  const verseMatch = raw.match(/^(\d+)\s*:\s*(\d+)(?:\s*[-–—]\s*(\d+))?$/);
  if (verseMatch) {
    const sNum = parseInt(verseMatch[1], 10);
    const vStart = parseInt(verseMatch[2], 10);
    const vEnd = verseMatch[3] ? parseInt(verseMatch[3], 10) : undefined;
    return formatQuranCitationFooter({
      surahNumber: sNum,
      verseStart: vStart,
      verseEnd: vEnd,
    });
  }

  const lower = raw.toLowerCase();
  if (lower.includes('mazhari')) return 'Tafseer Mazhari';
  if (lower.includes('qurtubi')) return 'Tafseer al-Qurtubi';
  if (lower.includes('bukhari')) return 'Sahih al-Bukhari';
  if (lower.includes('muslim')) return 'Sahih Muslim';
  if (lower.includes('tirmidhi')) return "Jami' al-Tirmidhi";
  if (lower.includes('abu dawud')) return 'Sunan Abi Dawud';
  if (lower.includes('ibn kathir')) return 'Tafseer Ibn Kathir';
  if (lower.includes('ibn jarir') || lower.includes('tabari')) return 'Tafseer al-Tabari';
  if (lower.includes('ruh al-ma')) return "Ruh al-Ma'ani";
  if (lower.includes('baghawi')) return 'Tafseer al-Baghawi';

  // Capitalize general citation
  if (raw.length > 2 && raw.length < 35) {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return null;
};

export const TafseerQuoteCard: React.FC<TafseerQuoteCardProps> = ({
  type,
  rawText,
  arabic,
  english,
  source,
  surahNumber,
  surahName,
  verseNumber,
}) => {
  const fullText = [rawText, english, arabic].filter(Boolean).join(' ');
  const detectedCitation = formatCitationLabel(fullText) || source;

  // Extract structured Qur'an citation if this is a Qur'anic scripture card
  const quranCitation = React.useMemo(() => {
    if (type !== 'quran') return null;
    return parseQuranCitation([rawText, english, arabic, source].filter(Boolean).join(' '));
  }, [type, rawText, english, arabic, source]);

  // Determine if this is a Hadith Qudsi (where Allah speaks in the first person)
  const isHadithQudsi =
    type === 'hadith' &&
    (/Allah\s+(?:has\s+)?said|Allah\s+says/i.test(fullText) ||
      fullText.toLowerCase().includes('mazhari'));

  // Extract structured Hadith citation and compiler source if this is a Hadith card
  const hadithCitation = React.useMemo(() => {
    if (type !== 'hadith') return null;
    return parseHadithCitation(fullText, isHadithQudsi, source);
  }, [type, fullText, isHadithQudsi, source]);

  // Extract structured Classical Authority citation if this is a Scholar card
  const scholarCitation = React.useMemo(() => {
    if (type !== 'scholar') return null;
    return parseScholarCitation(fullText, source);
  }, [type, fullText, source]);

  // Determine badge and border styling based on quote type (thin border all around)
  const theme = React.useMemo(() => {
    switch (type) {
      case 'hadith':
        return {
          icon: isHadithQudsi ? Sparkles : BookOpen,
          badgeTitle: hadithCitation
            ? hadithCitation.badgeLabel
            : isHadithQudsi
            ? 'Hadith Qudsi'
            : 'Hadith',
          badgeClasses: 'text-[#CD7743] dark:text-[#E08955]',
          badgeBgClasses: 'bg-[#CD7743]/10 dark:bg-[#CD7743]/20',
          borderClasses: 'border-[#CD7743]/30 dark:border-[#E08955]/35 hover:border-[#CD7743]/50',
          defaultSource:
            hadithCitation?.fullCitation ||
            (isHadithQudsi
              ? 'Words of Allah (Hadith Qudsi) · The Holy Prophet ﷺ'
              : 'The Holy Prophet ﷺ · Prophetic Hadith'),
        };
      case 'scholar':
        return {
          icon: Quote,
          badgeTitle: 'Classical Authority',
          badgeClasses: 'text-[#596B8E] dark:text-[#788BB3]',
          badgeBgClasses: 'bg-[#596B8E]/10 dark:bg-[#596B8E]/20',
          borderClasses: 'border-[#596B8E]/30 dark:border-[#788BB3]/35 hover:border-[#596B8E]/50',
          defaultSource: scholarCitation?.fullCitation || "Ma'ariful Qur'an Classical Exegesis",
        };
      case 'quran':
        return {
          icon: BookOpen,
          badgeTitle: "Qur'an",
          badgeClasses: 'text-[#4C7971] dark:text-[#639C92]',
          badgeBgClasses: 'bg-[#4C7971]/10 dark:bg-[#4C7971]/20',
          borderClasses: 'border-[#4C7971]/30 dark:border-[#639C92]/35 hover:border-[#4C7971]/50',
          defaultSource: surahNumber
            ? formatQuranCitationFooter({ surahNumber, surahName })
            : 'The Holy Qur’an',
        };
      case 'dua':
        return {
          icon: Sparkles,
          badgeTitle: "Supplication & Prayer · Du'a",
          badgeClasses: 'text-[#2D7266] dark:text-[#4AA291]',
          badgeBgClasses: 'bg-[#2D7266]/10 dark:bg-[#2D7266]/20',
          borderClasses: 'border-[#2D7266]/30 dark:border-[#4AA291]/35 hover:border-[#2D7266]/50',
          defaultSource: "Qur'anic Supplication & Prophetic Du'a",
        };
    }
  }, [type, isHadithQudsi, hadithCitation, scholarCitation, surahNumber, surahName]);

  const IconComponent = theme.icon;

  // Extract separate Arabic and English segments if not directly provided
  const { arabicText, englishText } = React.useMemo(() => {
    if (arabic || english) {
      return { arabicText: arabic, englishText: english };
    }

    const textToAnalyze = rawText || '';
    const textLines = textToAnalyze.split('\n').map((l) => l.trim()).filter(Boolean);
    const arLines: string[] = [];
    const enLines: string[] = [];

    for (const l of textLines) {
      const arCount = (l.match(/[\u0600-\u06FF]/g) || []).length;
      const enCount = (l.match(/[a-zA-Z]/g) || []).length;
      if (arCount >= 4 && arCount > enCount) {
        arLines.push(l);
      } else {
        enLines.push(l);
      }
    }

    let cleanedEn = enLines.length > 0 ? enLines.join('\n') : textToAnalyze;

    // For hadith and scholar quotes, strip trailing parenthetical citations like (Ibn Kathir), (Bukhari), etc.
    // since they are already displayed cleanly in the footer citation
    if (type === 'hadith' || type === 'scholar') {
      cleanedEn = cleanedEn.replace(
        /\s*\((?:See\s+|Recorded\s+by\s+|Narrated\s+by\s+)?[^)]+\)\s*[."”']*\s*$/i,
        (match) => {
          // If the match ends with closing quote or period, preserve the sentence punctuation
          if (/[."”']/.test(match)) {
            const punct = match.match(/[."”']+$/);
            return punct ? punct[0] : '';
          }
          return '';
        }
      );
    }

    return {
      arabicText: arLines.length > 0 ? arLines.join('\n') : undefined,
      englishText: cleanedEn,
    };
  }, [arabic, english, rawText, type]);

  // Dua parsing for structured supplications
  const parsedDua = React.useMemo(() => {
    if (type !== 'dua') return null;

    const sourceLines = (rawText || `${arabic || ''}\n${english || ''}`)
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let title: string | null = null;
    let leadIn: string | null = null;
    const arabicLines: string[] = [];
    const prayerQuotes: string[] = [];
    const generalLines: string[] = [];

    let currentLines = [...sourceLines];

    if (
      currentLines.length > 0 &&
      /^(?:(?:The\s+)?Prayer\s+for|Du['’`]?a\s+|Supplication\s+)/i.test(currentLines[0]) &&
      currentLines[0].length < 75 &&
      !/[:"“]/.test(currentLines[0])
    ) {
      title = currentLines[0];
      currentLines = currentLines.slice(1);
    }

    for (const l of currentLines) {
      const isAr = /[\u0600-\u06FF]{4,}/.test(l);
      const isQuote = /^[“"][^”"]+[”"]$/.test(l) || /^[“"]/.test(l);
      const isLeadIn =
        /(?:taught|teaches|instructs|pray|supplicat|last\s+three\s+verses|prayer\s+on\s+the\s+part\s+of\s+man)[^:]*:\s*$/i.test(
          l
        );

      if (isAr) {
        arabicLines.push(l);
      } else if (isQuote) {
        prayerQuotes.push(l);
      } else if (isLeadIn && !leadIn) {
        leadIn = l;
      } else {
        generalLines.push(l);
      }
    }

    if (!leadIn && generalLines.length > 0 && (prayerQuotes.length > 0 || arabicLines.length > 0)) {
      leadIn = generalLines.join(' ');
      generalLines.length = 0;
    }

    return {
      title,
      leadIn,
      arabicLines,
      prayerQuotes,
      generalLines,
    };
  }, [type, rawText, arabic, english]);

  return (
    <div
      className={`not-prose my-5 rounded-2xl bg-[#FCFAF7] dark:bg-[#1E1E23] border ${theme.borderClasses} p-4 sm:p-5 shadow-2xs space-y-3.5 transition-all select-text`}
    >
      {/* Header bar with category badge */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${theme.badgeBgClasses} shrink-0`}>
            <IconComponent className={`w-3.5 h-3.5 ${theme.badgeClasses}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${theme.badgeClasses}`}>
            {theme.badgeTitle}
          </span>
        </div>
      </div>

      {/* Dua Supplication Body */}
      {type === 'dua' && parsedDua ? (
        <div className="space-y-3 pt-0.5">
          {parsedDua.title && (
            <h4 className="font-serif-heading font-bold text-[16px] sm:text-[17.5px] text-[#2D7266] dark:text-[#4AA291] tracking-wide pt-0.5">
              {parsedDua.title}
            </h4>
          )}

          {parsedDua.leadIn && (
            <p className="font-reader text-[14.5px] sm:text-[15.5px] leading-relaxed text-stone-700 dark:text-stone-300">
              {parsedDua.leadIn}
            </p>
          )}

          <div className="rounded-xl bg-[#2D7266]/5 dark:bg-[#2D7266]/10 border border-[#2D7266]/20 dark:border-[#2D7266]/30 p-3.5 sm:p-4 my-2 space-y-2">
            {parsedDua.arabicLines.map((line, idx) => (
              <div
                key={`dua-ar-${idx}`}
                dir="rtl"
                className="font-quran text-xl sm:text-2xl text-[#2D7266] dark:text-[#4AA291] text-right leading-loose select-text"
              >
                {line}
              </div>
            ))}

            {parsedDua.prayerQuotes.length > 0 ? (
              <div className="font-reader text-[15.5px] sm:text-[16.5px] font-medium italic text-stone-900 dark:text-stone-100 leading-[1.8] whitespace-pre-line select-text">
                {parsedDua.prayerQuotes.join('\n')}
              </div>
            ) : parsedDua.generalLines.length > 0 ? (
              <div className="font-reader text-[15px] sm:text-[16px] italic text-stone-800 dark:text-stone-200 leading-[1.8] whitespace-pre-line select-text">
                {parsedDua.generalLines.join('\n')}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Scripture, Hadith, or Scholar Card with Arabic + English */
        <div className="space-y-3 pt-0.5">
          {/* Arabic Scripture / Hadith text */}
          {arabicText && (
            <div
              dir="rtl"
              className="font-quran text-xl sm:text-[23px] text-[#1C1917] dark:text-[#F5F5F4] text-right leading-[2.1] select-text py-0.5"
            >
              {arabicText}
            </div>
          )}

          {/* Subtle separator between Arabic and English if both are present */}
          {arabicText && englishText && (
            <div className="border-t border-stone-200/50 dark:border-stone-800/50 my-1" />
          )}

          {/* English Translation / Scholarly Quotation */}
          {englishText && (
            <div className="font-reader italic text-[15px] sm:text-[16px] leading-[1.8] text-stone-800 dark:text-stone-200 select-text whitespace-pre-line">
              {englishText}
            </div>
          )}
        </div>
      )}

      {/* Subtle Citation Footer */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 font-reader">
        <span>
          {type === 'quran'
            ? quranCitation?.fullCitation ||
              (surahNumber
                ? typeof verseNumber === 'number'
                  ? formatQuranCitationFooter({ surahNumber, surahName, verseStart: verseNumber })
                  : typeof verseNumber === 'string'
                  ? formatQuranCitationFooter({ surahNumber, surahName, verseRangeStr: verseNumber })
                  : formatQuranCitationFooter({ surahNumber, surahName })
                : detectedCitation || theme.defaultSource)
            : type === 'hadith'
            ? hadithCitation?.fullCitation || detectedCitation || theme.defaultSource
            : type === 'scholar'
            ? scholarCitation?.fullCitation || detectedCitation || theme.defaultSource
            : detectedCitation || theme.defaultSource}
        </span>
      </div>
    </div>
  );
};
