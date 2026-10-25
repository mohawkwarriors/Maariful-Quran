import React, { useState, useMemo } from 'react';
import { Search, Book, Layers, ChevronRight, ChevronDown, X, BookmarkCheck, Bookmark, PanelLeftClose, Compass } from 'lucide-react';
import { SurahManifestItem, SearchResultItem, BookmarkRecord } from '../types/quran';
import { globalSearchEngine } from '../services/quranService';
import { QURAN_THEMATIC_TOPICS, QURAN_TOPIC_CATEGORIES, TopicReference } from '../services/quranTopics';

const JUZ_ARABIC_NAMES: Record<number, string> = {
  1: 'الجزء ١', 2: 'الجزء ٢', 3: 'الجزء ٣', 4: 'الجزء ٤', 5: 'الجزء ٥',
  6: 'الجزء ٦', 7: 'الجزء ٧', 8: 'الجزء ٨', 9: 'الجزء ٩', 10: 'الجزء ١٠',
  11: 'الجزء ١١', 12: 'الجزء ١٢', 13: 'الجزء ١٣', 14: 'الجزء ١٤', 15: 'الجزء ١٥',
  16: 'الجزء ١٦', 17: 'الجزء ١٧', 18: 'الجزء ١٨', 19: 'الجزء ١٩', 20: 'الجزء ٢٠',
  21: 'الجزء ٢١', 22: 'الجزء ٢٢', 23: 'الجزء ٢٣', 24: 'الجزء ٢٤', 25: 'الجزء ٢٥',
  26: 'الجزء ٢٦', 27: 'الجزء ٢٧', 28: 'الجزء ٢٨', 29: 'الجزء ٢٩', 30: 'الجزء ٣٠',
};

interface NavigationTreeProps {
  surahs: SurahManifestItem[];
  activeSurahNumber: number;
  activeSectionId: string | null;
  onSelectSurah: (surahNumber: number) => void;
  onSelectSection: (sectionId: string, surahNumber?: number) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onCollapseSidebar?: () => void;
  onSelectTopicReference?: (ref: TopicReference) => void;
  activeThematicSections?: {
    id: string;
    verseRange: [number, number];
    title: string;
    summary?: string;
  }[];
  bookmark?: BookmarkRecord | null;
  bookmarks?: BookmarkRecord[];
  onResumeBookmark?: (b: BookmarkRecord) => void;
  onRemoveBookmark?: (b: BookmarkRecord) => void;
}

export const NavigationTree: React.FC<NavigationTreeProps> = ({
  surahs,
  activeSurahNumber,
  activeSectionId,
  onSelectSurah,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  onCollapseSidebar,
  onSelectTopicReference,
  activeThematicSections = [],
  bookmark,
  bookmarks = [],
  onResumeBookmark,
  onRemoveBookmark,
}) => {
  const allBookmarks = bookmarks.length > 0 ? bookmarks : bookmark ? [bookmark] : [];
  const [navTab, setNavTab] = useState<'surah' | 'juz' | 'theme'>('surah');
  const [selectedTopicCategory, setSelectedTopicCategory] = useState<string>('all');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Track open/collapsed state per surah in navigation tree
  const [surahExpandedMap, setSurahExpandedMap] = useState<Record<number, boolean>>({});

  // Ensure activeSurahNumber defaults to expanded unless explicitly collapsed
  const isSurahExpanded = (num: number): boolean => {
    if (surahExpandedMap[num] !== undefined) {
      return surahExpandedMap[num];
    }
    return num === activeSurahNumber;
  };

  const toggleSurahExpand = (num: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSurahExpandedMap((prev) => ({
      ...prev,
      [num]: !isSurahExpanded(num),
    }));
  };

  const collapseAllSurahs = () => {
    const map: Record<number, boolean> = {};
    surahs.forEach((s) => {
      map[s.number] = false;
    });
    setSurahExpandedMap(map);
  };

  const expandAllSurahs = () => {
    const map: Record<number, boolean> = {};
    surahs.forEach((s) => {
      map[s.number] = true;
    });
    setSurahExpandedMap(map);
  };

  // Group surahs by Juz
  const juzMap = useMemo(() => {
    const map = new Map<number, SurahManifestItem[]>();
    for (let j = 1; j <= 30; j++) {
      map.set(j, []);
    }
    surahs.forEach((s) => {
      for (let j = s.juzStart; j <= s.juzEnd; j++) {
        const list = map.get(j) || [];
        if (!list.find((x) => x.number === s.number)) {
          list.push(s);
          map.set(j, list);
        }
      }
    });
    return map;
  }, [surahs]);


  // Filter thematic topics by category and search query
  const filteredTopics = useMemo(() => {
    return QURAN_THEMATIC_TOPICS.filter((topic) => {
      const matchesCategory =
        selectedTopicCategory === 'all' || topic.category === selectedTopicCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        (topic.arabicTitle && topic.arabicTitle.includes(q)) ||
        topic.references.some(
          (r) =>
            r.surahName.toLowerCase().includes(q) ||
            r.excerpt.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedTopicCategory, searchQuery]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: prev[topicId] === undefined ? false : !prev[topicId],
    }));
  };

  const collapseAllTopics = () => {
    const map: Record<string, boolean> = {};
    QURAN_THEMATIC_TOPICS.forEach((t) => {
      map[t.id] = false;
    });
    setExpandedTopics(map);
  };

  const expandAllTopics = () => {
    const map: Record<string, boolean> = {};
    QURAN_THEMATIC_TOPICS.forEach((t) => {
      map[t.id] = true;
    });
    setExpandedTopics(map);
  };

  // Juz expansion state & helpers
  const [juzExpandedMap, setJuzExpandedMap] = useState<Record<number, boolean>>({});

  const isJuzExpanded = (juzNum: number): boolean => {
    if (juzExpandedMap[juzNum] !== undefined) {
      return juzExpandedMap[juzNum];
    }
    const currentSurah = surahs.find((s) => s.number === activeSurahNumber);
    if (currentSurah) {
      return juzNum >= currentSurah.juzStart && juzNum <= currentSurah.juzEnd;
    }
    return juzNum === 1;
  };

  const toggleJuzExpand = (juzNum: number) => {
    setJuzExpandedMap((prev) => ({
      ...prev,
      [juzNum]: !isJuzExpanded(juzNum),
    }));
  };

  const collapseAllJuz = () => {
    const map: Record<number, boolean> = {};
    for (let j = 1; j <= 30; j++) map[j] = false;
    setJuzExpandedMap(map);
  };

  const expandAllJuz = () => {
    const map: Record<number, boolean> = {};
    for (let j = 1; j <= 30; j++) map[j] = true;
    setJuzExpandedMap(map);
  };

  // Handle instant search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      setIsSearching(true);
      const results = globalSearchEngine.search(val, 15);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleResultClick = (res: SearchResultItem) => {
    if (res.sectionId) {
      onSelectSection(res.sectionId, res.surahNumber);
    } else if (res.surahNumber !== activeSurahNumber) {
      onSelectSurah(res.surahNumber);
    }
    setIsSearching(false);
    setSearchQuery('');
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col bg-[#FDFCFB] dark:bg-[#1B1B1E] border-r border-[#E8E5DF] dark:border-[#2E2E33] select-none">
      {/* Top Header / Branding */}
      <div className="p-4 sm:p-5 border-b border-[#E8E5DF] dark:border-[#2E2E33]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 32 32"
              className="w-8 h-8 rounded-lg shadow-xs shrink-0 select-none"
              aria-label="Ma'ariful Qur'an"
              role="img"
            >
              <rect width="32" height="32" rx="8" fill="#CD7743" />
              <path d="M 19.48 15.32 L 18.2 15.31 Q 16.39 15.31 15 15.61 Q 13.61 15.92 13.61 16.31 Q 13.99 17.51 14.3 18.54 Q 14.6 19.58 14.6 20.51 Q 14.6 21.18 14.46 21.6 Q 14.32 22.01 13.96 22.5 Q 13.85 21.2 13.47 19.76 Q 13.34 19.27 12.84 17.64 Q 12.52 16.64 12.52 16.31 Q 12.52 15.85 12.77 15.16 Q 12.98 14.6 13.25 14.16 Q 13.56 13.67 14.36 13.38 Q 15.14 13.09 16.75 12.92 Q 15.95 11.81 15.37 11.81 Q 15.1 11.81 14.88 12.01 Q 14.65 12.21 14.14 12.87 L 13.67 12.64 Q 14.1 11.12 14.74 10.31 Q 15.37 9.5 16.14 9.5 Q 16.79 9.5 17.61 10.26 Q 18.42 11.02 19.48 12.63 Z" fill="#FFFFFF" />
            </svg>
            <div>
              <span className="font-serif-heading font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                Ma'ariful Qur'an
              </span>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Interactive Thematic Reader
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Sidebar Button */}
            {onCollapseSidebar && (
              <button
                type="button"
                onClick={onCollapseSidebar}
                className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search Surahs, rulings, and terms"
            placeholder="Search Surahs, rulings, terms..."
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-stone-100 dark:bg-[#25252A] border border-stone-200 dark:border-stone-700/80 text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#CD7743]/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Results Dropdown Overlay */}
          {isSearching && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-88 overflow-y-auto bg-white dark:bg-[#222227] border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xl z-50 divide-y divide-stone-100 dark:divide-stone-800">
              {searchResults.length === 0 ? (
                <div className="p-4 text-sm text-center text-stone-500 dark:text-stone-400">
                  No matching passages found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleResultClick(res)}
                    className="w-full text-left p-3.5 hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/15 transition-colors block cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs text-[#CD7743] dark:text-[#E08955] font-medium mb-0.5">
                      <span className="uppercase tracking-wider font-semibold">{res.type}</span>
                      <span className="text-[#596B8E] text-xs font-mono">{res.surahName}</span>
                    </div>
                    <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {res.title}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                      {res.snippet}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Quick Bookmarks Jump in Navigation */}
        {allBookmarks.length > 0 && onResumeBookmark && (
          <div className="mt-3 p-2 rounded-xl bg-[#CD7743]/8 dark:bg-[#CD7743]/15 border border-[#CD7743]/30">
            <div className="flex items-center justify-between text-xs font-semibold text-[#CD7743] dark:text-[#E08955] mb-1.5 px-1">
              <span className="flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Bookmarked Sections ({allBookmarks.length})
              </span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
              {allBookmarks.map((bm) => (
                <div
                  key={`${bm.surahNumber}-${bm.sectionId}`}
                  className="group flex items-center justify-between p-1.5 rounded-lg bg-white/70 dark:bg-[#222227]/70 hover:bg-white dark:hover:bg-[#26262C] border border-stone-200/60 dark:border-stone-700/60 text-xs transition-colors cursor-pointer"
                  onClick={() => {
                    onResumeBookmark(bm);
                    onCloseMobile();
                  }}
                >
                  <div className="min-w-0 flex-1 pr-1.5">
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
          </div>
        )}

        {/* Tab Switch: Surah vs Juz vs Theme */}
        <div className="flex items-center gap-1 mt-3.5 p-1 rounded-xl bg-stone-100 dark:bg-[#25252A] text-xs font-medium">
          <button
            onClick={() => setNavTab('surah')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-all cursor-pointer ${
              navTab === 'surah'
                ? 'bg-white dark:bg-[#1B1B1E] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Book className="w-3.5 h-3.5" />
            <span>Surah</span>
          </button>
          <button
            onClick={() => setNavTab('juz')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
              navTab === 'juz'
                ? 'bg-white dark:bg-[#1B1B1E] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Juz</span>
          </button>
          <button
            onClick={() => setNavTab('theme')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
              navTab === 'theme'
                ? 'bg-white dark:bg-[#1B1B1E] text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Theme</span>
          </button>
        </div>
      </div>

      {/* Navigation List Body with Increased Legibility & Font Sizes */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {navTab === 'surah' ? (
          /* ================= 1. SURAH LIST ================= */
          <div className="space-y-2 pb-6">
            {/* Collapse/Expand All Toolbar */}
            <div className="flex items-center justify-between px-1.5 pt-0.5 pb-1 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-medium text-stone-600 dark:text-stone-300">114 Chapters</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={collapseAllSurahs}
                  className="text-[11px] font-medium text-stone-500 hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors cursor-pointer"
                  title="Collapse all Surahs"
                >
                  Collapse All
                </button>
                <span className="text-stone-300 dark:text-stone-700">·</span>
                <button
                  type="button"
                  onClick={expandAllSurahs}
                  className="text-[11px] font-medium text-stone-500 hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors cursor-pointer"
                  title="Expand all Surahs"
                >
                  Expand All
                </button>
              </div>
            </div>

            {surahs.map((surah) => {
              const isSelected = surah.number === activeSurahNumber;
              const isExpanded = isSurahExpanded(surah.number);
              const sectionsToDisplay =
                surah.sectionsPreview && surah.sectionsPreview.length > 0
                  ? surah.sectionsPreview
                  : (isSelected && activeThematicSections.length > 0 ? activeThematicSections : []);

              return (
                <div
                  key={`surah-${surah.number}`}
                  className={`rounded-xl border overflow-hidden transition-all shadow-2xs ${
                    isSelected
                      ? 'border-[#CD7743]/45 dark:border-[#CD7743]/50 bg-white dark:bg-[#202025] ring-1 ring-[#CD7743]/20'
                      : 'border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#202025]'
                  }`}
                >
                  {/* Surah Card Header */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isSelected) {
                        onSelectSurah(surah.number);
                        setSurahExpandedMap((prev) => ({ ...prev, [surah.number]: true }));
                      } else {
                        toggleSurahExpand(surah.number);
                      }
                    }}
                    className={`w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#CD7743]/8 dark:bg-[#CD7743]/15'
                        : 'hover:bg-stone-50/80 dark:hover:bg-[#25252B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                          isSelected
                            ? 'bg-[#CD7743] text-white'
                            : 'bg-stone-100 dark:bg-[#2A2A30] text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {String(surah.number).padStart(3, '0')}
                      </span>
                      <div className="min-w-0 flex-1 truncate">
                        <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {surah.nameTransliterated}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          {surah.nameEnglish} ·{' '}
                          <span className="text-[#596B8E] dark:text-[#788BB3] font-medium">
                            {surah.versesCount} verses
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-1">
                      <span className="font-quran text-base sm:text-lg text-stone-700 dark:text-stone-300">
                        {surah.nameArabic}
                      </span>
                      <div className="p-0.5 text-stone-400">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Thematic Sections Sub-Tray */}
                  {isExpanded && sectionsToDisplay.length > 0 && (
                    <div className="border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#1A1A1E]/70 p-2 sm:p-2.5 space-y-1.5">
                      {sectionsToDisplay.map((sec) => {
                        const isSecActive = isSelected && activeSectionId === sec.id;
                        const isSecBookmarked = allBookmarks.some(
                          (b) => b.surahNumber === surah.number && b.sectionId === sec.id
                        );
                        return (
                          <button
                            key={sec.id}
                            onClick={() => {
                              onSelectSection(sec.id, surah.number);
                              onCloseMobile();
                            }}
                            className={`w-full text-left p-2 rounded-lg border transition-all flex items-start justify-between gap-2 group cursor-pointer ${
                              isSecActive
                                ? 'bg-[#CD7743]/15 dark:bg-[#CD7743]/25 border-[#CD7743]/50 text-[#CD7743] dark:text-[#E08955] font-semibold shadow-2xs'
                                : 'bg-white dark:bg-[#222227] hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/15 border-stone-200/60 dark:border-stone-700/60 text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            <div className="flex items-start gap-2 min-w-0 flex-1">
                              <span className="text-[#596B8E] dark:text-[#788BB3] font-mono font-medium shrink-0 mt-0.5 text-[11px]">
                                [{sec.verseRange[0]}–{sec.verseRange[1]}]
                              </span>
                              <div className="text-xs font-semibold leading-snug line-clamp-2 min-w-0 flex-1">
                                {!sec.title || /^[\s\-_—─–]+$/.test(sec.title)
                                  ? `Verses ${sec.verseRange[0]}–${sec.verseRange[1]}`
                                  : sec.title}
                              </div>
                            </div>
                            {isSecBookmarked && (
                              <Bookmark className="w-3.5 h-3.5 fill-[#CD7743] text-[#CD7743] shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : navTab === 'juz' ? (
          /* ================= 2. JUZ LIST ================= */
          <div className="space-y-2 pb-6">
            {/* Collapse/Expand All Toolbar */}
            <div className="flex items-center justify-between px-1.5 pt-0.5 pb-1 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-medium text-stone-600 dark:text-stone-300">30 Portions (Ajza')</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={collapseAllJuz}
                  className="text-[11px] font-medium text-stone-500 hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors cursor-pointer"
                  title="Collapse all Juz"
                >
                  Collapse All
                </button>
                <span className="text-stone-300 dark:text-stone-700">·</span>
                <button
                  type="button"
                  onClick={expandAllJuz}
                  className="text-[11px] font-medium text-stone-500 hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors cursor-pointer"
                  title="Expand all Juz"
                >
                  Expand All
                </button>
              </div>
            </div>

            {Array.from(juzMap.entries()).map(([juzNum, surahList]) => {
              const isJuzActive = surahList.some((s) => s.number === activeSurahNumber);
              const isExpanded = isJuzExpanded(juzNum);

              return (
                <div
                  key={`juz-${juzNum}`}
                  className={`rounded-xl border overflow-hidden transition-all shadow-2xs ${
                    isJuzActive
                      ? 'border-[#CD7743]/45 dark:border-[#CD7743]/50 bg-white dark:bg-[#202025] ring-1 ring-[#CD7743]/20'
                      : 'border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#202025]'
                  }`}
                >
                  {/* Juz Card Header */}
                  <button
                    type="button"
                    onClick={() => toggleJuzExpand(juzNum)}
                    className={`w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isJuzActive
                        ? 'bg-[#CD7743]/8 dark:bg-[#CD7743]/15'
                        : 'hover:bg-stone-50/80 dark:hover:bg-[#25252B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className={`font-mono text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                          isJuzActive
                            ? 'bg-[#CD7743] text-white'
                            : 'bg-stone-100 dark:bg-[#2A2A30] text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        Juz {juzNum}
                      </span>
                      <div className="min-w-0 flex-1 truncate">
                        <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                          Part {juzNum}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          <span className="text-[#596B8E] dark:text-[#788BB3] font-medium">
                            {surahList.length} Surahs included
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-1">
                      <span className="font-quran text-base text-stone-700 dark:text-stone-300">
                        {JUZ_ARABIC_NAMES[juzNum] || `الجزء ${juzNum}`}
                      </span>
                      <div className="p-0.5 text-stone-400">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Surahs Sub-Tray */}
                  {isExpanded && (
                    <div className="border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#1A1A1E]/70 p-2 sm:p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-[#596B8E] dark:text-[#788BB3] px-1 pb-0.5">
                        <span>Surahs in Juz ({surahList.length})</span>
                      </div>
                      {surahList.map((s) => {
                        const isSurahSelected = s.number === activeSurahNumber;
                        return (
                          <button
                            key={`juz-${juzNum}-surah-${s.number}`}
                            onClick={() => {
                              onSelectSurah(s.number);
                              onCloseMobile();
                            }}
                            className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                              isSurahSelected
                                ? 'bg-[#CD7743]/15 dark:bg-[#CD7743]/25 border-[#CD7743]/50 text-[#CD7743] dark:text-[#E08955] font-semibold shadow-2xs'
                                : 'bg-white dark:bg-[#222227] hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/15 border-stone-200/60 dark:border-stone-700/60 text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="font-mono text-[11px] font-semibold text-stone-400 shrink-0">
                                {String(s.number).padStart(3, '0')}
                              </span>
                              <div className="truncate">
                                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                  {s.nameTransliterated}
                                </span>
                                <span className="text-[11px] text-stone-400 ml-1.5">
                                  ({s.versesCount} v)
                                </span>
                              </div>
                            </div>
                            <span className="font-quran text-sm text-stone-500 shrink-0">
                              {s.nameArabic}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= 3. THEMATIC TOPIC EXPLORER ================= */
          <div className="space-y-2 pb-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {QURAN_TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedTopicCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer text-xs ${
                    selectedTopicCategory === cat.id
                      ? 'bg-[#CD7743] text-white font-medium shadow-2xs'
                      : 'bg-stone-100 dark:bg-[#25252A] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {cat.id === 'all'
                    ? 'All'
                    : cat.id === 'creed'
                    ? 'Creed'
                    : cat.id === 'law'
                    ? 'Law'
                    : cat.id === 'ethics'
                    ? 'Morals'
                    : cat.id === 'narrative'
                    ? 'Prophets'
                    : 'Worship'}
                </button>
              ))}
            </div>

            {/* Topic Toolbar */}
            <div className="flex items-center justify-between px-1.5 pt-0.5 pb-1 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span>{filteredTopics.length} Theological Themes</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={collapseAllTopics}
                  className="text-[11px] font-medium text-stone-500 hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors cursor-pointer"
                  title="Collapse all Topics"
                >
                  Collapse All
                </button>
                <span className="text-stone-300 dark:text-stone-700">·</span>
                <button
                  type="button"
                  onClick={expandAllTopics}
                  className="text-[11px] font-medium text-stone-500 hover:text-[#CD7743] dark:hover:text-[#E08955] transition-colors cursor-pointer"
                  title="Expand all Topics"
                >
                  Expand All
                </button>
              </div>
            </div>

            {/* Thematic Topics Cards */}
            <div className="space-y-2">
              {filteredTopics.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-500 dark:text-stone-400">
                  No topics matching your filter.
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const isExpanded = expandedTopics[topic.id] !== false; // default open
                  const isTopicActive = topic.references.some(
                    (r) => r.surahNumber === activeSurahNumber && r.sectionId === activeSectionId
                  );

                  return (
                    <div
                      key={topic.id}
                      className={`rounded-xl border overflow-hidden transition-all shadow-2xs ${
                        isTopicActive
                          ? 'border-[#CD7743]/45 dark:border-[#CD7743]/50 bg-white dark:bg-[#202025] ring-1 ring-[#CD7743]/20'
                          : 'border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#202025]'
                      }`}
                    >
                      {/* Topic Card Header */}
                      <button
                        type="button"
                        onClick={() => toggleTopicExpand(topic.id)}
                        className={`w-full text-left p-3 sm:p-3.5 flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                          isTopicActive
                            ? 'bg-[#CD7743]/8 dark:bg-[#CD7743]/15'
                            : 'hover:bg-stone-50/80 dark:hover:bg-[#25252B]'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#CD7743]/10 text-[#CD7743] dark:text-[#E08955]">
                              {topic.category}
                            </span>
                            {topic.arabicTitle && (
                              <span className="font-quran text-xs text-stone-500 dark:text-stone-400 truncate">
                                {topic.arabicTitle}
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                            {topic.title}
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                            {topic.description}
                          </div>
                        </div>

                        <div className="p-0.5 text-stone-400 shrink-0 self-start mt-0.5">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#CD7743] dark:text-[#E08955]" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Referenced Passages Sub-Tray */}
                      {isExpanded && (
                        <div className="border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#1A1A1E]/70 p-2 sm:p-2.5 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-[#596B8E] dark:text-[#788BB3] px-1 pb-0.5">
                            <span>Referenced Passages ({topic.references.length})</span>
                          </div>
                          {topic.references.map((ref, idx) => {
                            const isRefActive =
                              ref.surahNumber === activeSurahNumber &&
                              ref.sectionId === activeSectionId;
                            return (
                              <button
                                key={`${topic.id}-ref-${idx}`}
                                onClick={() => {
                                  if (onSelectTopicReference) {
                                    onSelectTopicReference(ref);
                                  } else {
                                    onSelectSurah(ref.surahNumber);
                                    onSelectSection(ref.sectionId, ref.surahNumber);
                                  }
                                  onCloseMobile();
                                }}
                                className={`w-full text-left p-2 rounded-lg border transition-all flex flex-col gap-1 group cursor-pointer ${
                                  isRefActive
                                    ? 'bg-[#CD7743]/15 dark:bg-[#CD7743]/25 border-[#CD7743]/50 text-[#CD7743] dark:text-[#E08955] font-semibold shadow-2xs'
                                    : 'bg-white dark:bg-[#222227] hover:bg-[#CD7743]/10 dark:hover:bg-[#CD7743]/15 border-stone-200/60 dark:border-stone-700/60 text-stone-700 dark:text-stone-300'
                                }`}
                              >
                                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-[#CD7743] dark:group-hover:text-[#E08955]">
                                  <span>Surah {ref.surahNumber}: {ref.surahName}</span>
                                  <span className="font-mono text-[11px] text-[#CD7743] dark:text-[#E08955]">
                                    [{ref.verseRange[0]}–{ref.verseRange[1]}]
                                  </span>
                                </div>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                                  {ref.excerpt}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Pane (~350px - 380px for clear reading) */}
      <aside className="hidden lg:block w-[350px] xl:w-[380px] shrink-0 h-screen sticky top-0 z-20">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-84 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
