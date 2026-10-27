import React from 'react';
import { BookOpen, Quote, Sparkles, Scale } from 'lucide-react';

export type QuoteType = 'hadith' | 'scholar' | 'quran' | 'dua';

export interface TafseerQuoteCardProps {
  type: QuoteType;
  rawText: string;
  source?: string;
}

const formatCitationLabel = (text: string): string | null => {
  const match = text.match(/\(([^)]+)\)\s*$/);
  if (!match) return null;
  const raw = match[1].trim();

  // Check surah:verse like (38:27) or (2:220)
  const verseMatch = raw.match(/^(\d+)\s*:\s*(\d+)$/);
  if (verseMatch) {
    return `Surah ${verseMatch[1]}:${verseMatch[2]}`;
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
  source,
}) => {
  const detectedCitation = formatCitationLabel(rawText) || source;

  // Determine if this is a Hadith Qudsi (where Allah speaks in the first person)
  const isHadithQudsi =
    type === 'hadith' &&
    (/Allah\s+(?:has\s+)?said|Allah\s+says/i.test(rawText) ||
      rawText.toLowerCase().includes('mazhari'));

  // Determine badge styling based on quote type
  const theme = React.useMemo(() => {
    switch (type) {
      case 'hadith':
        return {
          icon: isHadithQudsi ? Sparkles : BookOpen,
          badgeTitle: isHadithQudsi ? 'Hadith Qudsi · Sacred Tradition' : 'Prophetic Tradition · Hadith',
          badgeClasses: 'text-[#CD7743] dark:text-[#E08955]',
          badgeBgClasses: 'bg-[#CD7743]/10 dark:bg-[#CD7743]/20',
          borderAccent: 'border-l-[#CD7743] dark:border-l-[#E08955]',
          defaultSource: 'Recorded in Prophetic Traditions',
        };
      case 'scholar':
        return {
          icon: Quote,
          badgeTitle: 'Classical Authority · Scholarly Quote',
          badgeClasses: 'text-[#596B8E] dark:text-[#788BB3]',
          badgeBgClasses: 'bg-[#596B8E]/10 dark:bg-[#596B8E]/20',
          borderAccent: 'border-l-[#596B8E] dark:border-l-[#788BB3]',
          defaultSource: "Ma'ariful Qur'an Classical Exegesis",
        };
      case 'quran':
        return {
          icon: BookOpen,
          badgeTitle: "Qur'anic Scripture Citation",
          badgeClasses: 'text-[#4C7971] dark:text-[#639C92]',
          badgeBgClasses: 'bg-[#4C7971]/10 dark:bg-[#4C7971]/20',
          borderAccent: 'border-l-[#4C7971] dark:border-l-[#639C92]',
          defaultSource: 'The Holy Qur’an',
        };
      case 'dua':
        return {
          icon: Sparkles,
          badgeTitle: "Supplication & Prayer · Du'a",
          badgeClasses: 'text-[#2D7266] dark:text-[#4AA291]',
          badgeBgClasses: 'bg-[#2D7266]/10 dark:bg-[#2D7266]/20',
          borderAccent: 'border-l-[#2D7266] dark:border-l-[#4AA291]',
          defaultSource: "Qur'anic Supplication & Prophetic Du'a",
        };
    }
  }, [type, isHadithQudsi]);

  const IconComponent = theme.icon;

  // Split lines to detect structured hadith dialogue turns (Arabic + English + Divine response)
  const lines = React.useMemo(() => {
    return rawText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
  }, [rawText]);

  const hasArabicLines = React.useMemo(() => {
    return lines.some((l) => /[\u0600-\u06FF]{4,}/.test(l));
  }, [lines]);

  // Dua parsing for supplications and prayers
  const parsedDua = React.useMemo(() => {
    if (type !== 'dua') return null;

    let title: string | null = null;
    let leadIn: string | null = null;
    const arabicLines: string[] = [];
    const prayerQuotes: string[] = [];
    const generalLines: string[] = [];

    let currentLines = [...lines];

    // Detect if first line is a title like "The Prayer for Guidance" or "Du'a for ..."
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
      const isArabic = /[\u0600-\u06FF]{4,}/.test(l);
      const isQuote = /^[“"][^”"]+[”"]$/.test(l) || /^[“"]/.test(l);
      const isLeadIn =
        /(?:taught|teaches|instructs|pray|supplicat|last\s+three\s+verses|prayer\s+on\s+the\s+part\s+of\s+man)[^:]*:\s*$/i.test(
          l
        );

      if (isArabic) {
        arabicLines.push(l);
      } else if (isQuote) {
        prayerQuotes.push(l);
      } else if (isLeadIn && !leadIn) {
        leadIn = l;
      } else {
        generalLines.push(l);
      }
    }

    // If no explicit leadIn was flagged but generalLines exist before quotes
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
  }, [type, lines]);

  return (
    <div
      className={`not-prose my-5 rounded-2xl bg-[#FCFAF7] dark:bg-[#1E1E23] border border-[#ECE5DA] dark:border-[#2C2C32] border-l-[3.5px] ${theme.borderAccent} p-4 sm:p-5 shadow-2xs space-y-3 transition-all select-text`}
    >
      {/* Header bar with category badge and citation source */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${theme.badgeBgClasses} shrink-0`}>
            <IconComponent className={`w-3.5 h-3.5 ${theme.badgeClasses}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${theme.badgeClasses}`}>
            {theme.badgeTitle}
          </span>
        </div>

        {detectedCitation && (
          <span className="text-xs font-reader font-medium text-stone-500 dark:text-stone-400">
            {detectedCitation}
          </span>
        )}
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
      ) : hasArabicLines ? (
        <div className="space-y-2 pt-0.5">
          {lines.map((line, idx) => {
            const isArabic = /[\u0600-\u06FF]{4,}/.test(line);
            const isDialogueSpeaker =
              /^(?:Allah\s+says|The\s+Holy\s+Prophet\s*(?:\([^)]+\))?\s*continued|When\s+(?:the\s+servant|he)\s+says):/i.test(
                line
              );

            if (isArabic) {
              return (
                <div
                  key={`quote-line-${idx}`}
                  dir="rtl"
                  className="font-quran text-xl sm:text-2xl text-[#CD7743] dark:text-[#E08955] text-right leading-loose select-text py-0.5"
                >
                  {line}
                </div>
              );
            }

            if (isDialogueSpeaker) {
              return (
                <div
                  key={`quote-line-${idx}`}
                  className="font-reader text-[14.5px] sm:text-[15.5px] leading-relaxed text-stone-800 dark:text-stone-200 pl-3 border-l-2 border-[#CD7743]/40 dark:border-[#E08955]/40 my-1 py-0.5"
                >
                  {line}
                </div>
              );
            }

            // Translation or description line
            return (
              <div
                key={`quote-line-${idx}`}
                className="font-reader italic text-[14px] sm:text-[15px] leading-relaxed text-stone-600 dark:text-stone-400 pl-1"
              >
                {line}
              </div>
            );
          })}
        </div>
      ) : (
        /* Regular Single or Multi-sentence Quote */
        <div className="font-reader text-[15px] sm:text-[16px] leading-[1.8] text-stone-800 dark:text-stone-200 italic whitespace-pre-line pl-1 select-text">
          {rawText}
        </div>
      )}

      {/* Subtle Citation Footer */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 font-reader">
        <span>{detectedCitation || theme.defaultSource}</span>
      </div>
    </div>
  );
};
