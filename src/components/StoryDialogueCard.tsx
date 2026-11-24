import React, { useState } from 'react';
import { BookOpen, MessageSquareQuote, ChevronDown, ChevronRight } from 'lucide-react';

export interface DialogueAyah {
  arabic: string;
  english: string;
  reference: string;
  surahNumber?: number;
  surahName?: string;
  verseRangeStr?: string;
}

export interface DialogueTurn {
  speaker: string;
  speech: string;
  leadIn?: string;
  ayah?: DialogueAyah;
}

export interface StoryDialogueCardProps {
  title?: string;
  contextIntro?: string;
  sourceAuthority?: string;
  turns: DialogueTurn[];
}

export const StoryDialogueCard: React.FC<StoryDialogueCardProps> = ({
  title,
  contextIntro,
  sourceAuthority = 'Musnad al-Darimi · Related by Imam al-Qurtubi',
  turns,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const label = title || 'Historical Dialogue';

  return (
    <div className="not-prose my-7 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-[#FCFAF7]/60 dark:bg-[#1E1E23]/60 overflow-hidden font-reader select-text transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${label}`}
        className="w-full px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 text-left hover:bg-stone-100/60 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#CD7743]"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-[#CD7743]/10 dark:bg-[#CD7743]/20 shrink-0">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#CD7743] dark:text-[#E08955]" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#CD7743] dark:text-[#E08955] truncate">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isExpanded && sourceAuthority && (
            <span className="hidden sm:inline text-xs text-stone-400 dark:text-stone-500 italic truncate max-w-[260px]">
              {sourceAuthority}
            </span>
          )}
          <span className="p-0.5 rounded-md text-stone-400 dark:text-stone-500">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3.5 border-t border-stone-200/60 dark:border-stone-800/60 space-y-4">
          {/* Historical Context Introduction */}
          {contextIntro && (
            <p className="text-[15px] sm:text-[16px] leading-[1.8] text-stone-700 dark:text-stone-300 italic mb-4">
              {contextIntro}
            </p>
          )}

          {/* Classical Script Typography (Dialogue flow with zero box clutter) */}
          <div className="space-y-4 pl-1 sm:pl-2">
            {turns.map((turn, idx) => {
              const isCaliph = /caliph/i.test(turn.speaker);
              const isAbuHazim = /abu hazim/i.test(turn.speaker);

              return (
                <div key={`dialogue-turn-${idx}`} className="space-y-2">
                  {/* Spoken Turn with Bold Inline Speaker */}
                  {turn.speech && (
                    <p className="text-[15px] sm:text-[16px] leading-[1.8] text-stone-900 dark:text-stone-100">
                      <span
                        className={`font-semibold tracking-wide mr-2 ${
                          isCaliph
                            ? 'text-stone-900 dark:text-stone-100'
                            : isAbuHazim
                            ? 'text-[#B85D26] dark:text-[#E08955]'
                            : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {turn.speaker}:
                      </span>
                      <span>{turn.speech}</span>
                    </p>
                  )}

                  {/* Recited Scripture Block: Clean, subtle indentation with zero box borders */}
                  {turn.ayah && (
                    <div className="my-3 pl-4 sm:pl-5 border-l-2 border-[#4C7971]/60 dark:border-[#639C92]/60 py-1 space-y-2">
                      {turn.leadIn && !turn.speech && (
                        <p className="text-[14px] text-stone-600 dark:text-stone-400 italic">
                          {turn.leadIn}
                        </p>
                      )}

                      {/* Sacred Arabic Recitation */}
                      {turn.ayah.arabic && (
                        <div
                          dir="rtl"
                          lang="ar"
                          className="font-quran text-right text-lg sm:text-[21px] text-[#1E3A34] dark:text-[#A7D7CE] leading-[2.2] select-text pt-0.5 pb-2 overflow-visible"
                        >
                          {turn.ayah.arabic}
                        </div>
                      )}

                      {/* Translation */}
                      {turn.ayah.english && (
                        <p className="italic text-[14.5px] sm:text-[15.5px] leading-relaxed text-stone-800 dark:text-stone-200">
                          "{turn.ayah.english}"
                        </p>
                      )}

                      {/* Scripture Citation */}
                      <div className="pt-1 flex items-center gap-1.5 text-xs text-[#4C7971] dark:text-[#639C92] font-medium">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{turn.ayah.reference}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Subtle Bottom Authority Citation */}
          {sourceAuthority && (
            <div className="pt-3 border-t border-stone-200/50 dark:border-stone-800/50 text-xs text-stone-400 dark:text-stone-500 italic">
              {sourceAuthority}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
