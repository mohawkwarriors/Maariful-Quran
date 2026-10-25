import React, { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fetchManifest, fetchSurah, globalSearchEngine } from './services/quranService';
import { NavigationTree } from './components/NavigationTree';
import { ReaderHeader } from './components/ReaderHeader';
import { SurahHero } from './components/SurahHero';
import { TafseerSectionView } from './components/TafseerSectionView';
import { RootExplorerModal } from './components/RootExplorerModal';
import { TopicReference } from './services/quranTopics';
import { SurahData, BookmarkRecord, ThematicSection } from './types/quran';
import { Loader2, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
    },
  },
});

function ReaderApp() {
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(2); // Default to Surah Al-Baqarah
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'separate' | 'inline'>('separate');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRootExplorerOpen, setIsRootExplorerOpen] = useState(false);
  const [pendingScrollSectionId, setPendingScrollSectionId] = useState<string | null>(null);
  const readingContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Theme from localStorage with immediate default fallback
  const [theme, setTheme] = useState<'parchment' | 'charcoal'>(() => {
    try {
      const saved = localStorage.getItem('maariful_theme');
      return saved === 'charcoal' ? 'charcoal' : 'parchment';
    } catch {
      return 'parchment';
    }
  });

  // Reactive theme application to DOM on mount and every change
  useEffect(() => {
    const isDark = theme === 'charcoal';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.style.backgroundColor = '#18181A';
      document.body.style.color = '#F3F4F6';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.style.backgroundColor = '#F8F7F4';
      document.body.style.color = '#1F2937';
    }
    localStorage.setItem('maariful_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'parchment' ? 'charcoal' : 'parchment'));
  };

  // Persistent Bookmarks collection state
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>(() => {
    try {
      const savedList = localStorage.getItem('maariful_bookmarks_list');
      if (savedList) {
        return JSON.parse(savedList);
      }
      const single = localStorage.getItem('maariful_bookmark');
      if (single) {
        return [JSON.parse(single)];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync bookmarks list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maariful_bookmarks_list', JSON.stringify(bookmarks));
      if (bookmarks.length > 0) {
        localStorage.setItem('maariful_bookmark', JSON.stringify(bookmarks[0]));
      } else {
        localStorage.removeItem('maariful_bookmark');
      }
    } catch (err) {
      console.warn('Could not persist bookmarks:', err);
    }
  }, [bookmarks]);

  // Load Manifest
  const { data: manifest, isLoading: isManifestLoading, error: manifestError } = useQuery({
    queryKey: ['manifest'],
    queryFn: fetchManifest,
  });

  // Populate search engine once manifest arrives
  useEffect(() => {
    if (manifest) {
      globalSearchEngine.populateFromManifest(manifest);
    }
  }, [manifest]);

  // Current active Surah metadata from manifest
  const currentSurahMeta = manifest?.surahs.find((s) => s.number === activeSurahNumber);

  // Load Surah Tafseer Data (static JSON or on-demand Gemini generation)
  const {
    data: surahData,
    isLoading: isSurahLoading,
    isFetching: isSurahFetching,
    error: surahError,
    refetch: refetchSurah,
  } = useQuery<SurahData>({
    queryKey: ['surah', activeSurahNumber],
    queryFn: () => fetchSurah(activeSurahNumber, currentSurahMeta?.nameTransliterated),
    enabled: !!manifest,
  });

  // Index loaded surah data in FlexSearch for rich in-page search
  useEffect(() => {
    if (surahData) {
      globalSearchEngine.indexSurahData(surahData);
    }
  }, [surahData]);

  // Setup Scroll-Spy via IntersectionObserver (rootMargin: "-20% 0px -70% 0px" as mandated by PRD)
  useEffect(() => {
    if (!surahData?.sections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId) {
              setActiveSectionId(sectionId);
            }
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    const sectionElements = document.querySelectorAll('.tafseer-section-optimized');
    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [surahData, viewMode]);

  // Track scroll progress of the current Surah content
  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      if (isSurahLoading || !surahData) {
        setScrollProgress(0);
        return;
      }

      const container = readingContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const maxScroll = totalHeight - viewportHeight;

      if (maxScroll <= 0) {
        setScrollProgress(100);
        return;
      }

      // Distance scrolled from top of the reading container
      const scrolled = -rect.top;
      const rawProgress = (scrolled / maxScroll) * 100;
      const clamped = Math.min(100, Math.max(0, rawProgress));
      setScrollProgress(clamped);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [surahData, isSurahLoading, viewMode, activeSurahNumber]);

  // Handle section jumping
  const handleSelectSection = (sectionId: string, targetSurahNumber?: number) => {
    if (targetSurahNumber && targetSurahNumber !== activeSurahNumber) {
      setActiveSurahNumber(targetSurahNumber);
      setScrollProgress(0);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSectionId(sectionId);
        }
      }, 300);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(sectionId);
    }
  };

  const handleSelectSurah = (num: number) => {
    setActiveSurahNumber(num);
    setActiveSectionId(null);
    setScrollProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global hotkeys for Focus Mode ('f') and modal closing ('Escape')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === '[' || e.key === ']' || e.key === 'f' || e.key === 'F') {
        setIsSidebarCollapsed((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isRootExplorerOpen) setIsRootExplorerOpen(false);
        else if (isSidebarCollapsed) setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed, isRootExplorerOpen]);

  // Handle jumping to a specific topic reference across Surahs
  const handleSelectTopicReference = (ref: TopicReference) => {
    if (ref.surahNumber !== activeSurahNumber) {
      setActiveSurahNumber(ref.surahNumber);
      setScrollProgress(0);
      setTimeout(() => {
        handleSelectSection(ref.sectionId, ref.surahNumber);
      }, 350);
    } else {
      handleSelectSection(ref.sectionId);
    }
  };

  const handleSelectRootWord = (word: string) => {
    const el = document.getElementById(activeSectionId || '');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Find active section details for breadcrumb and bookmarking
  const currentSection =
    surahData?.sections.find((s) => s.id === activeSectionId) || surahData?.sections[0];

  // Toggle bookmark for a specific section
  const handleToggleBookmarkSection = (sec: ThematicSection) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (b) => b.surahNumber === activeSurahNumber && b.sectionId === sec.id
      );
      if (exists) {
        return prev.filter(
          (b) => !(b.surahNumber === activeSurahNumber && b.sectionId === sec.id)
        );
      } else {
        const newRecord: BookmarkRecord = {
          id: `${activeSurahNumber}-${sec.id}`,
          surahNumber: activeSurahNumber,
          surahName:
            surahData?.nameTransliterated ||
            currentSurahMeta?.nameTransliterated ||
            `Surah ${activeSurahNumber}`,
          sectionId: sec.id,
          sectionTitle: sec.title,
          verseRange: sec.verseRange,
          timestamp: Date.now(),
        };
        return [newRecord, ...prev];
      }
    });
  };

  // Toggle bookmark for current in-view section (from reader header)
  const handleToggleActiveBookmark = () => {
    const sec = currentSection || surahData?.sections[0];
    if (sec) {
      handleToggleBookmarkSection(sec);
    }
  };

  // Remove a specific bookmark record
  const handleRemoveBookmarkRecord = (targetBookmark: BookmarkRecord) => {
    setBookmarks((prev) =>
      prev.filter(
        (b) =>
          !(
            b.surahNumber === targetBookmark.surahNumber &&
            b.sectionId === targetBookmark.sectionId
          )
      )
    );
  };

  // Resume reading from a bookmark
  const handleResumeBookmark = (b: BookmarkRecord) => {
    if (b.surahNumber !== activeSurahNumber) {
      setActiveSurahNumber(b.surahNumber);
      setTimeout(() => {
        handleSelectSection(b.sectionId);
      }, 300);
    } else {
      handleSelectSection(b.sectionId);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F7F4] dark:bg-[#18181A] text-[#1F2937] dark:text-[#F3F4F6] font-reader transition-colors duration-200">
      {/* 1. LEFT PANE (Fixed width ~340px) - Hidden when sidebar collapsed */}
      {!isSidebarCollapsed && (
        <NavigationTree
          surahs={manifest?.surahs || []}
          activeSurahNumber={activeSurahNumber}
          activeSectionId={activeSectionId || currentSection?.id || null}
          onSelectSurah={handleSelectSurah}
          onSelectSection={handleSelectSection}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          onCollapseSidebar={() => setIsSidebarCollapsed(true)}
          onSelectTopicReference={handleSelectTopicReference}
          activeThematicSections={
            surahData?.sections.map((s) => ({
              id: s.id,
              verseRange: s.verseRange,
              title: s.title,
            })) || []
          }
          bookmark={bookmarks[0] || null}
          bookmarks={bookmarks}
          onResumeBookmark={handleResumeBookmark}
          onRemoveBookmark={handleRemoveBookmarkRecord}
        />
      )}

      {/* 2. RIGHT READING CANVAS (Fluid width, max text container ~760px) */}
      <main className="flex-1 flex flex-col min-w-0" ref={readingContainerRef}>
        {/* Sticky Reader Header */}
        <ReaderHeader
          surahName={surahData?.nameTransliterated || currentSurahMeta?.nameTransliterated || 'Loading...'}
          surahNumber={activeSurahNumber}
          activeVerseRange={currentSection?.verseRange}
          activeSectionId={activeSectionId}
          activeSectionTitle={currentSection?.title}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          isLoading={isSurahFetching}
          bookmark={bookmarks[0] || null}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleActiveBookmark}
          onRemoveBookmark={handleRemoveBookmarkRecord}
          onResumeBookmark={handleResumeBookmark}
          scrollProgress={scrollProgress}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenRootExplorer={() => setIsRootExplorerOpen(true)}
        />

        {/* Reading Canvas Container: Uniform layout width regardless of sidebar collapse */}
        <div className="flex-1 w-full mx-auto pb-28 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-4 sm:px-8 lg:px-12">
          {isSurahLoading ? (
            <div className="py-24 px-4 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-[#CD7743] animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif-heading font-semibold text-lg text-stone-900 dark:text-stone-100">
                  Opening Ma'ariful Qur'an...
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Retrieving Uthmanic Arabic text, phrase cards, and authentic exegesis by Mufti Muhammad Shafi
                </p>
              </div>
            </div>
          ) : surahError ? (
            <div className="py-20 px-6 max-w-md mx-auto text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="font-serif-heading font-semibold text-xl text-stone-900 dark:text-stone-100">
                Could Not Load Tafseer
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {(surahError as Error).message || 'An error occurred while compiling the commentary.'}
              </p>
              <button
                onClick={() => refetchSurah()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#CD7743] text-white hover:bg-[#b86432] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Loading
              </button>
            </div>
          ) : surahData ? (
            <>
              {/* Surah Hero Banner */}
              <SurahHero surah={surahData} />

              {/* Thematic Sections List with Content Visibility Optimization */}
              <div className="divide-y divide-[#E8E5DF] dark:divide-[#2E2E33]">
                {surahData.sections.map((section) => (
                  <TafseerSectionView
                    key={section.id}
                    section={section}
                    viewMode={viewMode}
                    isActive={activeSectionId === section.id}
                    isBookmarked={bookmarks.some(
                      (b) => b.surahNumber === activeSurahNumber && b.sectionId === section.id
                    )}
                    onToggleBookmark={() => handleToggleBookmarkSection(section)}
                  />
                ))}
              </div>

              {/* Surah Complete Footer & Next Surah Quick Jump */}
              <div className="pt-12 pb-6 px-6 text-center space-y-3">
                <div className="w-8 h-0.5 bg-[#CD7743]/40 mx-auto rounded-full" />
                <p className="text-xs uppercase tracking-widest text-[#596B8E] dark:text-[#788BB3]">
                  End of Surah {surahData.nameTransliterated}
                </p>
                {activeSurahNumber < 114 && (
                  <button
                    onClick={() => handleSelectSurah(activeSurahNumber + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#222227] border border-stone-200 dark:border-stone-700/80 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-[#CD7743] dark:hover:border-[#CD7743] shadow-xs transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
                    <span>Proceed to Next: Surah {activeSurahNumber + 1}</span>
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>





      {/* Quranic Triliteral Root Explorer Modal */}
      <RootExplorerModal
        isOpen={isRootExplorerOpen}
        onClose={() => setIsRootExplorerOpen(false)}
        onSelectWord={handleSelectRootWord}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReaderApp />
    </QueryClientProvider>
  );
}
