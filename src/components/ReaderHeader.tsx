import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, LayoutGrid, Columns, Menu, BookOpen, Bookmark, BookmarkCheck, Check, X, Layers, PanelLeftOpen } from 'lucide-react';
import { BookmarkRecord } from '../types/quran';

interface ReaderHeaderProps {
  surahName: string;
  surahNumber: number;
  activeVerseRange?: [number, number];
  activeSectionId?: string | null;
  activeSectionTitle?: string;
  viewMode: 'separate' | 'inline';
  onViewModeChange: (mode: 'separate' | 'inline') => void;
  theme: 'parchment' | 'charcoal';
  onToggleTheme: () => void;
  onOpenMobileNav: () => void;
  isLoading?: boolean;
  bookmark?: BookmarkRecord | null;
  bookmarks?: BookmarkRecord[];
  onToggleBookmark: () => void;
  onRemoveBookmark?: (bookmark: BookmarkRecord) => void;
  onResumeBookmark: (bookmark: BookmarkRecord) => void;
  scrollProgress?: number;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenRootExplorer?: () => void;
}

export const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  surahName,
  surahNumber,
  activeVerseRange,
  activeSectionId,
  activeSectionTitle,
  viewMode,
  onViewModeChange,
  theme,
  onToggleTheme,
  onOpenMobileNav,
  isLoading = false,
  bookmark,
  bookmarks = [],
  onToggleBookmark,
  onRemoveBookmark,
  onResumeBookmark,
  scrollProgress = 0,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onOpenRootExplorer,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'saved' | 'removed'>('saved');
  const [isBookmarksMenuOpen, setIsBookmarksMenuOpen] = useState(false);

  // Consolidate bookmarks list
  const allBookmarks: BookmarkRecord[] =
    bookmarks.length > 0 ? bookmarks : bookmark ? [bookmark] : [];

  // Check if current active section is bookmarked
  const isCurrentlyBookmarked = activeSectionId
    ? allBookmarks.some(
        (b) => b.surahNumber === surahNumber && b.sectionId === activeSectionId
      )
    : allBookmarks.some((b) => b.surahNumber === surahNumber);

  const handleBookmarkClick = () => {
    const nextState = !isCurrentlyBookmarked;
    onToggleBookmark();
    setFeedbackType(nextState ? 'saved' : 'removed');
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 2200);
  };

  return (
    <header className="sticky top-0 z-30 w-full h-14 bg-[#F8F7F4]/90 dark:bg-[#18181A]/90 backdrop-blur-md border-b border-[#E8E5DF] dark:border-[#2E2E33] px-3 sm:px-6 flex items-center justify-between gap-3 transition-colors">
      {/* Left: Desktop Sidebar Collapse/Expand Toggle + Mobile Nav Toggle + Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 rounded-md hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Expand Button (only visible when sidebar is collapsed to reopen it) */}
        {isSidebarCollapsed && onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Expand navigation sidebar"
            aria-label="Expand navigation sidebar"
          >
            <PanelLeftOpen className="w-5 h-5 text-[#CD7743] dark:text-[#E08955]" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
          <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">
            {surahNumber}. {surahName}
          </span>
          {activeVerseRange && (
            <>
              <span className="text-stone-400" aria-hidden="true">·</span>
              <span className="text-[#596B8E] dark:text-[#8FA0C5] whitespace-nowrap hidden xs:inline font-medium">
                Verses {activeVerseRange[0]}–{activeVerseRange[1]}
              </span>
            </>
          )}
          {scrollProgress > 0 && (
            <span className="hidden sm:inline-flex items-center text-[11px] font-mono text-[#CD7743] dark:text-[#E08955] bg-[#CD7743]/10 dark:bg-[#CD7743]/15 px-1.5 py-0.5 rounded ml-1 font-medium">
              {Math.round(scrollProgress)}%
            </span>
          )}
          {isLoading && (
            <span className="text-xs text-[#CD7743] animate-pulse ml-1">
              (Loading...)
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Root Explorer + Bookmarks + View Switcher + Theme */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

        {/* Triliteral Root Explorer Button */}
        {onOpenRootExplorer && (
          <button
            type="button"
            onClick={onOpenRootExplorer}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 hidden md:flex items-center justify-center rounded-lg text-xs font-medium bg-stone-100/80 dark:bg-[#25252A] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 hover:text-[#CD7743] dark:hover:text-[#E08955] hover:border-[#CD7743]/40 transition-all cursor-pointer shadow-2xs"
            title="Explore Arabic Triliteral Roots"
            aria-label="Root Explorer"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
        {/* Saved Bookmarks Reference Dropdown (Quick Jump) */}
        {allBookmarks.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBookmarksMenuOpen((prev) => !prev)}
              className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg text-xs font-medium bg-[#CD7743]/10 dark:bg-[#CD7743]/20 text-[#CD7743] dark:text-[#E08955] border border-[#CD7743]/30 hover:bg-[#CD7743]/20 transition-all cursor-pointer shadow-2xs"
              title={`View saved bookmarked sections (${allBookmarks.length})`}
              aria-label="View saved bookmarked sections"
            >
              <BookmarkCheck className="w-4 h-4 text-[#CD7743]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#CD7743] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {allBookmarks.length}
              </span>
            </button>

            {isBookmarksMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-h-80 overflow-y-auto p-2 bg-white dark:bg-[#222227] border border-stone-200 dark:border-stone-700/80 rounded-xl shadow-2xl z-50 text-left space-y-1">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-stone-100 dark:border-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100">
                  <span className="flex items-center gap-1.5 text-[#CD7743] dark:text-[#E08955]">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    Bookmarked Sections ({allBookmarks.length})
                  </span>
                  <button
                    onClick={() => setIsBookmarksMenuOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {allBookmarks.map((bm) => (
                  <div
                    key={`${bm.surahNumber}-${bm.sectionId}`}
                    onClick={() => {
                      onResumeBookmark(bm);
                      setIsBookmarksMenuOpen(false);
                    }}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/15 transition-colors cursor-pointer text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                        Surah {bm.surahNumber}: {bm.surahName}
                      </div>
                      <div className="text-[11px] text-[#596B8E] dark:text-[#8FA0C5] truncate">
                        {bm.verseRange ? `[${bm.verseRange[0]}–${bm.verseRange[1]}] ` : ''}
                        {bm.sectionTitle || 'Section'}
                      </div>
                    </div>
                    {onRemoveBookmark && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBookmark(bm);
                        }}
                        className="p-1 rounded text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-60 group-hover:opacity-100 shrink-0"
                        title="Remove bookmark"
                        aria-label="Remove bookmark"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmark Current Section Button (Strictly Icon Only - No Text) */}
        <div className="relative">
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-lg text-xs font-medium transition-all cursor-pointer border ${
              isCurrentlyBookmarked
                ? 'bg-[#CD7743]/15 dark:bg-[#CD7743]/25 text-[#CD7743] dark:text-[#E08955] border-[#CD7743]/50 shadow-xs hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-800/50 hover:text-red-600 dark:hover:text-red-400'
                : 'bg-stone-100/80 dark:bg-[#25252A] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700/60 hover:text-stone-900 dark:hover:text-stone-100 hover:border-[#CD7743]/40'
            }`}
            title={
              isCurrentlyBookmarked
                ? 'Section bookmarked — click to unbookmark'
                : 'Bookmark this section to reference later'
            }
            aria-label={isCurrentlyBookmarked ? 'Remove bookmark' : 'Bookmark section'}
          >
            <Bookmark
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isCurrentlyBookmarked
                  ? 'fill-[#CD7743] text-[#CD7743]'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
            />
          </button>

          {/* Temporary feedback banner */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 p-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-xs shadow-xl z-50 pointer-events-none flex items-start gap-2"
              >
                {feedbackType === 'removed' ? (
                  <>
                    <Bookmark className="w-4 h-4 text-stone-400 dark:text-stone-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Bookmark removed</div>
                      <div className="text-[11px] opacity-80 truncate">
                        {activeSectionTitle || `Cleared for Surah ${surahNumber}`}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#4C7971] dark:text-[#4C7971] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Section bookmarked!</div>
                      <div className="text-[11px] opacity-80 truncate">
                        Surah {surahNumber} · {activeSectionTitle || (activeVerseRange ? `Verses ${activeVerseRange[0]}–${activeVerseRange[1]}` : surahName)}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dual View Mode Toggle: Separate vs Inline */}
        <div className="flex items-center p-1 rounded-lg bg-stone-200/70 dark:bg-[#25252A] text-xs font-medium">
          <button
            onClick={() => onViewModeChange('separate')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'separate'
                ? 'bg-white dark:bg-[#18181A] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
            title="Separate: Mushaf Arabic block and commentary presented separately"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Separate</span>
          </button>
          <button
            onClick={() => onViewModeChange('inline')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'inline'
                ? 'bg-white dark:bg-[#18181A] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
            title="Inline: Phrase-by-phrase and word-by-word interactive study flow"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inline</span>
          </button>
        </div>


        {/* Theme Spring Sliding Pill Switch */}
        <button
          onClick={onToggleTheme}
          className="relative flex items-center h-8 w-14 rounded-full p-1 bg-stone-200 dark:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD7743] cursor-pointer"
          title={`Switch to ${theme === 'parchment' ? 'Slate Charcoal (Night)' : 'Warm Parchment (Day)'} mode`}
          aria-label="Toggle theme"
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`flex items-center justify-center w-6 h-6 rounded-full shadow-sm ${
              theme === 'charcoal'
                ? 'ml-auto bg-[#CD7743] text-white'
                : 'bg-white text-[#CD7743]'
            }`}
          >
            {theme === 'charcoal' ? (
              <Moon className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </motion.div>
        </button>
      </div>

      {/* Thin, fixed progress bar at the bottom of the ReaderHeader */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E8E5DF]/40 dark:bg-[#2E2E33]/40 overflow-hidden pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress of Surah ${surahNumber}: ${Math.round(scrollProgress)}%`}
      >
        <div
          className="h-full bg-gradient-to-r from-[#CD7743] via-[#E08955] to-[#CD7743] transition-[width] duration-150 ease-out shadow-[0_0_6px_rgba(205,119,67,0.4)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
};
