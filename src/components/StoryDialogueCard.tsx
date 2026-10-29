import React from 'react';
import { BookOpen, User, Crown, MessageSquareQuote } from 'lucide-react';
import { formatQuranCitationFooter } from '../utils/quranCitation';

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
  title = 'Historic Exchange & Exegetical Dialogue',
  contextIntro,
  sourceAuthority = 'Musnad al-Darimi · Related by Imam al-Qurtubi',
  turns,
}) => {
  return (
    <div className="not-prose my-6 rounded-2xl bg-[#FCFAF7] dark:bg-[#1E1E23] border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-6 shadow-2xs space-y-4 select-text">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#596B8E]/10 dark:bg-[#596B8E]/20 text-[#596B8E] dark:text-[#788BB3] shrink-0">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#596B8E] dark:text-[#788BB3]">
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Context Introduction (if provided) */}
      {contextIntro && (
        <div className="p-3.5 rounded-xl bg-stone-100/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-[14.5px] sm:text-[15px] font-reader text-stone-700 dark:text-stone-300 leading-relaxed italic">
          {contextIntro}
        </div>
      )}

      {/* Alternating Dialogue Turns */}
      <div className="space-y-3 pt-1">
        {turns.map((turn, idx) => {
          const isCaliph = /caliph/i.test(turn.speaker);
          const isAbuHazim = /abu hazim/i.test(turn.speaker);

          return (
            <div
              key={`dialogue-turn-${idx}`}
              className={`flex flex-col rounded-xl p-3 sm:p-4 border transition-all ${
                isCaliph
                  ? 'bg-stone-100/60 dark:bg-[#25252B]/60 border-stone-200/70 dark:border-stone-700/60'
                  : isAbuHazim
                  ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border-amber-600/20 dark:border-amber-500/25'
                  : 'bg-white/60 dark:bg-black/20 border-stone-200/50 dark:border-stone-800'
              }`}
            >
              {/* Speaker Label */}
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`p-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 ${
                    isCaliph
                      ? 'bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                      : isAbuHazim
                      ? 'bg-[#CD7743]/15 dark:bg-[#CD7743]/25 text-[#CD7743] dark:text-[#E08955]'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {isCaliph ? (
                    <Crown className="w-3 h-3 shrink-0" />
                  ) : (
                    <User className="w-3 h-3 shrink-0" />
                  )}
                  <span>{turn.speaker}</span>
                </div>
              </div>

              {/* Conversational Speech */}
              {turn.speech && (
                <p className="font-reader text-[15px] sm:text-[15.5px] leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-line">
                  {turn.speech}
                </p>
              )}

              {/* Recited Scripture Block (embedded inside Abu Hazim's turn) */}
              {turn.ayah && (
                <div className="mt-2.5 rounded-xl bg-white dark:bg-[#18181C] border border-[#4C7971]/30 dark:border-[#639C92]/35 p-3 sm:p-4 space-y-2 shadow-2xs">
                  {turn.leadIn && (
                    <div className="text-xs font-medium text-stone-500 dark:text-stone-400 italic font-reader">
                      {turn.leadIn}
                    </div>
                  )}

                  {/* Sacred Arabic Recitation */}
                  {turn.ayah.arabic && (
                    <div
                      dir="rtl"
                      lang="ar"
                      className="font-quran-uthmani text-right text-lg sm:text-[21px] text-[#1E3A34] dark:text-[#A7D7CE] leading-[2.2] tracking-wide select-text py-0.5"
                    >
                      {turn.ayah.arabic}
                    </div>
                  )}

                  {/* Translation */}
                  {turn.ayah.english && (
                    <div className="font-reader italic text-[14.5px] sm:text-[15.5px] leading-relaxed text-stone-800 dark:text-stone-200 select-text">
                      "{turn.ayah.english}"
                    </div>
                  )}

                  {/* Citation Footer Pill */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-[#4C7971] dark:text-[#639C92] font-reader font-medium">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{turn.ayah.reference}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Card Footer Source */}
      {sourceAuthority && (
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs text-stone-400 dark:text-stone-500 font-reader">
          {sourceAuthority}
        </div>
      )}
    </div>
  );
};
