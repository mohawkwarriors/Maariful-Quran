import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen } from 'lucide-react';
import { claimActivePopover, releaseActivePopover } from '../utils/popoverCoordinator';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ open, onClose }) => {
  const coordinatorIdRef = useRef<symbol | null>(null);
  if (coordinatorIdRef.current === null) {
    coordinatorIdRef.current = Symbol('about-modal');
  }

  useEffect(() => {
    const id = coordinatorIdRef.current!;
    if (!open) {
      releaseActivePopover(id);
      return;
    }

    claimActivePopover(id, true, onClose);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      releaseActivePopover(id);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#FDFCFB] dark:bg-[#1E1E22] border border-[#E8E5DF] dark:border-[#2E2E33] shadow-2xl text-stone-800 dark:text-stone-200 font-reader">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 sm:px-6 bg-[#FDFCFB]/95 dark:bg-[#1E1E22]/95 backdrop-blur-xs border-b border-[#E8E5DF] dark:border-[#2E2E33]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#CD7743]/12 dark:bg-[#E08955]/15 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
            </div>
            <div className="min-w-0">
              <h2
                id="about-modal-title"
                className="font-serif-heading font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-tight truncate"
              >
                About Ma&apos;ariful Qur&apos;an
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                <span dir="rtl" lang="ar" className="font-quran text-xs">معارف القرآن</span> · A Comprehensive Commentary of the Holy Qur&apos;an
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close About dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5 text-[14.5px] leading-[1.75]">
          {/* What Ma'ariful Qur'an is about */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#CD7743] dark:text-[#E08955]">
              The Original Book
            </h3>
            <p className="text-stone-700 dark:text-stone-300">
              <em>Ma&apos;ariful Qur&apos;an</em> (&ldquo;Insights of the Qur&apos;an&rdquo;) is an
              eight-volume commentary (<em>tafsir</em>) of the Holy Qur&apos;an. Originally delivered as
              weekly Urdu radio discourses beginning in 1954 and compiled into print between 1964 and
              1972, it brings together classical Sunni exegesis, occasions of revelation
              (<em>Asbab al-Nuzul</em>), juristic rulings (<em>Ahkam</em>), linguistic explanation,
              and moral and spiritual guidance for daily life.
            </p>
          </div>

          {/* Author & Translation Credits */}
          <div className="border-l-2 border-[#CD7743]/70 dark:border-[#E08955]/70 bg-[#CD7743]/[0.035] dark:bg-[#CD7743]/[0.04] pl-4 pr-3.5 py-3.5 rounded-r-lg space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#CD7743] dark:text-[#E08955]">
              Author &amp; Translators
            </h3>

            <dl className="space-y-2.5 text-[13.5px] leading-relaxed">
              <div>
                <dt className="font-semibold text-stone-900 dark:text-stone-100">
                  Original Author (Urdu)
                </dt>
                <dd className="text-stone-600 dark:text-stone-300">
                  <strong>Maulana Mufti Muhammad Shafi&apos; Usmani</strong> (1897–1976) — Grand Mufti of
                  Pakistan and founder of Darul Uloom Karachi.
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-stone-900 dark:text-stone-100">
                  English Translators
                </dt>
                <dd className="text-stone-600 dark:text-stone-300">
                  <strong>Prof. Muhammad Hasan Askari</strong> (who began the translation of Volume 1 prior
                  to his passing in 1978) and <strong>Prof. Muhammad Shamim</strong> (who translated the
                  remaining volumes).
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-stone-900 dark:text-stone-100">
                  Revision &amp; Supplementary Notes
                </dt>
                <dd className="text-stone-600 dark:text-stone-300">
                  <strong>Justice Mufti Muhammad Taqi Usmani</strong> — personally revised the English
                  edition and added explanatory notes, published by Maktaba-e-Darul-Uloom Karachi.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
