import React from 'react';
import { Sparkles, Scale, Lightbulb, History, LucideIcon } from 'lucide-react';

export type StudyCardType = 'takeaways' | 'ahkam' | 'insights' | 'asbab';

interface TafseerStudyCardProps {
  type: StudyCardType;
  title?: string;
  badgeLabel?: string;
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
  stripeClasses: string;
  badgeClasses: string;
  badgeBgClasses: string;
  dotClasses: string;
}

const CARD_THEMES: Record<StudyCardType, ThemeConfig> = {
  takeaways: {
    icon: Sparkles,
    defaultBadge: 'Key Theological & Moral Takeaways',
    defaultFooter: "Distilled from Ma'ariful Qur'an",
    containerClasses: 'bg-[#CD7743]/5 dark:bg-[#CD7743]/10',
    borderClasses: 'border-[#CD7743]/30 dark:border-[#CD7743]/40',
    stripeClasses: 'bg-[#CD7743] dark:bg-[#E08955]',
    badgeClasses: 'text-[#CD7743] dark:text-[#E08955]',
    badgeBgClasses: 'bg-[#CD7743]/15 dark:bg-[#CD7743]/20',
    dotClasses: 'bg-[#CD7743] dark:bg-[#E08955]',
  },
  ahkam: {
    icon: Scale,
    defaultBadge: 'Injunctions & Rulings (Ahkam)',
    defaultFooter: "Jurisprudential Rulings · Ma'ariful Qur'an",
    containerClasses: 'bg-[#5F4B3E]/5 dark:bg-[#5F4B3E]/12',
    borderClasses: 'border-[#5F4B3E]/30 dark:border-[#8C7262]/40',
    stripeClasses: 'bg-[#5F4B3E] dark:bg-[#8C7262]',
    badgeClasses: 'text-[#5F4B3E] dark:text-[#8C7262]',
    badgeBgClasses: 'bg-[#5F4B3E]/15 dark:bg-[#5F4B3E]/20',
    dotClasses: 'bg-[#5F4B3E] dark:bg-[#8C7262]',
  },
  insights: {
    icon: Lightbulb,
    defaultBadge: 'Key Insight / Subtle Point',
    defaultFooter: "Contemplative Insights · Ma'ariful Qur'an",
    containerClasses: 'bg-[#596B8E]/5 dark:bg-[#596B8E]/12',
    borderClasses: 'border-[#596B8E]/30 dark:border-[#7587AC]/40',
    stripeClasses: 'bg-[#596B8E] dark:bg-[#7587AC]',
    badgeClasses: 'text-[#596B8E] dark:text-[#7587AC]',
    badgeBgClasses: 'bg-[#596B8E]/15 dark:bg-[#596B8E]/20',
    dotClasses: 'bg-[#596B8E] dark:text-[#7587AC]',
  },
  asbab: {
    icon: History,
    defaultBadge: 'Occasion of Revelation (Asbab al-Nuzul)',
    defaultFooter: "Historical Circumstances · Ma'ariful Qur'an",
    containerClasses: 'bg-[#4C7971]/5 dark:bg-[#4C7971]/12',
    borderClasses: 'border-[#4C7971]/30 dark:border-[#639C92]/40',
    stripeClasses: 'bg-[#4C7971] dark:bg-[#639C92]',
    badgeClasses: 'text-[#4C7971] dark:text-[#639C92]',
    badgeBgClasses: 'bg-[#4C7971]/15 dark:bg-[#4C7971]/20',
    dotClasses: 'bg-[#4C7971] dark:bg-[#639C92]',
  },
};

export const TafseerStudyCard: React.FC<TafseerStudyCardProps> = ({
  type,
  title,
  badgeLabel,
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
      className={`relative p-5 sm:p-6 rounded-2xl border ${theme.borderClasses} ${theme.containerClasses} shadow-2xs space-y-3.5 transition-all overflow-hidden select-text`}
    >
      {/* Left colored accent bar giving consistent card-like anchor */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.stripeClasses}`} />

      {/* Header bar with icon and category badge */}
      <div className="flex items-center justify-between gap-2 pl-1.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${theme.badgeBgClasses} shrink-0`}>
            <IconComponent className={`w-3.5 h-3.5 ${theme.badgeClasses}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${theme.badgeClasses}`}>
            {badgeLabel || theme.defaultBadge}
          </span>
        </div>
      </div>

      {/* Title if present (e.g., Ahkam rulings title, Insight title) */}
      {title && (
        <h4 className="font-serif-heading font-semibold text-lg sm:text-[19px] text-stone-900 dark:text-stone-100 tracking-tight pl-1.5">
          {title}
        </h4>
      )}

      {/* Bullet points for takeaways */}
      {points && points.length > 0 && (
        <ul className="space-y-2.5 pl-1.5 text-[15px] sm:text-[15.5px] text-stone-800 dark:text-stone-200 leading-relaxed font-reader">
          {points.map((pt, idx) => (
            <li key={`card-pt-${idx}`} className="flex items-start gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dotClasses} shrink-0 mt-2.5`} />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Narrative body for Ahkam, Insights, Asbab */}
      {content && (
        <div className="pl-1.5 text-[15px] sm:text-[16px] leading-relaxed text-stone-800 dark:text-stone-200 font-reader whitespace-pre-line">
          {content}
        </div>
      )}

      {/* Card Footer matching all card variants */}
      <div className="pt-2.5 pl-1.5 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-reader">
        <span>{footerSource || theme.defaultFooter}</span>
        {onActionClick && actionText && (
          <button
            type="button"
            onClick={onActionClick}
            className={`${theme.badgeClasses} hover:underline font-medium cursor-pointer transition-colors`}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};
