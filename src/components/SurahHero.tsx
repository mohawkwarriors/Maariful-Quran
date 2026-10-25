import React from 'react';
import { SurahData } from '../types/quran';
import { SurahHistoricalContext } from './SurahHistoricalContext';
import { Download } from 'lucide-react';
import { exportSurahForAnnotation } from '../utils/exportSurahPdf';

interface SurahHeroProps {
  surah: SurahData;
}

export const SurahHero: React.FC<SurahHeroProps> = ({ surah }) => {
  const historicalContext = surah.historicalContext || {
    background: `Surah ${surah.nameTransliterated} (${surah.nameEnglish}) was revealed during the ${surah.revelationType} phase of the prophetic mission, comprising ${surah.versesCount} verses across Juz ${surah.juz.join(', ')}. Classical exegesis in Ma'ariful Qur'an records that this chapter addresses foundational guidance pertinent to the ${surah.revelationType} community, clarifying theology, moral perseverance, and divine injunctions.`,
  };

  return (
    <div className="pt-6 pb-8 px-4 sm:px-8 border-b border-[#E8E5DF] dark:border-[#2E2E33] bg-[#FDFCFB] dark:bg-[#1C1C20] text-center flex flex-col items-center">
      {/* 1. Very Top Row: 3-column flex layout ensuring zero text overlap at any screen width */}
      <div className="w-full max-w-4xl xl:max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 min-h-[34px]">
        {/* Left balance spacer on desktop to keep metadata centered */}
        <div className="hidden md:block w-32 shrink-0 pointer-events-none" aria-hidden="true" />

        {/* Centered Metadata */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs uppercase font-medium tracking-widest text-[#596B8E] dark:text-[#788BB3] text-center">
          <span>{surah.revelationType}</span>
          <span aria-hidden="true">·</span>
          <span>{surah.versesCount} Verses</span>
          <span aria-hidden="true">·</span>
          <span>Juz {surah.juz.join(', ')}</span>
          {surah.volumeNumber && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#CD7743] dark:text-[#E08955] font-semibold">
                Ma'ariful Qur'an Vol. {surah.volumeNumber} of 8
              </span>
            </>
          )}
        </div>

        {/* Download PDF button: Dedicated non-overlapping container at top right */}
        <div className="w-auto md:w-32 flex justify-center md:justify-end shrink-0">
          <button
            type="button"
            onClick={() => exportSurahForAnnotation(surah)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#25252B] hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/20 text-stone-700 dark:text-stone-300 hover:text-[#CD7743] dark:hover:text-[#E08955] border border-stone-200 dark:border-stone-700/80 shadow-2xs hover:border-[#CD7743]/40 transition-all cursor-pointer whitespace-nowrap"
            title="Download this Surah formatted with wide margins and notes space as a PDF for annotation"
          >
            <Download className="w-3.5 h-3.5 text-[#CD7743] dark:text-[#E08955] shrink-0" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Surah Titles: Even 24px margin from metadata row */}
      <div className="mt-6 flex flex-col items-center justify-center">
        <h1
          dir="rtl"
          className="font-quran text-4xl sm:text-5xl md:text-6xl text-[#111827] dark:text-[#F9FAFB] leading-[1.3] sm:leading-[1.35] tracking-normal block select-text overflow-visible"
        >
          سورة {surah.nameArabic}
        </h1>

        {/* Centered Transliteration and English Meaning closely grouped with title */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center text-center mt-3">
          <span className="text-xl sm:text-2xl font-serif-heading font-medium text-[#CD7743] dark:text-[#E08955] tracking-wide">
            {surah.nameTransliterated}
          </span>
          <span className="text-stone-300 dark:text-stone-600" aria-hidden="true">·</span>
          <span className="text-sm sm:text-base text-stone-600 dark:text-stone-400 italic">
            "{surah.nameEnglish}"
          </span>
        </div>
      </div>

      {/* 3. Bismillah Calligraphy: Even 24px margin from titles */}
      {surah.bismillahPre && (
        <div className="mt-6 flex justify-center">
          <div
            dir="rtl"
            className="font-quran text-2xl sm:text-3xl md:text-4xl leading-[1.8] sm:leading-[1.9] text-[#CD7743] dark:text-[#E08955] inline-block px-8 sm:px-12 py-3 rounded-2xl bg-[#CD7743]/8 dark:bg-[#CD7743]/15 border border-[#CD7743]/30 dark:border-[#CD7743]/40 shadow-2xs overflow-visible select-text"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>
      )}

      {/* 4. Background Section: Even 24px margin from Bismillah */}
      <div className="w-full mt-6">
        <SurahHistoricalContext
          overview={surah.introductoryTafseer}
          context={historicalContext}
          surahNumber={surah.number}
          surahName={surah.nameTransliterated}
        />
      </div>
    </div>
  );
};
