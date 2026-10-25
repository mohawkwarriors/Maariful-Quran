import React from 'react';
import { SurahData } from '../types/quran';
import { SurahHistoricalContext } from './SurahHistoricalContext';

interface SurahHeroProps {
  surah: SurahData;
}

export const SurahHero: React.FC<SurahHeroProps> = ({ surah }) => {
  // Fallback background narrative if not yet explicitly stored in JSON
  const historicalContext = surah.historicalContext || {
    background: `Surah ${surah.nameTransliterated} (${surah.nameEnglish}) was revealed during the ${surah.revelationType} phase of the prophetic mission, comprising ${surah.versesCount} verses across Juz ${surah.juz.join(', ')}. Classical exegesis in Ma'ariful Qur'an records that this chapter addresses foundational guidance pertinent to the ${surah.revelationType} community, clarifying theology, moral perseverance, and divine injunctions.`,
  };

  return (
    <div className="pt-8 pb-10 px-4 sm:px-8 border-b border-[#E8E5DF] dark:border-[#2E2E33] bg-[#FDFCFB] dark:bg-[#1C1C20] text-center space-y-7">
      {/* Surah Number & Categorization */}
      <div className="flex items-center justify-center flex-wrap gap-2 text-xs uppercase font-medium tracking-widest text-[#596B8E] dark:text-[#788BB3]">
        <span>Surah {surah.number}</span>
        <span aria-hidden="true">·</span>
        <span>{surah.revelationType}</span>
        <span aria-hidden="true">·</span>
        <span>{surah.versesCount} Verses</span>
        <span aria-hidden="true">·</span>
        <span>Juz {surah.juz.join(', ')}</span>
      </div>

      {/* Surah Titles: Distinct blocks with adequate line-height and vertical margin to prevent glyph collision */}
      <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
        <h1
          dir="rtl"
          className="font-quran text-4xl sm:text-5xl md:text-6xl text-[#111827] dark:text-[#F9FAFB] leading-[2.0] sm:leading-[2.2] pb-2 sm:pb-3 tracking-normal block select-text overflow-visible"
        >
          سورة {surah.nameArabic}
        </h1>
        <div className="text-xl sm:text-2xl font-serif-heading font-medium text-[#CD7743] dark:text-[#E08955] tracking-wide">
          Surah {surah.nameTransliterated}
        </div>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-xl mx-auto italic">
          "{surah.nameEnglish}"
        </p>
      </div>

      {/* Bismillah Calligraphy: Spacious cartouche with generous padding and line-height so descenders & diacritics are never cutoff */}
      {surah.bismillahPre && (
        <div className="py-3 flex justify-center">
          <div
            dir="rtl"
            className="font-quran text-2xl sm:text-3xl md:text-4xl leading-[2.2] sm:leading-[2.4] text-[#CD7743] dark:text-[#E08955] inline-block px-8 sm:px-14 py-4 sm:py-5 rounded-2xl bg-[#CD7743]/8 dark:bg-[#CD7743]/15 border border-[#CD7743]/30 dark:border-[#CD7743]/40 shadow-xs overflow-visible select-text"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>
      )}

      {/* Background Section (combining Overview and Historical Circumstances) */}
      <SurahHistoricalContext
        overview={surah.introductoryTafseer}
        context={historicalContext}
        surahNumber={surah.number}
        surahName={surah.nameTransliterated}
      />
    </div>
  );
};
