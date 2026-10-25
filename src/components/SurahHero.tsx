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
    <div className="pt-8 pb-10 px-4 sm:px-8 border-b border-[#E8E5DF] dark:border-[#2E2E33] bg-[#FDFCFB] dark:bg-[#1C1C20] text-center space-y-7">
      {/* Surah Categorization Metadata */}
      <div className="flex items-center justify-center flex-wrap gap-2 text-xs uppercase font-medium tracking-widest text-[#596B8E] dark:text-[#788BB3]">
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

        {/* Download Surah as PDF for Annotation */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => exportSurahForAnnotation(surah)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-[#25252B] hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/20 text-stone-700 dark:text-stone-300 hover:text-[#CD7743] dark:hover:text-[#E08955] border border-stone-200 dark:border-stone-700/80 shadow-xs hover:border-[#CD7743]/40 transition-all cursor-pointer"
            title="Download this Surah formatted with wide margins and notes space as a PDF for annotation"
          >
            <Download className="w-3.5 h-3.5 text-[#CD7743] dark:text-[#E08955]" />
            <span>Download PDF for Annotation</span>
          </button>
        </div>
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
