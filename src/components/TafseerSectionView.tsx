import React, { useState, useRef, useEffect } from 'react';
import { ThematicSection, PhraseCard, SubSection } from '../types/quran';
import { AnnotatedTranslation } from './AnnotatedTranslation';
import { WordDeepDiveModal } from './WordDeepDiveModal';
import { getWordDeepDive } from '../services/quranLexicon';
import { TafseerStudyCard, StudyCardType } from './TafseerStudyCard';
import { ChevronDown, ChevronUp, Bookmark, BookOpen, Sparkles } from 'lucide-react';

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

const TafseerCommentaryBlock: React.FC<{
  commentary: string;
  summaryPoints: string[];
  subsections?: SubSection[];
  tafseerTab: 'summary' | 'full';
  onTabChange: (tab: 'summary' | 'full') => void;
}> = ({ commentary, summaryPoints, subsections, tafseerTab, onTabChange }) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#CD7743] dark:text-[#E08955]">
          Tafseer
        </span>

        {/* Layered Switcher: Summary vs Full Commentary */}
        <div className="flex items-center p-0.5 rounded-lg bg-stone-100 dark:bg-[#25252A] text-xs font-medium border border-stone-200/60 dark:border-stone-700/60">
          <button
            type="button"
            onClick={() => onTabChange('summary')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              tafseerTab === 'summary'
                ? 'bg-white dark:bg-[#1E1E23] text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CD7743]" />
            <span>Summary & Key Takeaways</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('full')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              tafseerTab === 'full'
                ? 'bg-white dark:bg-[#1E1E23] text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full Commentary</span>
          </button>
        </div>
      </div>

      {tafseerTab === 'summary' ? (
        <div className="space-y-4">
          {/* Key Theological & Moral Takeaways Card */}
          <TafseerStudyCard
            type="takeaways"
            points={summaryPoints}
            onActionClick={() => onTabChange('full')}
            actionText="Read Full Commentary →"
          />

          {/* Subsections: Ahkam, Insights, Asbab al-Nuzul sharing the exact same card design with distinct colors */}
          {subsections && subsections.length > 0 && (
            <div className="space-y-4 pt-1">
              {subsections.map((sub, sIdx) => (
                <TafseerStudyCard
                  key={`sub-sum-${sIdx}`}
                  type={sub.type as StudyCardType}
                  title={sub.title}
                  content={sub.content}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="prose dark:prose-invert max-w-none text-[16px] sm:text-[17px] leading-[1.85] text-[#292524] dark:text-[#D6D3D1] space-y-4 font-reader whitespace-pre-line">
            {commentary}
          </div>

          {/* Companion study cards below full commentary with same unified design and distinct colors */}
          {subsections && subsections.length > 0 && (
            <div className="space-y-4 pt-3 border-t border-stone-200/70 dark:border-stone-800/80">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Key Injunctions & Insights
              </div>
              {subsections.map((sub, sIdx) => (
                <TafseerStudyCard
                  key={`sub-full-${sIdx}`}
                  type={sub.type as StudyCardType}
                  title={sub.title}
                  content={sub.content}
                />
              ))}
            </div>
          )}
        </div>
      )}
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
  const [tafseerTab, setTafseerTab] = useState<'summary' | 'full'>('full');

  // Distill key takeaways and wisdom points for quick summary mode
  const summaryPoints = React.useMemo(() => {
    if (!section.commentary) return [];
    const paragraphs = section.commentary
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 25);

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
          <div className="p-4 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#202024]/80 border border-[#EBE7DF] dark:border-[#2B2B30] shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
              Translation
            </div>
            <AnnotatedTranslation
              text={section.translation}
              curatedTerms={section.curatedTerms}
            />
          </div>

          {/* Tafseer Commentary Block with Layered Tabs and Unified Study Cards */}
          <TafseerCommentaryBlock
            commentary={section.commentary}
            summaryPoints={summaryPoints}
            subsections={section.subsections}
            tafseerTab={tafseerTab}
            onTabChange={setTafseerTab}
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
                className="p-2 sm:p-3 rounded-xl bg-white dark:bg-[#1E1E23] border border-[#EBE6DC] dark:border-[#2C2C32] shadow-2xs space-y-1.5 transition-all"
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

          {/* Tafseer Commentary Block with Layered Tabs and Unified Study Cards */}
          <div className="pt-4 border-t border-[#E8E5DF] dark:border-[#2E2E33]">
            <TafseerCommentaryBlock
              commentary={section.commentary}
              summaryPoints={summaryPoints}
              subsections={section.subsections}
              tafseerTab={tafseerTab}
              onTabChange={setTafseerTab}
            />
          </div>
        </div>
      )}
        </>
      )}
    </section>
  );
};
