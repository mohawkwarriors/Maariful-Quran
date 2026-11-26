import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fetchManifest, fetchSurah, globalSearchEngine } from './services/quranService';
import { NavigationTree } from './components/NavigationTree';
import { ReaderHeader } from './components/ReaderHeader';
import { SurahHero } from './components/SurahHero';
import { TafseerSectionView } from './components/TafseerSectionView';
import { TopicReference } from './services/quranTopics';
import { hasActivePopover } from './utils/popoverCoordinator';
import { SurahData, BookmarkRecord, ThematicSection } from './types/quran';
import { Loader2, AlertCircle, RefreshCw, BookOpen, ArrowLeft } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
    },
  },
});

const HEADER_SCROLL_OFFSET = 72;

function ReaderApp() {
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(2); // Default to Surah Al-Baqarah
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'separate' | 'inline'>('separate');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pendingScrollSectionId, setPendingScrollSectionId] = useState<string | null>(null);
  const readingContainerRef = useRef<HTMLDivElement>(null);
  const scrollCancelRef = useRef<(() => void) | null>(null);

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
  const isValidBookmark = (b: any): b is BookmarkRecord =>
    Boolean(b && typeof b === 'object' && typeof b.surahNumber === 'number' && typeof b.sectionId === 'string');

  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>(() => {
    try {
      const savedList = localStorage.getItem('maariful_bookmarks_list');
      if (savedList) {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed)) return parsed.filter(isValidBookmark);
      }
      const single = localStorage.getItem('maariful_bookmark');
      if (single) {
        const parsedSingle = JSON.parse(single);
        if (isValidBookmark(parsedSingle)) return [parsedSingle];
      }
      return [];
    } catch {
      return [];
    }
  });

  // O(1) lookup set for bookmarked sections
  const bookmarkedKeySet = useMemo(
    () => new Set(bookmarks.map((b) => `${b.surahNumber}:${b.sectionId}`)),
    [bookmarks]
  );

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
  const {
    data: manifest,
    isLoading: isManifestLoading,
    error: manifestError,
    refetch: refetchManifest,
  } = useQuery({
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
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const sectionId = visibleEntries[0].target.getAttribute('data-section-id');
          if (sectionId) {
            setActiveSectionId(sectionId);
          }
        }
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
        setScrollProgress(window.scrollY > 0 ? 100 : 0);
        return;
      }

      // Distance scrolled from top of the reading container (quantized to integer % to avoid 60fps root re-renders)
      const scrolled = -rect.top;
      const rawProgress = (scrolled / maxScroll) * 100;
      const rounded = Math.round(Math.min(100, Math.max(0, rawProgress)));
      setScrollProgress((prev) => (prev === rounded ? prev : rounded));
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
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && readingContainerRef.current) {
      resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(readingContainerRef.current);
    }
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      resizeObserver?.disconnect();
    };
  }, [surahData, isSurahLoading, viewMode, activeSurahNumber]);

  // Cleanup any in-flight section scroll convergence loop on unmount
  useEffect(() => {
    return () => {
      scrollCancelRef.current?.();
    };
  }, []);

  /**
   * Accurately scrolls to a section element even when preceding sections use
   * `content-visibility: auto` (where smooth scrolling across skipped sections
   * otherwise causes massive layout-shift undershoots on long Surahs like Al-Baqarah).
   */
  const scrollToSectionAccurately = useCallback((el: HTMLElement) => {
    scrollCancelRef.current?.();

    const initialRect = el.getBoundingClientRect();
    const isFarJump = Math.abs(initialRect.top - HEADER_SCROLL_OFFSET) > window.innerHeight * 2;
    const targetTop = Math.max(0, window.scrollY + initialRect.top - HEADER_SCROLL_OFFSET);

    if (!isFarJump) {
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      scrollCancelRef.current = null;
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let framesRemaining = 8;

    const cancel = () => {
      if (cancelled) return;
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      if (scrollCancelRef.current === cancel) {
        scrollCancelRef.current = null;
      }
    };

    scrollCancelRef.current = cancel;
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchstart', cancel, { passive: true, once: true });

    const converge = () => {
      if (cancelled || !el.isConnected) {
        cancel();
        return;
      }
      const rect = el.getBoundingClientRect();
      const delta = rect.top - HEADER_SCROLL_OFFSET;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 && delta > 0;
      const atTop = window.scrollY <= 1 && delta < 0;

      if (Math.abs(delta) > 4 && !atBottom && !atTop) {
        window.scrollTo({
          top: Math.max(0, window.scrollY + delta),
          behavior: 'auto',
        });
      }

      framesRemaining -= 1;
      if (framesRemaining <= 0 || (Math.abs(el.getBoundingClientRect().top - HEADER_SCROLL_OFFSET) <= 4 && framesRemaining <= 5)) {
        cancel();
        return;
      }
      rafId = window.requestAnimationFrame(converge);
    };

    window.scrollTo({ top: targetTop, behavior: 'auto' });
    rafId = window.requestAnimationFrame(converge);
  }, []);

  const resolveSectionElement = useCallback(
    (sectionId: string): { el: HTMLElement | null; resolvedId: string } => {
      const directEl = document.getElementById(sectionId);
      if (directEl) return { el: directEl, resolvedId: sectionId };
      const m = sectionId.match(/^(\d+)-(\d+)-(\d+)$/);
      if (m && surahData?.sections) {
        const startVerse = parseInt(m[2], 10);
        const matchedSec = surahData.sections.find(
          (sec) => sec.verseRange[0] <= startVerse && startVerse <= sec.verseRange[1]
        );
        if (matchedSec) {
          return { el: document.getElementById(matchedSec.id), resolvedId: matchedSec.id };
        }
      }
      return { el: null, resolvedId: sectionId };
    },
    [surahData?.sections]
  );

  // Handle section jumping with race-free pending section scrolling (even while target Surah is still loading)
  const handleSelectSection = useCallback(
    (sectionId: string, targetSurahNumber?: number) => {
      const targetSurah = targetSurahNumber ?? activeSurahNumber;
      if (targetSurah !== activeSurahNumber) {
        scrollCancelRef.current?.();
        setPendingScrollSectionId(sectionId);
        setActiveSurahNumber(targetSurah);
        setScrollProgress(0);
        return;
      }

      if (!surahData || surahData.number !== targetSurah) {
        setPendingScrollSectionId(sectionId);
        return;
      }

      const { el, resolvedId } = resolveSectionElement(sectionId);
      if (el) {
        scrollToSectionAccurately(el);
        setActiveSectionId(resolvedId);
      } else {
        setPendingScrollSectionId(sectionId);
      }
    },
    [activeSurahNumber, resolveSectionElement, scrollToSectionAccurately, surahData]
  );

  // Scroll to pending section once Surah data finishes loading into the DOM
  useEffect(() => {
    if (!pendingScrollSectionId || !surahData || surahData.number !== activeSurahNumber) return;

    const timer = setTimeout(() => {
      const { el, resolvedId } = resolveSectionElement(pendingScrollSectionId);
      if (el) {
        scrollToSectionAccurately(el);
        setActiveSectionId(resolvedId);
      }
      setPendingScrollSectionId(null);
    }, 60);

    return () => clearTimeout(timer);
  }, [surahData, pendingScrollSectionId, activeSurahNumber, resolveSectionElement, scrollToSectionAccurately]);

  const handleSelectSurah = useCallback(
    (num: number) => {
      scrollCancelRef.current?.();
      const isSameSurah = num === activeSurahNumber;
      const isFarFromTop = window.scrollY > window.innerHeight * 2;
      setActiveSurahNumber(num);
      setActiveSectionId(null);
      setPendingScrollSectionId(null);
      setScrollProgress(0);
      window.scrollTo({ top: 0, behavior: !isSameSurah || isFarFromTop ? 'auto' : 'smooth' });
    },
    [activeSurahNumber]
  );

  const handleCloseMobileNav = useCallback(() => setIsMobileNavOpen(false), []);
  const handleCollapseSidebar = useCallback(() => setIsSidebarCollapsed(true), []);

  // Global hotkeys for desktop Focus Mode ('f', '[', ']') and Escape exit (only when no overlay handled Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      if (e.key === '[' || e.key === ']' || e.key === 'f' || e.key === 'F') {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) return;
        setIsSidebarCollapsed((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (e.defaultPrevented || hasActivePopover() || isMobileNavOpen) return;
        if (isSidebarCollapsed) setIsSidebarCollapsed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed, isMobileNavOpen]);

  // Handle jumping to a specific topic reference across Surahs
  const handleSelectTopicReference = useCallback(
    (ref: TopicReference) => {
      handleSelectSection(ref.sectionId, ref.surahNumber);
    },
    [handleSelectSection]
  );

  // Find active section details for breadcrumb and bookmarking
  const currentSection =
    surahData?.sections.find((s) => s.id === activeSectionId) || surahData?.sections[0];
  const resolvedActiveSectionId =
    surahData?.number === activeSurahNumber ? (activeSectionId || currentSection?.id || null) : null;

  // Toggle bookmark for a specific section
  const handleToggleBookmarkSection = useCallback(
    (sec: ThematicSection) => {
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
    },
    [activeSurahNumber, surahData?.nameTransliterated, currentSurahMeta?.nameTransliterated]
  );

  // Toggle bookmark for current in-view section (from reader header)
  const handleToggleActiveBookmark = () => {
    const sec = currentSection || surahData?.sections[0];
    if (sec) {
      handleToggleBookmarkSection(sec);
    }
  };

  // Remove a specific bookmark record
  const handleRemoveBookmarkRecord = useCallback((targetBookmark: BookmarkRecord) => {
    setBookmarks((prev) =>
      prev.filter(
        (b) =>
          !(
            b.surahNumber === targetBookmark.surahNumber &&
            b.sectionId === targetBookmark.sectionId
          )
      )
    );
  }, []);

  // Resume reading from a bookmark
  const handleResumeBookmark = useCallback(
    (b: BookmarkRecord) => {
      handleSelectSection(b.sectionId, b.surahNumber);
    },
    [handleSelectSection]
  );

  const activeThematicSections = useMemo(
    () =>
      surahData?.sections.map((s) => {
        const manifestSec = currentSurahMeta?.sectionsPreview?.find((p) => p.id === s.id);
        const isInvalid = !s.title || /^[\s\-_—─–]+$/.test(s.title);
        return {
          id: s.id,
          verseRange: s.verseRange,
          title: manifestSec?.title || (isInvalid ? `Verses ${s.verseRange[0]}–${s.verseRange[1]}` : s.title),
          summary: s.summary || manifestSec?.summary,
        };
      }) || [],
    [surahData?.sections, currentSurahMeta?.sectionsPreview]
  );

  return (
    <div className="min-h-screen flex bg-[#F8F7F4] dark:bg-[#18181A] text-[#1F2937] dark:text-[#F3F4F6] font-reader transition-colors duration-200">
      {/* 1. LEFT PANE & MOBILE DRAWER (Always mounted so desktop collapse never locks out mobile navigation) */}
      <NavigationTree
        surahs={manifest?.surahs || []}
        activeSurahNumber={activeSurahNumber}
        activeSectionId={resolvedActiveSectionId}
        onSelectSurah={handleSelectSurah}
        onSelectSection={handleSelectSection}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={handleCloseMobileNav}
        isSidebarCollapsed={isSidebarCollapsed}
        onCollapseSidebar={handleCollapseSidebar}
        onSelectTopicReference={handleSelectTopicReference}
        activeThematicSections={activeThematicSections}
        bookmark={bookmarks[0] || null}
        bookmarks={bookmarks}
        onResumeBookmark={handleResumeBookmark}
        onRemoveBookmark={handleRemoveBookmarkRecord}
      />

      {/* 2. RIGHT READING CANVAS (Fluid width, max text container ~760px) */}
      <main className="flex-1 flex flex-col min-w-0" ref={readingContainerRef}>
        {/* Sticky Reader Header */}
        <ReaderHeader
          surahName={surahData?.nameTransliterated || currentSurahMeta?.nameTransliterated || 'Loading...'}
          surahNumber={activeSurahNumber}
          activeVerseRange={currentSection?.verseRange}
          activeSectionId={resolvedActiveSectionId}
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
        />

        {/* Reading Canvas Container: Uniform layout width regardless of sidebar collapse */}
        <div className="flex-1 w-full mx-auto pb-28 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-4 sm:px-8 lg:px-12">
          {isManifestLoading || isSurahLoading ? (
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
          ) : manifestError || surahError ? (
            <div className="py-20 px-6 max-w-md mx-auto text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="font-serif-heading font-semibold text-xl text-stone-900 dark:text-stone-100">
                Could Not Load Tafseer
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {((manifestError || surahError) as Error).message || 'An error occurred while compiling the commentary.'}
              </p>
              <button
                onClick={() => (manifestError ? refetchManifest() : refetchSurah())}
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
              <div>
                {surahData.sections.map((section) => (
                  <TafseerSectionView
                    key={section.id}
                    section={section}
                    viewMode={viewMode}
                    isActive={resolvedActiveSectionId === section.id}
                    isBookmarked={bookmarkedKeySet.has(`${activeSurahNumber}:${section.id}`)}
                    onToggleBookmarkSection={handleToggleBookmarkSection}
                  />
                ))}
              </div>

              {/* Surah Complete Footer & Previous / Next Surah Quick Jump */}
              <div className="pt-12 pb-6 px-6 text-center space-y-3">
                <div className="w-8 h-0.5 bg-[#CD7743]/40 mx-auto rounded-full" />
                <p className="text-xs uppercase tracking-widest text-[#596B8E] dark:text-[#788BB3]">
                  End of Surah {surahData.nameTransliterated}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {activeSurahNumber > 1 && (
                    <button
                      type="button"
                      onClick={() => handleSelectSurah(activeSurahNumber - 1)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#222227] border border-stone-200 dark:border-stone-700/80 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-[#CD7743] dark:hover:border-[#CD7743] shadow-xs transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
                      <span>Previous: Surah {activeSurahNumber - 1}</span>
                    </button>
                  )}
                  {activeSurahNumber < 114 && (
                    <button
                      type="button"
                      onClick={() => handleSelectSurah(activeSurahNumber + 1)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#222227] border border-stone-200 dark:border-stone-700/80 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-[#CD7743] dark:hover:border-[#CD7743] shadow-xs transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
                      <span>Proceed to Next: Surah {activeSurahNumber + 1}</span>
                    </button>
                  )}
                </div>
                <p className="pt-3 text-[11px] text-stone-400 dark:text-stone-500">
                  Exegesis: Ma&apos;ariful Qur&apos;an (Mufti Muhammad Shafi) · Morphology &amp; Lemmas:{' '}
                  <a
                    href="https://corpus.quran.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#CD7743] dark:hover:text-[#E08955] underline decoration-stone-300 dark:decoration-stone-700 underline-offset-2 transition-colors"
                  >
                    Quranic Arabic Corpus
                  </a>
                </p>
              </div>
            </>
          ) : null}
        </div>
      </main>
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
