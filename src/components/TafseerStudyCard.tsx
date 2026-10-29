import React from 'react';
import { Sparkles, Scale, Lightbulb, History, LucideIcon } from 'lucide-react';

export type StudyCardType = 'takeaways' | 'ahkam' | 'insights' | 'asbab';

interface TafseerStudyCardProps {
  type: StudyCardType;
  title?: string;
  badgeLabel?: string;
  summary?: string;
  content?: string;
  points?: string[];
  footerSource?: string;
  onActionClick?: () => void;
  actionText?: string;
}

interface ThemeConfig {
  icon: LucideIcon;
  defaultBadge: string;
  defaultFooter: string;
  containerClasses: string;
  borderClasses: string;
  dividerClasses: string;
  badgeClasses: string;
  badgeBgClasses: string;
  dotClasses: string;
  ringClasses: string;
}

const CARD_THEMES: Record<StudyCardType, ThemeConfig> = {
  takeaways: {
    icon: Sparkles,
    defaultBadge: 'Summary',
    defaultFooter: '',
    containerClasses: 'bg-[#CD7743]/[0.06] dark:bg-[#CD7743]/[0.09]',
    borderClasses: 'border-[#CD7743]/35 dark:border-[#E08955]/35 hover:border-[#CD7743]/55 dark:hover:border-[#E08955]/55',
    dividerClasses: 'border-[#CD7743]/15 dark:border-[#CD7743]/20',
    badgeClasses: 'text-[#CD7743] dark:text-[#E08955]',
    badgeBgClasses: 'bg-[#CD7743]/12 dark:bg-[#CD7743]/22',
    dotClasses: 'bg-[#CD7743] dark:bg-[#E08955]',
    ringClasses: 'ring-[#CD7743]/20',
  },
  ahkam: {
    icon: Scale,
    defaultBadge: 'Injunctions & Rulings (Ahkam)',
    defaultFooter: "Jurisprudential Rulings · Ma'ariful Qur'an",
    containerClasses: 'bg-[#5F4B3E]/[0.06] dark:bg-[#5F4B3E]/[0.09]',
    borderClasses: 'border-[#5F4B3E]/35 dark:border-[#8C7262]/35 hover:border-[#5F4B3E]/55 dark:hover:border-[#8C7262]/55',
    dividerClasses: 'border-[#5F4B3E]/15 dark:border-[#5F4B3E]/20',
    badgeClasses: 'text-[#5F4B3E] dark:text-[#8C7262]',
    badgeBgClasses: 'bg-[#5F4B3E]/12 dark:bg-[#5F4B3E]/22',
    dotClasses: 'bg-[#5F4B3E] dark:bg-[#8C7262]',
    ringClasses: 'ring-[#5F4B3E]/20',
  },
  insights: {
    icon: Lightbulb,
    defaultBadge: 'Exegetical & Spiritual Insights',
    defaultFooter: "Contemplative Insights · Ma'ariful Qur'an",
    containerClasses: 'bg-[#596B8E]/[0.06] dark:bg-[#596B8E]/[0.09]',
    borderClasses: 'border-[#596B8E]/35 dark:border-[#7587AC]/35 hover:border-[#596B8E]/55 dark:hover:border-[#7587AC]/55',
    dividerClasses: 'border-[#596B8E]/15 dark:border-[#596B8E]/20',
    badgeClasses: 'text-[#596B8E] dark:text-[#7587AC]',
    badgeBgClasses: 'bg-[#596B8E]/12 dark:bg-[#596B8E]/22',
    dotClasses: 'bg-[#596B8E] dark:text-[#7587AC]',
    ringClasses: 'ring-[#596B8E]/20',
  },
  asbab: {
    icon: History,
    defaultBadge: 'Occasion of Revelation (Asbab al-Nuzul)',
    defaultFooter: "Historical Circumstances · Ma'ariful Qur'an",
    containerClasses: 'bg-[#4C7971]/[0.06] dark:bg-[#4C7971]/[0.09]',
    borderClasses: 'border-[#4C7971]/35 dark:border-[#639C92]/35 hover:border-[#4C7971]/55 dark:hover:border-[#639C92]/55',
    dividerClasses: 'border-[#4C7971]/15 dark:border-[#4C7971]/20',
    badgeClasses: 'text-[#4C7971] dark:text-[#639C92]',
    badgeBgClasses: 'bg-[#4C7971]/12 dark:bg-[#4C7971]/22',
    dotClasses: 'bg-[#4C7971] dark:bg-[#639C92]',
    ringClasses: 'ring-[#4C7971]/20',
  },
};

export const TafseerStudyCard: React.FC<TafseerStudyCardProps> = ({
  type,
  title,
  badgeLabel,
  summary,
  content,
  points,
  footerSource,
  onActionClick,
  actionText,
}) => {
  const theme = CARD_THEMES[type] || CARD_THEMES.takeaways;
  const IconComponent = theme.icon;

  return (
    <div
      className={`relative p-4 sm:p-5 rounded-2xl border ${theme.borderClasses} ${theme.containerClasses} shadow-2xs space-y-3.5 transition-all select-text`}
    >
      {/* Header bar with icon, category badge, and exegesis source context */}
      <div className={`flex items-center justify-between gap-2 border-b ${theme.dividerClasses} pb-3`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${theme.badgeBgClasses} shrink-0`}>
            <IconComponent className={`w-4 h-4 ${theme.badgeClasses}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${theme.badgeClasses}`}>
            {badgeLabel || theme.defaultBadge}
          </span>
        </div>
        {(footerSource || theme.defaultFooter) && (
          <span className="text-[11px] font-reader text-stone-400 dark:text-stone-500 hidden sm:inline">
            {footerSource || theme.defaultFooter}
          </span>
        )}
      </div>

      {/* Thematic Synthesis / Executive Summary Block (if present) */}
      {summary && (
        <div className={`p-3 sm:p-3.5 rounded-xl bg-white/70 dark:bg-black/20 border ${theme.dividerClasses} text-[15px] sm:text-[15.5px] font-reader text-[#292524] dark:text-[#D6D3D1] leading-relaxed`}>
          {summary.replace(/^["“”']+|["“”']+$/g, '')}
        </div>
      )}

      {/* Title if present (e.g., Ahkam rulings title, Insight title) */}
      {title && (
        <h4 className="font-serif-heading font-semibold text-lg sm:text-[19px] text-stone-900 dark:text-stone-100 tracking-tight">
          {title}
        </h4>
      )}

      {/* Bullet points for takeaways */}
      {points && points.length > 0 && (
        <ul className="space-y-2.5 text-[15px] sm:text-[15.5px] text-stone-700 dark:text-stone-300 leading-relaxed font-reader">
          {points.map((pt, idx) => (
            <li key={`card-pt-${idx}`} className="flex items-start gap-2.5">
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dotClasses} shrink-0 mt-2 ring-2 ${theme.ringClasses}`} />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Narrative body for Ahkam, Insights, Asbab */}
      {content && (
        <div className="text-[15px] sm:text-[16px] leading-[1.8] text-stone-800 dark:text-stone-200 font-reader whitespace-pre-line">
          {content}
        </div>
      )}

      {/* Mobile/Action footer if action is present or small screen footer */}
      {onActionClick && actionText && (
        <div className={`pt-2.5 border-t ${theme.dividerClasses} flex items-center justify-between text-xs font-reader`}>
          <span className="sm:hidden text-stone-400 dark:text-stone-500">
            {footerSource || theme.defaultFooter}
          </span>
          <button
            type="button"
            onClick={onActionClick}
            className={`${theme.badgeClasses} hover:underline font-medium cursor-pointer transition-colors ml-auto`}
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
